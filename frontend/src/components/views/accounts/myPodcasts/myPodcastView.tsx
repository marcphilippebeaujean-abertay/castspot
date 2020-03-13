import React, { useState } from "react";
import { useDispatch } from "react-redux";

import Loader from "../../../utils/loader";
import {
  useUserPodcastSelector,
  useUserAuthSelector
} from "../../../../state/typedSelectors";
import { fetchUserPodcastInitData } from "../../../../state/userPodcastsState/userPodcastsActions";
import RSSForm from "./rssSubmissionForm/rssFeedForm";
import PodcastConfirmation from "./podcastConfirmationForm/podcastConfirmationForm";
import PodcastCard from "./podcastCard/userPodcastCard";

export default () => {
  const { authToken } = useUserAuthSelector(state => state.userAuthReducer);
  const { podcastConfirmationIsPending, podcasts } = useUserPodcastSelector(
    state => state.userPodcastsReducer
  );

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  if (podcastConfirmationIsPending === null && loading === false) {
    setLoading(true);
    dispatch(fetchUserPodcastInitData(authToken));
  }
  return (
    <div>
      <h1>My Podcast</h1>
      {podcastConfirmationIsPending === null ? (
        <Loader />
      ) : (
        <div>
          {podcasts.map((podcast, index) => (
            <PodcastCard key={`${index}-user-podcast`} podcast={podcast} />
          ))}
          {!podcastConfirmationIsPending && podcasts.length === 0 ? (
            <RSSForm />
          ) : null}
          {podcastConfirmationIsPending ? <PodcastConfirmation /> : null}
        </div>
      )}
    </div>
  );
};
