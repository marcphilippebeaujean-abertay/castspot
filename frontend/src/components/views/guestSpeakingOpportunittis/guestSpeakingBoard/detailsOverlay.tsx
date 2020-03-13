import React, { FunctionComponent, useContext } from "react";
import * as Io from "react-icons/io";
import * as Fa from "react-icons/fa";

import { LabelledText } from "../../../utils/labelledText";
import CardOverlay from "../../../utils/elementWrappers/cardOverlay";
import { GuestPostsContext } from "./providerComponent";

const PostDetailsOverlay: FunctionComponent = () => {
  const { currentDetailedPost, setCurrentDetailedPost } = useContext(
    GuestPostsContext
  );
  if (currentDetailedPost === null || setCurrentDetailedPost === null) {
    return null;
  }
  const closeOverlay = () => setCurrentDetailedPost(null);
  return (
    <CardOverlay title={`Post Details`} closeOverlay={closeOverlay}>
      <LabelledText
        Icon={Io.IoIosChatboxes}
        Header={"Conversation Topic"}
        Value={currentDetailedPost.heading}
      />
      <LabelledText
        Header={"Podcast"}
        Value={currentDetailedPost.podcast.title}
        Icon={Fa.FaPodcast}
      />
      <LabelledText
        Header={"Description"}
        Value={currentDetailedPost.description}
        Icon={Io.IoIosInformationCircle}
        Ellipsed={false}
      />
    </CardOverlay>
  );
};

export default PostDetailsOverlay;
