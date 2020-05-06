import axios from "axios";
import { push } from "connected-react-router";
import { login } from "../userAccessLinks";
import {
  setSuccessAlerts,
  setLoadingAlertVisibility
} from "../../../../state/alertsState/alertActions";

import {
  hideAllInputErrorMessages,
  displayInputErrorMessages,
  displayServerErrorMessagesInErrorDiv,
  toggleSubmitButton
} from "../../../utils/formUtils";
import {
  USERNAME,
  PASSWORD,
  EMAIL,
  LEGAL_AGREEMENT,
  SUBMIT,
  FORM_ERROR_DIV_ID
} from "./fieldNames";
import { UserRegistrationForm } from "./form";
import { API_REGISTRATION_URL } from "../../../../constants/apiUrl";
//import { emailRegex, passwordRegex } from "../../../../constants/regex";

interface RegistrationPayload {
  username: string;
  password1: string;
  password2: string;
  email: string;
}

const getFaultyInputFieldNames = (formState: UserRegistrationForm) => {
  const faultyInputFieldNames: Array<String> = [];
  if (formState.username.length < 6 || /\s/g.test(formState.username)) {
    faultyInputFieldNames.push(USERNAME);
  }
  if (formState.password.length < 6) {
    faultyInputFieldNames.push(PASSWORD);
  }
  if (formState.email.length < 6) {
    faultyInputFieldNames.push(EMAIL);
  }
  //if (!emailRegex.test(formState.password)) {
  //  faultyInputFieldNames.push(PASSWORD);
  //}
  //if (!passwordRegex.test(formState.email)) {
  //  faultyInputFieldNames.push(EMAIL);
  //}
  //if (formState.password !== formState.repeatPassword) {
  //  faultyInputFieldNames.push(REPEATED_PASSWORD);
  //}
  if (!formState.legalAgreement) {
    faultyInputFieldNames.push(LEGAL_AGREEMENT);
  }
  return faultyInputFieldNames;
};

export default (
  event: React.FormEvent<HTMLFormElement>,
  formInputValues: UserRegistrationForm,
  reduxActionDispatch: Function
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
    const registrationPayload: RegistrationPayload = {
      username: formInputValues.username,
      email: formInputValues.email,
      password1: formInputValues.password,
      password2: formInputValues.password
    };
    toggleSubmitButton(SUBMIT);
    (document.getElementById(FORM_ERROR_DIV_ID) as HTMLElement).innerHTML = "";
    reduxActionDispatch(setLoadingAlertVisibility("loading"));
    axios
      .post(API_REGISTRATION_URL, registrationPayload)
      .then(response => {
        reduxActionDispatch(push(login.link));
        reduxActionDispatch(
          setSuccessAlerts([
            `We sent an email to ${formInputValues.email} - please confirm it to activate your account!`
          ])
        );
      })
      .catch((error: any) => {
        console.log(error);
        if (error["response"] !== undefined) {
          displayServerErrorMessagesInErrorDiv(
            FORM_ERROR_DIV_ID,
            error.response.data
          );
          toggleSubmitButton(SUBMIT);
        }
      })
      .finally(() =>
        reduxActionDispatch(setLoadingAlertVisibility("finishing"))
      );
  }
};
