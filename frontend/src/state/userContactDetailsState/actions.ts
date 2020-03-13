import axios from "axios";

import * as types from "./types";
import { API_USER_CONTACT_DETAILS_VIEW } from "../../constants/apiUrl";

export const setContactDetails = (
  contactDetails: types.ContactDetailsState
): types.SetContactDetails => {
  return {
    type: types.SET_CONTACT_DETAILS,
    payload: contactDetails
  };
};

export const fetchContactDetails = (authToken: string | null) => {
  return async (dispatch: Function) => {
    axios
      .get(API_USER_CONTACT_DETAILS_VIEW, {
        headers: { Authorization: "Token " + authToken }
      })
      .then(response => {
        const contactDetails: types.ContactDetailsState = response.data;
        dispatch(setContactDetails(contactDetails));
      })
      .catch(error => console.log(error));
  };
};
