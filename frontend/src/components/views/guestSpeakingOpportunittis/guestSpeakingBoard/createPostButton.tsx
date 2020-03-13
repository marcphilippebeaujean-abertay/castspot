import React from "react";
import { Button } from "react-bootstrap";
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";
import * as Io from "react-icons/io";

import { setNegativeAlerts } from "../../../../state/alertsState/alertActions";
import IconWrapper from "../../../utils/elementWrappers/IconWrapper";
import { login } from "../../userAccess/userAccessLinks";
import {
  useUserAuthSelector,
  useUserPostingStateSelector
} from "../../../../state/typedSelectors";

interface Props {
  setCreatePostOpen: Function;
}

export default (props: Props) => {
  const { isVerifiedPodcaster, postsThisMonth } = useUserPostingStateSelector(
    state => state.postingStateReducer
  );
  const { sessionActive } = useUserAuthSelector(state => state.userAuthReducer);

  const dispatch = useDispatch();

  return (
    <Button
      variant="success"
      className="mb-2"
      disabled={
        (!isVerifiedPodcaster && sessionActive) ||
        (postsThisMonth !== null && postsThisMonth <= 0)
      }
      onClick={() => {
        if (sessionActive) {
          props.setCreatePostOpen(true);
        } else {
          dispatch(push(login.link));
          dispatch(
            setNegativeAlerts(["You need to be logged in to create a post!"])
          );
        }
      }}
    >
      <IconWrapper Icon={Io.IoIosAdd} />
      Create Post
    </Button>
  );
};
