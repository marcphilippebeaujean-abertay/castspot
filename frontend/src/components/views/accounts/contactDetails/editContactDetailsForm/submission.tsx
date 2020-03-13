import axios from "axios";
import { push } from "connected-react-router";

import {
  setSuccessAlerts,
  setLoadingAlertVisibility
} from "../../../../../state/alertsState/alertActions";
import { ContactDetailsState } from "../../../../../state/userContactDetailsState/types";
import {
  hideAllInputErrorMessages,
  displayInputErrorMessages,
  displaySingleErrorMessageInErrorDiv,
  toggleSubmitButton
} from "../../../../utils/formUtils";
import * as fieldNames from "./fieldNames";
import { contactDetailsLink } from "../../accountLinks";
import { API_USER_CONTACT_DETAILS_VIEW } from "../../../../../constants/apiUrl";

const getFaultyInputFieldNames = (formState: ContactDetailsState) => {
  const faultyInputFieldNames: Array<String> = [];
  if (
    !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(`${formState.email}`)
  ) {
    faultyInputFieldNames.push(fieldNames.EMAIL);
  }
  return faultyInputFieldNames;
};

export default (
  event: React.FormEvent<HTMLFormElement>,
  contactDetails: ContactDetailsState,
  authToken: string,
  reduxActionDispatch: Function,
  setContactDetails: Function | null
) => {
  event.preventDefault();
  const formKeys = [];
  for (let key in fieldNames) {
    formKeys.push(key);
  }
  hideAllInputErrorMessages(formKeys);
  const faultyInputFieldNames = getFaultyInputFieldNames(contactDetails);
  if (faultyInputFieldNames.length > 0) {
    displayInputErrorMessages(faultyInputFieldNames);
  } else {
    const registrationPayload: ContactDetailsState = contactDetails;
    toggleSubmitButton(fieldNames.SUBMIT);
    (document.getElementById(fieldNames.ERROR_DIV) as HTMLElement).innerHTML =
      "";
    reduxActionDispatch(setLoadingAlertVisibility("loading"));
    axios
      .post(API_USER_CONTACT_DETAILS_VIEW, registrationPayload, {
        headers: { Authorization: `Token ${authToken}` }
      })
      .then(response => {
        reduxActionDispatch(push(contactDetailsLink.link));
        reduxActionDispatch(
          setSuccessAlerts([`Your contact details have been updated.`])
        );
        if (setContactDetails !== null) {
          setContactDetails(contactDetails);
        }
      })
      .catch((error: any) => {
        displaySingleErrorMessageInErrorDiv(
          fieldNames.ERROR_DIV,
          error.reponse.data
        );
        toggleSubmitButton(fieldNames.SUBMIT);
      })
      .finally(() =>
        reduxActionDispatch(setLoadingAlertVisibility("finishing"))
      );
  }
};
