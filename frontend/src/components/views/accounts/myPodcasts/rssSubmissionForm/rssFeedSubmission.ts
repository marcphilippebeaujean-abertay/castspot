import axios from "axios";

import * as fieldNames from "./rssFeedFieldNames";
import {
  displaySingleErrorMessageInErrorDiv,
  toggleSubmitButton
} from "../../../../utils/formUtils";
import { API_INIT_RSS_FEED_CONFIRM } from "../../../../../constants/apiUrl";
import { rssFeedSubmitted } from "../../../../../state/userPodcastsState/userPodcastsActions";
import {
  setSuccessAlerts,
  setLoadingAlertVisibility
} from "../../../../../state/alertsState/alertActions";

export default (
  rssFeed: string,
  event: React.FormEvent<HTMLFormElement>,
  reduxActionDispatch: Function,
  authToken: string | null
) => {
  event.preventDefault();
  if (authToken === null) return;
  toggleSubmitButton(fieldNames.SUBMIT);
  const errorDiv = document.getElementById(
    fieldNames.FORM_ERROR_DIV
  ) as HTMLElement;
  errorDiv.innerHTML = "";
  reduxActionDispatch(setLoadingAlertVisibility("loading"));
  axios
    .post(
      API_INIT_RSS_FEED_CONFIRM,
      { rssFeed: rssFeed },
      {
        headers: { Authorization: `Token ${authToken}` }
      }
    )
    .then(response => {
      reduxActionDispatch(rssFeedSubmitted());
      reduxActionDispatch(
        setSuccessAlerts([
          "RSS Feed submitted - please check the email provided in the feed to confirm your podcast."
        ])
      );
      reduxActionDispatch(setLoadingAlertVisibility("finishing"));
    })
    .catch(error => {
      displaySingleErrorMessageInErrorDiv(
        fieldNames.FORM_ERROR_DIV,
        error.response.data.detail
      );
      toggleSubmitButton(fieldNames.SUBMIT);
    })
    .finally(() => reduxActionDispatch(setLoadingAlertVisibility("loading")));
};
