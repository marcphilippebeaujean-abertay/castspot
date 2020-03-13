import axios from "axios";

import * as types from "./accountDetailTypes";
import { API_PROFILE_URL } from "../../constants/apiUrl";
import { setLoadingAlertVisibility } from "../alertsState/alertActions";

const updateUserProfile = (
  userProfileData: types.UserProfileState
): types.UpdateUserProfileAction => {
  return {
    type: types.UPDATE_USER_PROFILE,
    payload: userProfileData
  };
};

export const fetchUserProfileData = (username: string, authToken: string) => {
  return async (dispatch: Function) => {
    dispatch(setLoadingAlertVisibility("loading"));
    axios
      .get(API_PROFILE_URL, {
        headers: { Authorization: "Token " + authToken }
      })
      .then(response => {
        const profileResponse: types.ProfileApiResponseObject = response.data;
        dispatch(
          updateUserProfile({
            firstName: profileResponse.owner.first_name,
            lastName: profileResponse.owner.last_name,
            email: profileResponse.owner.email,
            profileUsername: username
          })
        );
      })
      .catch(error => console.log(error))
      .finally(() => dispatch(setLoadingAlertVisibility("finishing")));
  };
};
