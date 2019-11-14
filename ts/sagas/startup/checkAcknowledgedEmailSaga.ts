import { Effect } from "redux-saga";
import { cancel, fork, put, take, takeEvery } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { UserProfile } from "../../../definitions/backend/UserProfile";
import {
  navigateToEmailInsertScreen,
  navigateToEmailReadScreen,
  navigateToEmailValidateScreen
} from "../../store/actions/navigation";
import { emailAcknowledged, emailInsert } from "../../store/actions/onboarding";
import {
  hasProfileEmail,
  isProfileEmailValidated,
  isProfileFirstOnBoarding
} from "../../store/reducers/profile";

/**
 * Launch email saga that consists of:
 * If user have an existing email:
 * - acknowledgement screen if email already exists and it is valid and the user
 *   does not want to change it
 * - editing and validation screen, otherwise
 *
 * If user doesn't have an email, an add email screen is provided
 */
export function* checkAcknowledgedEmailSaga(
  userProfile: UserProfile
): IterableIterator<Effect> {
  // Check if user profile has email
  // TODO: put email existence check here
  // To test #168246944 set emailExists = true;
  // To test #168247020, #168247105 set emailExists = false;
  if (hasProfileEmail(userProfile)) {
    // Email exists

    // Check if email is valid
    // TODO: put email validation API query here
    // To test #168246944 set isValid = true;
    // To test #168247105 set isValid = false;

    if (!isProfileEmailValidated(userProfile)) {
      // If email exists but it is not validate we show a screen as a reminder to validate it or
      // where the user can edit the email added but not validated yet
      yield put(navigateToEmailValidateScreen({}));
    }
    // if the user profile is just created (first onboarding) we show
    // the screen where user's email used in app is displayed
    else if (isProfileFirstOnBoarding(userProfile)) {
      yield put(navigateToEmailReadScreen({ isFromProfileSection: false }));
    } else {
      return;
    }
  } else {
    // No email is provided, user must insert the Email address.
    yield put(navigateToEmailInsertScreen({ isFromProfileSection: false }));
  }

  const watchEditEmailSagaTask = yield fork(watchEditEmailSaga);

  // Wait for the user to press "Continue" button after having checked out
  // theirs own email
  yield take(emailAcknowledged);

  yield cancel(watchEditEmailSagaTask);
}

export function* watchEditEmailSaga(): Iterator<Effect> {
  yield takeEvery([getType(emailInsert)], function*() {
    // Wait for the user to press "Continue" button after having inserted
    // theirs own email
    yield put(navigateToEmailValidateScreen({}));
  });
}
