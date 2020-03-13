import React, { useState } from "react";
import * as Io from "react-icons/io";

import { GuestPostData } from "./post";
import GuestPostGrid from "./grid";
import GuestPostDetailsOverlay from "./detailsOverlay";
import CreatePostOverlay from "./createPostForm/createPostOverlay";
import ApplyToPostOverlay from "./applyToPost/form";
import UnpublishPost from "./unpublishOverlay";
import PostingState from "./postingAvailabilityState";
import CreatePostButton from "./createPostButton";
import IconWrapper from "../../../utils/elementWrappers/IconWrapper";

interface GuestPostsContext {
  currentDetailedPost: GuestPostData | null;
  setCurrentDetailedPost: Function | null;
  addPostToGrid: Function | null;
  setApplicationPostId: Function | null;
  setPostToUnpublish: Function | null;
}

export const GuestPostsContext = React.createContext<GuestPostsContext>({
  currentDetailedPost: null,
  setCurrentDetailedPost: null,
  addPostToGrid: null,
  setApplicationPostId: null,
  setPostToUnpublish: null
});

export default () => {
  const [currentDetailedPost, setCurrentDetailedPost] = useState(null);
  const [applicationPostId, setApplicationPostId] = useState(null);
  const [postToUnpublish, setPostToUnpublish] = useState(null);
  const [displayedPosts, setDisplayedPosts] = useState<
    Array<GuestPostData> | undefined
  >(undefined);

  const [createPostOpen, setCreatePostOpen] = useState(false);

  const addPostToGrid = (postDetail: GuestPostData) => {
    if (displayedPosts !== undefined) {
      setDisplayedPosts([postDetail, ...displayedPosts]);
    }
  };

  return (
    <GuestPostsContext.Provider
      value={{
        currentDetailedPost,
        setCurrentDetailedPost,
        addPostToGrid,
        setApplicationPostId,
        setPostToUnpublish
      }}
    >
      <GuestPostDetailsOverlay />
      <PostingState />
      <CreatePostButton setCreatePostOpen={setCreatePostOpen} />
      <p>
        <IconWrapper Icon={Io.IoIosInformationCircle} />
        <span className="d-md-none">Tap</span>{" "}
        <span className="d-none d-md-inline-block">Click</span> posts for more
        information
      </p>
      {postToUnpublish === null ? null : (
        <UnpublishPost
          closeOverlay={() => setPostToUnpublish(null)}
          postId={`${postToUnpublish}`}
        />
      )}
      {createPostOpen === true ? (
        <CreatePostOverlay
          closeOverlayCallback={() => setCreatePostOpen(false)}
        />
      ) : null}
      {applicationPostId === null ? null : (
        <ApplyToPostOverlay
          closeOverlayCallback={() => setApplicationPostId(null)}
          postId={`${applicationPostId}`}
        />
      )}
      <GuestPostGrid posts={displayedPosts} setPosts={setDisplayedPosts} />
    </GuestPostsContext.Provider>
  );
};
