import * as types from "./accountDetailTypes";

export const initialState: types.UserProfileState = {
  firstName: "",
  lastName: "",
  email: "",
  profileUsername: ""
};

export default (
  previousState: types.UserProfileState = initialState,
  action: types.UpdateUserProfileAction
) => {
  switch (action.type) {
    case types.UPDATE_USER_PROFILE:
      return action.payload.profileUsername !== previousState.profileUsername
        ? action.payload
        : previousState;
  }
  return previousState;
};
