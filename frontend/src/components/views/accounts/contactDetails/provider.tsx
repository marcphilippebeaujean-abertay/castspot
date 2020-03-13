import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

import Loader from "../../../utils/loader";
import ContactDetailsDisplay from "./view";
import { API_USER_CONTACT_DETAILS_VIEW } from "../../../../constants/apiUrl";
import ContactDetailsForm from "./editContactDetailsForm/form";
import { contactDetailsEditLink, contactDetailsLink } from "../accountLinks";
import { useUserAuthSelector } from "../../../../state/typedSelectors";
import { setLoadingAlertVisibility } from "../../../../state/alertsState/alertActions";

export interface ContactDetailsState {
  email: string | null;
  discord: string | null;
  skype: string | null;
}

export default () => {
  const dispatch = useDispatch();

  const { authToken } = useUserAuthSelector(state => state.userAuthReducer);

  const [
    contactDetails,
    setContactDetails
  ] = useState<ContactDetailsState | null>(null);
  const [loading, setLoading] = useState(false);

  if (contactDetails === null && loading === false) {
    setLoading(true);
    dispatch(setLoadingAlertVisibility("loading"));
    axios
      .get(API_USER_CONTACT_DETAILS_VIEW, {
        headers: { Authorization: "Token " + authToken }
      })
      .then(response => {
        const contactDetails: ContactDetailsState = response.data;
        setContactDetails(contactDetails);
      })
      .catch(error => console.log(error))
      .finally(() => dispatch(setLoadingAlertVisibility("finishing")));
  } else {
    return (
      <div>
        <h1>Contact Details</h1>
        {contactDetails === null ? (
          <Loader />
        ) : (
          <div>
            <small>These will only be shared with your permission.</small>
            <Switch>
              <Route
                exact
                path={contactDetailsEditLink.link}
                component={ContactDetailsForm}
              >
                <ContactDetailsForm
                  setContactDetails={setContactDetails}
                  contactDetails={contactDetails}
                />
              </Route>
              <Route path={contactDetailsLink.link}>
                <ContactDetailsDisplay contactDetails={contactDetails} />
              </Route>
            </Switch>
          </div>
        )}
      </div>
    );
  }
};
