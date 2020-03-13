import axios from "axios";

import {
  setSuccessAlerts,
  setLoadingAlertVisibility
} from "../../../../../../state/alertsState/alertActions";
import { PublishingLinks } from "../../../../../../state/userPodcastsState/userPodcastsTypes";
import { updatePodcastPublishingDetails } from "../../../../../../state/userPodcastsState/userPodcastsActions";
import {
  hideAllInputErrorMessages,
  displayInputErrorMessages,
  displaySingleErrorMessageInErrorDiv,
  toggleSubmitButton
} from "../../../../../utils/formUtils";
import * as fieldNames from "../fieldNames";
import { API_UPDATE_PUBLICATION_LINKS } from "../../../../../../constants/apiUrl";

const getFaultyInputFieldNames = (formState: PublishingLinks) => {
  const faultyInputFieldNames: Array<String> = [];
  return faultyInputFieldNames;
};

export default (
  event: React.FormEvent<HTMLFormElement>,
  publishingLinks: PublishingLinks,
  authToken: string,
  reduxActionDispatch: Function,
  exitEditMode: Function,
  submitBtnId: string,
  errorDivId: string
) => {
  event.preventDefault();
  const formKeys = [];
  for (let key in fieldNames) {
    formKeys.push(key);
  }
  hideAllInputErrorMessages(formKeys);
  const faultyInputFieldNames = getFaultyInputFieldNames(publishingLinks);
  if (faultyInputFieldNames.length > 0) {
    displayInputErrorMessages(faultyInputFieldNames);
  } else {
    toggleSubmitButton(submitBtnId);
    (document.getElementById(errorDivId) as HTMLElement).innerHTML = "";
    reduxActionDispatch(setLoadingAlertVisibility("loading"));
    axios
      .post(API_UPDATE_PUBLICATION_LINKS, publishingLinks, {
        headers: {
          Authorization: `Token ${authToken}`
        }
      })
      .then(response => {
        exitEditMode();
        reduxActionDispatch(
          setSuccessAlerts([`Podcast publishing details have been updated.`])
        );
        reduxActionDispatch(updatePodcastPublishingDetails(publishingLinks));
      })
      .catch((error: any) => {
        displaySingleErrorMessageInErrorDiv(errorDivId, error.reponse.data);
        toggleSubmitButton(submitBtnId);
      })
      .finally(() =>
        reduxActionDispatch(setLoadingAlertVisibility("finishing"))
      );
  }
};
