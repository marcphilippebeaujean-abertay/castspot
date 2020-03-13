export const UPDATE_USER_PROFILE = "updateUserProfile";

export interface UserProfileState {
  firstName: string;
  lastName: string;
  email: string;
  profileUsername: string;
}

export interface UpdateUserProfileAction {
  type: typeof UPDATE_USER_PROFILE;
  payload: UserProfileState;
}

export interface ProfileApiResponseObject {
  owner: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  bio: string;
}
