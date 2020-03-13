import * as types from "./userPodcastsTypes";

export const initialState: types.UserPodcastsState = {
  podcastConfirmationIsPending: null,
  podcasts: []
};

export default (
  previousState: types.UserPodcastsState = initialState,
  action:
    | types.RssFeedSubmitted
    | types.SetUserPodcastsInitData
    | types.AddPodcast
    | types.UpdatePodcastPublishingDetails
): types.UserPodcastsState => {
  switch (action.type) {
    case types.RSS_FEED_SUBMITTED:
      return {
        ...previousState,
        podcastConfirmationIsPending: true
      };
    case types.SET_USER_PODCASTS_INIT_DATA:
      return action.payload;
    case types.ADD_USER_PODCAST:
      return {
        podcastConfirmationIsPending: false,
        podcasts: [...previousState.podcasts, action.podcast]
      };
    case types.UPDATE_PODCAST_DETAILS:
      const filteredPodcasts = previousState.podcasts.filter(
        p => p.publishing_links.id !== action.publishingLinks.id
      );
      if (filteredPodcasts.length === previousState.podcasts.length) {
        return previousState;
      }
      const podcast = previousState.podcasts.filter(
        p => p.publishing_links.id === action.publishingLinks.id
      )[0];
      podcast.publishing_links = action.publishingLinks;
      filteredPodcasts.push(podcast);
      return {
        ...previousState,
        podcasts: filteredPodcasts
      };
  }
  return previousState;
};
