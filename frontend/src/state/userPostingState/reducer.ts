import * as types from "./types";

export const initialState: types.UserPostingState = {
  isVerifiedPodcaster: null,
  hasCreatedContactDetails: null,
  postsThisMonth: null,
  applicationsThisMonth: null
};

export default (
  previousState: types.UserPostingState = initialState,
  action:
    | types.IncrementApplicationsThisMonth
    | types.IncrementPostsThisMonth
    | types.SetUserPostingState
    | types.ConfirmUserViewedContacts
): types.UserPostingState => {
  switch (action.type) {
    case types.SET_USER_POSTING_STATE:
      return action.payload;
    case types.INCREMENT_APPLICATIONS_MADE:
      if (previousState.applicationsThisMonth == null) return previousState;
      return {
        ...previousState,
        applicationsThisMonth: previousState.applicationsThisMonth - 1
      };
    case types.INCREMENT_POSTS_MADE:
      if (previousState.postsThisMonth == null) return previousState;
      return {
        ...previousState,
        postsThisMonth: previousState.postsThisMonth - 1
      };
    case types.CONFIRM_USER_VIEWED_CONTACTS:
      return {
        ...previousState,
        hasCreatedContactDetails: true
      };
  }
  return previousState;
};
