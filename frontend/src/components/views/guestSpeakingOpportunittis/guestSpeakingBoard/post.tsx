import React, { useContext } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";
import * as Io from "react-icons/io";
import * as Fa from "react-icons/fa";
import styled from "styled-components";

import { GuestPostsContext } from "./providerComponent";
import IconWrapper from "../../../utils/elementWrappers/IconWrapper";
import EllipsedText from "../../../utils/ellipsedText";
import {
  useUserAuthSelector,
  useUserPostingStateSelector
} from "../../../../state/typedSelectors";
import { setNegativeAlerts } from "../../../../state/alertsState/alertActions";
import { login } from "../../userAccess/userAccessLinks";

const PodcastImage = styled.img`
  display: block;
  max-width: 50px;
  height: auto;
`;

const GuestPostRow = styled.div`
  .post-wrapper {
    border-width: 1px 0px 0px 0px;
    border-style: solid;
    border-color: lightgrey;
    padding: 10px 0px;
    display: flex;
    flex-direction: row;
    max-width: 100%;
    color: black;
    text-decoration: none !important;
  }
  :hover {
    text-decoration: none !important;
  }
  .post-wrapper:hover {
    cursor: pointer;
    text-decoration: none !important;
  }
  p {
    margin-bottom: 0.1rem;
    color: black !important;
  }
  .post-wrapper:visited small {
    color: grey !important;
  }
  .post-wrapper:visited p {
    color: grey !important;
  }
  .post-wrapper:hover small {
    color: rgba(0, 0, 0, 0.6) !important;
  }
  .post-wrapper:hover p {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.6) !important;
  }
  .post-wrapper:hover img {
    opacity: 0.5 !important;
  }
  .post-header {
  }
`;

export interface GuestPostData {
  id: string;
  heading: string;
  description: string;
  host: string;
  has_already_applied: boolean;
  podcast: {
    title: string;
    image_link: string;
    rss_url: string;
  };
}

interface GuestPostProps {
  guestPostData: GuestPostData | null;
}

export const generatePostButtonId = (postUuid: string) =>
  `post-btn-${postUuid}`;
export const generateWrapperPostId = (postUuid: string) => `post-${postUuid}`;

export default (props: GuestPostProps) => {
  const { username, sessionActive } = useUserAuthSelector(
    state => state.userAuthReducer
  );

  const {
    applicationsThisMonth,
    isVerifiedPodcaster
  } = useUserPostingStateSelector(state => state.postingStateReducer);

  const { guestPostData } = props;
  const {
    setCurrentDetailedPost,
    setApplicationPostId,
    setPostToUnpublish
  } = useContext(GuestPostsContext);
  if (
    guestPostData === null ||
    setCurrentDetailedPost === null ||
    setApplicationPostId === null ||
    setPostToUnpublish === null
  ) {
    return null;
  }
  const dispatch = useDispatch();

  const userIsPoster = username === guestPostData.host;
  const ActionButton = (buttonProps: any) => {
    if (userIsPoster) {
      return (
        <Button
          className="text-nowrap"
          variant="danger"
          onClick={(e: React.MouseEvent) => {
            setPostToUnpublish(guestPostData.id);
            e.stopPropagation();
          }}
        >
          <IconWrapper Icon={Io.IoIosTrash} />
          Unpublish
        </Button>
      );
    } else {
      let applyButtonIsDisabled = false;
      if (applicationsThisMonth == null || applicationsThisMonth <= 0) {
        applyButtonIsDisabled = true;
      } else if (isVerifiedPodcaster == null || isVerifiedPodcaster === false) {
        applyButtonIsDisabled = true;
      }
      return guestPostData.has_already_applied ? (
        <p className="text-md-center">Already Applied!</p>
      ) : (
        <Button
          className="text-nowrap"
          disabled={applyButtonIsDisabled && sessionActive}
          onClick={(e: React.MouseEvent) => {
            if (sessionActive) {
              setApplicationPostId(guestPostData.id);
            } else {
              dispatch(push(login.link));
              dispatch(
                setNegativeAlerts([
                  "You need to be logged in to apply to posts!"
                ])
              );
            }
            e.stopPropagation();
          }}
        >
          <IconWrapper Icon={Io.IoIosSend} />
          Apply
        </Button>
      );
    }
  };

  return (
    <GuestPostRow
      id={generateWrapperPostId(guestPostData.id)}
      onClick={() => setCurrentDetailedPost(guestPostData)}
    >
      <a className="post-wrapper" href={`#post-${guestPostData.id}`}>
        <div className="align-middle col-2 col-md-1 pl-0">
          <PodcastImage
            className="m-auto"
            src={guestPostData.podcast.image_link}
            alt={`Logo image for podcast ${guestPostData.podcast.title}`}
          />
        </div>
        <div className="col-md-10 col-10">
          <Row>
            <Col md={5}>
              <small className="text-black">
                <IconWrapper Icon={Io.IoIosChatboxes} />
                Conversation Topic
              </small>
              <EllipsedText className="post-header ">
                {guestPostData.heading}
              </EllipsedText>
            </Col>
            <Col md={5}>
              <small>
                <IconWrapper Icon={Fa.FaPodcast} />
                Podcast
              </small>
              <EllipsedText>{guestPostData.podcast.title}</EllipsedText>
            </Col>
            <Col md={2} className="d-flex flex-row justify-content-start">
              <div className="d-md-flex flex-column justify-content-center">
                <ActionButton />
              </div>
            </Col>
          </Row>
        </div>
      </a>
    </GuestPostRow>
  );
};
