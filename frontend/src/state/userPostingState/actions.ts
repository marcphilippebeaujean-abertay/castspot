import axios from "axios";
import { API_POSTING_AVAILABILITY } from "../../constants/apiUrl";

import * as types from "./types";

export const setUserPostState = (
  initUserPostingState: types.UserPostingState
): types.SetUserPostingState => {
  return {
    type: types.SET_USER_POSTING_STATE,
    payload: initUserPostingState
  };
};

export const incrementPostThisMonth = (): types.IncrementPostsThisMonth => {
  return {
    type: types.INCREMENT_POSTS_MADE
  };
};

export const incrementApplicationsThisMonth = (): types.IncrementApplicationsThisMonth => {
  return {
    type: types.INCREMENT_APPLICATIONS_MADE
  };
};

export const resetPostingState = (): types.ResetPostingState => {
  return {
    type: types.RESET_POSTING_STATE
  };
};

export const confirmUserViewedContacts = (): types.ConfirmUserViewedContacts => {
  return {
    type: types.CONFIRM_USER_VIEWED_CONTACTS
  };
};

export const fetchUserPostingState = (authToken: string | null) => {
  return async (dispatch: Function) => {
    if (authToken !== null) {
      axios
        .get(API_POSTING_AVAILABILITY, {
          headers: { Authorization: `Token ${authToken}` }
        })
        .then(response => {
          const data: types.UserPostingState = response.data;
          dispatch(setUserPostState(data));
        })
        .catch(e => {
          console.log(e);
        });
    }
  };
};
