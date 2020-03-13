import axios from "axios";
import {
  setSuccessAlerts,
  setLoadingAlertVisibility
} from "../../../../../state/alertsState/alertActions";

import {
  displayInputErrorMessages,
  displaySingleErrorMessageInErrorDiv,
  toggleSubmitButton
} from "../../../../utils/formUtils";
import * as fieldnames from "./fieldnames";
import { messageMaxCharacters } from "./form";
import { API_SPEAKING_APPLICATION } from "../../../../../constants/apiUrl";
import { incrementPostThisMonth } from "../../../../../state/userPostingState/actions";
import { generatePostButtonId } from "../post";

export default (
  event: React.FormEvent<HTMLFormElement>,
  applicationMessage: string,
  agreedToTerms: boolean,
  postUuid: string,
  reduxActionDispatch: Function,
  authToken: string,
  closeOverlay: Function
) => {
  event.preventDefault();
  console.log("sending submission");
  const badInputs = [];
  if (!agreedToTerms) {
    badInputs.push(fieldnames.AGREED_TO_TERMS);
  }
  if (applicationMessage.length > messageMaxCharacters) {
    badInputs.push(fieldnames.MESSAGE);
  }
  if (badInputs.length > 0) {
    displayInputErrorMessages(badInputs);
  } else {
    toggleSubmitButton(fieldnames.SUBMIT);
    (document.getElementById(fieldnames.ERROR_DIV) as HTMLElement).innerHTML =
      "";
    reduxActionDispatch(setLoadingAlertVisibility("loading"));
    axios
      .post(
        API_SPEAKING_APPLICATION,
        { guestPostId: postUuid },
        {
          headers: { Authorization: `Token ${authToken}` }
        }
      )
      .then(response => {
        reduxActionDispatch(
          setSuccessAlerts([
            `You have applied to the post! You have ${response.data.remainingApplications} applications left for the month!`
          ])
        );
        reduxActionDispatch(incrementPostThisMonth());
        toggleSubmitButton(fieldnames.SUBMIT);
        const buttonId = generatePostButtonId(postUuid);
        (document.getElementById(buttonId) as HTMLElement).innerHTML =
          "<p>Already Applied!</p>";
        closeOverlay();
      })
      .catch((error: any) => {
        displaySingleErrorMessageInErrorDiv(
          fieldnames.ERROR_DIV,
          error.response.data.detail
        );
        toggleSubmitButton(fieldnames.SUBMIT);
      })
      .finally(() =>
        reduxActionDispatch(setLoadingAlertVisibility("finishing"))
      );
  }
};
