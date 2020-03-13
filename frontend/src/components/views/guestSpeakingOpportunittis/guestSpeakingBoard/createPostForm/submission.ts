import axios from "axios";
import {
  setSuccessAlerts,
  setLoadingAlertVisibility
} from "../../../../../state/alertsState/alertActions";

import {
  hideAllInputErrorMessages,
  displayInputErrorMessages,
  displaySingleErrorMessageInErrorDiv,
  toggleSubmitButton
} from "../../../../utils/formUtils";
import * as fieldnames from "./fieldnames";
import {
  PostFormValueInterface,
  headingMaxCharacters,
  descriptionMaxCharacters
} from "./createPostOverlay";
import { API_GUEST_POST } from "../../../../../constants/apiUrl";
import { incrementPostThisMonth } from "../../../../../state/userPostingState/actions";

const getFaultyInputFieldNames = (formState: PostFormValueInterface) => {
  const faultyInputFieldNames: Array<String> = [];
  if (
    formState[fieldnames.POST_HEADING].length < 8 ||
    formState[fieldnames.POST_HEADING].length > headingMaxCharacters
  ) {
    faultyInputFieldNames.push(fieldnames.POST_HEADING);
  }
  if (formState[fieldnames.DESCRIPTION].length > descriptionMaxCharacters) {
    faultyInputFieldNames.push(fieldnames.DESCRIPTION);
  }
  return faultyInputFieldNames;
};

interface GuestPostPayload {
  heading: string;
  description: string;
  only_podcasters_can_apply: boolean;
}

export default (
  event: React.FormEvent<HTMLFormElement>,
  formInputValues: PostFormValueInterface,
  reduxActionDispatch: Function,
  authToken: string,
  closeOverlay: Function,
  addPostToGrid: Function | null
) => {
  event.preventDefault();
  const formKeys = [];
  for (let key in formInputValues) {
    formKeys.push(key);
  }
  hideAllInputErrorMessages(formKeys);
  const faultyInputFieldNames = getFaultyInputFieldNames(formInputValues);
  if (faultyInputFieldNames.length > 0) {
    displayInputErrorMessages(faultyInputFieldNames);
  } else {
    const postPayload: GuestPostPayload = {
      heading: formInputValues.postHeading,
      description: formInputValues.postDescription,
      only_podcasters_can_apply: formInputValues.onlyPodcasters
    };
    toggleSubmitButton(fieldnames.SUBMIT);
    (document.getElementById(fieldnames.ERROR_DIV) as HTMLElement).innerHTML =
      "";
    reduxActionDispatch(setLoadingAlertVisibility("loading"));
    axios
      .post(API_GUEST_POST, postPayload, {
        headers: { Authorization: `Token ${authToken}` }
      })
      .then(response => {
        reduxActionDispatch(incrementPostThisMonth());
        reduxActionDispatch(
          setSuccessAlerts([`Your post has been published!`])
        );
        closeOverlay();
        if (addPostToGrid !== null) {
          addPostToGrid(response.data);
        }
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
