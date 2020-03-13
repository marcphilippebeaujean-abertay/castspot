import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RouterState } from "connected-react-router";

import { UserState } from "./userAuthState/userAuthTypes";
import { UserProfileState } from "./accountDetailsState/accountDetailTypes";
import { AlertState } from "./alertsState/alertTypes";
import { UserPodcastsState } from "./userPodcastsState/userPodcastsTypes";
import { ContactDetailsState } from "./userContactDetailsState/types";
import { UserPostingState } from "./userPostingState/types";
import * as reducerNames from "./reducerNames";

interface UserStateSelector {
  [reducerNames.USER_AUTH_REDUCER]: UserState;
}

export const useUserAuthSelector: TypedUseSelectorHook<UserStateSelector> = useSelector;

interface ProfileStateSelector {
  [reducerNames.USER_PROFILE_REDUCER]: UserProfileState;
}

export const useProfileSelector: TypedUseSelectorHook<ProfileStateSelector> = useSelector;

interface RouterStateSelector {
  [reducerNames.ROUTE_HISTORY_REDUCER]: RouterState;
}

export const useRouterSelector: TypedUseSelectorHook<RouterStateSelector> = useSelector;

interface AlertStateSelector {
  [reducerNames.ALERTS_REDUCER]: AlertState;
}

export const useAlertsSelector: TypedUseSelectorHook<AlertStateSelector> = useSelector;

interface UserPodcastsSelector {
  [reducerNames.USER_PODCAST_REDUCER]: UserPodcastsState;
}

export const useUserPodcastSelector: TypedUseSelectorHook<UserPodcastsSelector> = useSelector;

interface UserContactDetailsSelector {
  [reducerNames.USER_CONTACT_DETAILS_REDUCER]: ContactDetailsState;
}

export const useUserContactDetailsSelector: TypedUseSelectorHook<UserContactDetailsSelector> = useSelector;

interface UserPostingStateSelector {
  [reducerNames.POSTING_STATE_REDUCER]: UserPostingState;
}

export const useUserPostingStateSelector: TypedUseSelectorHook<UserPostingStateSelector> = useSelector;
