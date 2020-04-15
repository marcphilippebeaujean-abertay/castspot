export const SET_USER_POSTING_STATE = "setUserPostState";
export const INCREMENT_POSTS_MADE = "postCreated";
export const INCREMENT_APPLICATIONS_MADE = "applicationCreated";
export const RESET_POSTING_STATE = "resetPostingState";
export const CONFIRM_USER_VIEWED_CONTACTS = "confirmUserViewedContacts";
export const CONFIRM_USER_IS_PODCASTER = "confirmUserIsPodcaster";

export interface UserPostingState {
  isVerifiedPodcaster: boolean | null;
  hasCreatedContactDetails: boolean | null;
  postsThisMonth: number | null;
  applicationsThisMonth: number | null;
}

export interface SetUserPostingState {
  type: typeof SET_USER_POSTING_STATE;
  payload: UserPostingState;
}

export interface IncrementPostsThisMonth {
  type: typeof INCREMENT_POSTS_MADE;
}

export interface IncrementApplicationsThisMonth {
  type: typeof INCREMENT_APPLICATIONS_MADE;
}

export interface ResetPostingState {
  type: typeof RESET_POSTING_STATE;
}

export interface ConfirmUserViewedContacts {
  type: typeof CONFIRM_USER_VIEWED_CONTACTS;
}

export interface ConfirmUserIsPodcaster {
  type: typeof CONFIRM_USER_IS_PODCASTER;
}
