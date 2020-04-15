import axios from "axios";

import * as fieldNames from "./fieldNames";
import {
  displaySingleErrorMessageInErrorDiv,
  toggleSubmitButton
} from "../../../../utils/formUtils";
import { API_PODCAST_CONFIRMATION } from "../../../../../constants/apiUrl";
import { addUserPodcast } from "../../../../../state/userPodcastsState/userPodcastsActions";
import { confirmUserIsPodcaster } from "../../../../../state/userPostingState/actions";
import {
  setLoadingAlertVisibility,
  setSuccessAlerts
} from "../../../../../state/alertsState/alertActions";

export default (
  confirmationCode: string,
  event: React.FormEvent<HTMLFormElement>,
  reduxActionDispatch: Function,
  authToken: string | null
) => {
  event.preventDefault();
  if (authToken === null) return;

  const errorDiv = document.getElementById(
    fieldNames.FORM_ERROR_DIV
  ) as HTMLElement;
  errorDiv.innerHTML = "";
  if (confirmationCode.length !== 8) {
    (document.getElementById(
      fieldNames.CODE_INPUT + `-error`
    ) as HTMLElement).classList.remove("d-none");
    return;
  } else {
    (document.getElementById(
      fieldNames.CODE_INPUT + `-error`
    ) as HTMLElement).classList.add("d-none");
  }

  toggleSubmitButton(fieldNames.SUBMIT);
  const requestData = {
    confirmationCode: confirmationCode
  };
  reduxActionDispatch(setLoadingAlertVisibility("loading"));
  axios
    .post(API_PODCAST_CONFIRMATION, requestData, {
      headers: { Authorization: `Token ${authToken}` }
    })
    .then(response => {
      reduxActionDispatch(addUserPodcast(response.data));
      reduxActionDispatch(confirmUserIsPodcaster());
      reduxActionDispatch(
        setSuccessAlerts(["Added new Podcast to your Account"])
      );
    })
    .catch(error => {
      displaySingleErrorMessageInErrorDiv(
        fieldNames.FORM_ERROR_DIV,
        error.response.data.detail
      );
      toggleSubmitButton(fieldNames.SUBMIT);
    })
    .finally(() => reduxActionDispatch(setLoadingAlertVisibility("finishing")));
};
