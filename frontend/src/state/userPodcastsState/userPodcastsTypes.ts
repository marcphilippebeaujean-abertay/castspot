export const RSS_FEED_SUBMITTED = "rssFeedSubmitted";
export const SET_USER_PODCASTS_INIT_DATA = "setUserPodcastInitData";
export const ADD_USER_PODCAST = "addUserPodcast";
export const UPDATE_PODCAST_DETAILS = "updatePodcastDetails";

export interface PublishingLinks {
  id: Number;
  spotify: string;
  apple_podcast: string;
  website: string;
}

export interface UserPodcast {
  title: string;
  image_link: string;
  rss_url: string;
  publishing_links: PublishingLinks;
}

export interface UserPodcastsState {
  podcastConfirmationIsPending: boolean | null;
  podcasts: Array<UserPodcast>;
}

export interface RssFeedSubmitted {
  type: typeof RSS_FEED_SUBMITTED;
  payload: {};
}

export interface AddPodcast {
  type: typeof ADD_USER_PODCAST;
  podcast: UserPodcast;
}

export interface SetUserPodcastsInitData {
  type: typeof SET_USER_PODCASTS_INIT_DATA;
  payload: UserPodcastsState;
}

export interface UserPodcastApiResponseObject {
  podcast_confirmation_pending: boolean;
  podcasts: Array<UserPodcast>;
}

export interface UpdatePodcastPublishingDetails {
  type: typeof UPDATE_PODCAST_DETAILS;
  publishingLinks: PublishingLinks;
}
