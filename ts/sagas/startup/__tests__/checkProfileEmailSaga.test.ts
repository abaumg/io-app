import { expectSaga } from "redux-saga-test-plan";

import {
  EmailString,
  FiscalCode,
  NonEmptyString
} from "italia-ts-commons/lib/strings";
import { UserProfile } from "../../../../definitions/backend/UserProfile";
import { Version } from "../../../../definitions/backend/Version";
import { UserProfileUnion } from "../../../api/backend";
import {
  navigateToEmailInsertScreen,
  navigateToEmailReadScreen,
  navigateToEmailValidateScreen
} from "../../../store/actions/navigation";
import { checkAcknowledgedEmailSaga } from "../checkAcknowledgedEmailSaga";

const userProfileWithEmailAndValidated: UserProfileUnion = {
  has_profile: true,
  is_inbox_enabled: true,
  is_webhook_enabled: true,
  is_email_enabled: true,
  is_email_validated: true,
  email: "test@example.com" as EmailString,
  spid_email: "test@example.com" as EmailString,
  family_name: "Connor",
  name: "John",
  fiscal_code: "ABCDEF83A12L719R" as FiscalCode,
  spid_mobile_phone: "123" as NonEmptyString,
  version: 1 as Version
};

describe("checkAcceptedTosSaga", () => {
  describe("when user has an email and it is validated", () => {
    it("should do nothing", () => {
      return expectSaga(
        checkAcknowledgedEmailSaga,
        userProfileWithEmailAndValidated
      )
        .not.put(navigateToEmailReadScreen())
        .run();
    });
  });

  describe("when user is on his first onboarding and he has an email and it is validated", () => {
    const profileEmailValidatedFirstOnboarding: UserProfile = {
      ...userProfileWithEmailAndValidated,
      version: 0
    };
    it("should show email read screen", () => {
      return expectSaga(
        checkAcknowledgedEmailSaga,
        profileEmailValidatedFirstOnboarding
      )
        .put(navigateToEmailReadScreen())
        .run();
    });
  });

  describe("when user has an email and it not is validated", () => {
    const profileWithEmailNotValidated: UserProfile = {
      ...userProfileWithEmailAndValidated,
      is_email_validated: false
    };
    it("should prompt the screen to remember to validate", () => {
      return expectSaga(
        checkAcknowledgedEmailSaga,
        profileWithEmailNotValidated
      )
        .put(navigateToEmailValidateScreen())
        .run();
    });
  });

  describe("when user has not an email", () => {
    const profileWithNoEmail: UserProfile = {
      ...userProfileWithEmailAndValidated,
      is_email_validated: false,
      email: undefined
    };
    it("should prompt the screen to insert it", () => {
      return expectSaga(checkAcknowledgedEmailSaga, profileWithNoEmail)
        .put(navigateToEmailInsertScreen())
        .run();
    });
  });
});
