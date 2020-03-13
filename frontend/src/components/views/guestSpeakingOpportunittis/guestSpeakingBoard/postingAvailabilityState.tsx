import React from "react";
import { useDispatch } from "react-redux";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Io from "react-icons/io";

import {
  useUserPostingStateSelector,
  useUserAuthSelector
} from "../../../../state/typedSelectors";
import { fetchUserPostingState } from "../../../../state/userPostingState/actions";
import { myPodcastLink, contactDetailsLink } from "../../accounts/accountLinks";
import IconWrapper from "../../../utils/elementWrappers/IconWrapper";

export default () => {
  const dispatch = useDispatch();

  const {
    isVerifiedPodcaster,
    hasCreatedContactDetails,
    postsThisMonth,
    applicationsThisMonth
  } = useUserPostingStateSelector(state => state.postingStateReducer);
  const { authToken, sessionActive } = useUserAuthSelector(
    state => state.userAuthReducer
  );

  if (sessionActive !== true) {
    return null;
  }

  if (
    isVerifiedPodcaster == null ||
    hasCreatedContactDetails == null ||
    postsThisMonth == null ||
    applicationsThisMonth == null
  ) {
    dispatch(fetchUserPostingState(authToken));
    return null;
  } else {
    return (
      <div>
        {!isVerifiedPodcaster ? (
          <Alert variant={"danger"}>
            You need to be a verified Podcaster to interact on the site. Please
            visit{" "}
            <Link to={myPodcastLink.link}>
              {myPodcastLink.icon}
              {myPodcastLink.displayName}
            </Link>{" "}
            to link a Podcast to your Account.
          </Alert>
        ) : null}
        {!hasCreatedContactDetails ? (
          <Alert variant={"danger"}>
            Please take a look at your{" "}
            <Link to={contactDetailsLink.link}>
              {contactDetailsLink.icon}
              {contactDetailsLink.displayName}
            </Link>{" "}
            before applying to a post and make sure you know what you are
            sharing with others.
          </Alert>
        ) : null}
        <Alert variant={"info"}>
          <IconWrapper Icon={Io.IoIosInformationCircleOutline} /> You are able
          to post {postsThisMonth} more times this month and send out{" "}
          {applicationsThisMonth} applications
        </Alert>
      </div>
    );
  }
};
