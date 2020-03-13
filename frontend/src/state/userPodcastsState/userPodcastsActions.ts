import axios from "axios";

import * as types from "./userPodcastsTypes";
import { API_GET_USER_PODCAST_DATA } from "../../constants/apiUrl";
import { setLoadingAlertVisibility } from "../alertsState/alertActions";

export const rssFeedSubmitted = (): types.RssFeedSubmitted => {
  return {
    type: types.RSS_FEED_SUBMITTED,
    payload: {}
  };
};

const setUserPodcastsInitData = (
  userPodcastApiResponseData: types.UserPodcastApiResponseObject
): types.SetUserPodcastsInitData => {
  return {
    type: types.SET_USER_PODCASTS_INIT_DATA,
    payload: {
      podcastConfirmationIsPending:
        userPodcastApiResponseData.podcast_confirmation_pending,
      podcasts: userPodcastApiResponseData.podcasts
    }
  };
};

export const addUserPodcast = (
  podcast: types.UserPodcast
): types.AddPodcast => {
  return {
    type: types.ADD_USER_PODCAST,
    podcast: podcast
  };
};

export const fetchUserPodcastInitData = (authToken: string | null) => {
  return async (dispatch: Function) => {
    dispatch(setLoadingAlertVisibility("loading"));
    axios
      .get(API_GET_USER_PODCAST_DATA, {
        headers: { Authorization: "Token " + authToken }
      })
      .then(response => {
        const profileResponse: types.UserPodcastApiResponseObject =
          response.data;
        dispatch(setUserPodcastsInitData(profileResponse));
      })
      .catch(error => console.log(error.response.data.detail))
      .finally(() => dispatch(setLoadingAlertVisibility("finishing")));
  };
};

export const updatePodcastPublishingDetails = (
  publishingDetails: types.PublishingLinks
): types.UpdatePodcastPublishingDetails => {
  return {
    type: types.UPDATE_PODCAST_DETAILS,
    publishingLinks: publishingDetails
  };
};
