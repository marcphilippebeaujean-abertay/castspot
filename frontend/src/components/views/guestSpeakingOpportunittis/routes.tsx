import React from "react";
import { Route } from "react-router-dom";

import { guestBoard, deletePostUrl } from "./links";
import GuestSpeakingBoard from "./guestSpeakingBoard/providerComponent";
import DeleteSinglePost from "./deleteSinglePost";

export default () => {
  return (
    <React.Fragment>
      <Route path={deletePostUrl} component={DeleteSinglePost} />
      <Route path={guestBoard.link} component={GuestSpeakingBoard} />
    </React.Fragment>
  );
};
