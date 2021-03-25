// Import custom DangerJS rules.
import { warn } from "danger";
// See http://danger.systems/js
import { DangerDSLType } from "danger/distribution/dsl/DangerDSL";
import { isLeft, isRight } from "fp-ts/lib/Either";
import { fromNullable, none } from "fp-ts/lib/Option";
import {
  allStoriesSameType,
  getChangelogPrefixByStories,
  getChangelogScope
} from "./scripts/changelog/ts/changelog";
import { getTicketsFromTitle } from "./scripts/changelog/ts/story/titleParser";

declare const danger: DangerDSLType;

const multipleTypesWarning =
  "Multiple stories with different types are associated with this Pull request.\n" +
  "Only one tag will be added, following the order: `feature > bug > chore`";

const leftTickets = "Something went wrong with getting the ticket ids ";

/**
 * Append the changelog tag and scope to the pull request title
 */
const updatePrTitleForChangelog = async () => {
  const associatedStories = await getTicketsFromTitle(danger.github.pr.title);

  if (associatedStories.some(isLeft)) {
    warn(leftTickets);
    return;
  }

  const foundTicket = associatedStories.filter(isRight).map(x => x.value);

  if (!allStoriesSameType(foundTicket)) {
    warn(multipleTypesWarning);
  }
  const maybePrTag = getChangelogPrefixByStories(foundTicket);
  const eitherScope = getChangelogScope(foundTicket);

  if (eitherScope.isLeft()) {
    eitherScope.value.map(err => warn(err.message));
  }
  const scope = eitherScope
    .getOrElse(none)
    .map(s => `(${s})`)
    .getOrElse("");

  const cleanChangelogRegex = /^(fix(\(.+\))?!?: |feat(\(.+\))?!?: |chore(\(.+\))?!?: )?(.*)$/;
  const title = fromNullable(danger.github.pr.title.match(cleanChangelogRegex))
    .map(matches => matches.pop() || danger.github.pr.title)
    .getOrElse(danger.github.pr.title);

  maybePrTag.map(tag =>
    danger.github.api.pulls.update({
      owner: danger.github.thisPR.owner,
      repo: danger.github.thisPR.repo,
      pull_number: danger.github.thisPR.number,
      title: `${tag}${scope}: ${title}`
    })
  );
};

// checkDangers();
void updatePrTitleForChangelog().then().catch();
