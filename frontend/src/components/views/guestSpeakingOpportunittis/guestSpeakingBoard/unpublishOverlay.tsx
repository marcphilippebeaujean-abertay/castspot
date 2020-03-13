import React from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Io from "react-icons/io";

import CardOverlay from "../../../utils/elementWrappers/cardOverlay";
import IconWrapper from "../../../utils/elementWrappers/IconWrapper";
import { useUserAuthSelector } from "../../../../state/typedSelectors";
import {
  toggleSubmitButton,
  displaySingleErrorMessageInErrorDiv
} from "../../../utils/formUtils";
import { API_UNPUBLISH_GUEST_POST } from "../../../../constants/apiUrl";
import { generateWrapperPostId } from "./post";
import { setSuccessAlerts } from "../../../../state/alertsState/alertActions";

interface Props {
  closeOverlay: Function;
  postId: string;
}

const SUBMIT_BTN = "unpublishSubmit";
const ERROR_DIV_ID = "unpublishErrorDiv";

export default (props: Props) => {
  const { authToken } = useUserAuthSelector(state => state.userAuthReducer);
  const dispatch = useDispatch();
  return (
    <CardOverlay
      title={"Are you sure?"}
      closeOverlay={() => props.closeOverlay()}
    >
      <p>
        You still won't be able to create a new post until a month has passed.
      </p>
      <Button
        id={SUBMIT_BTN}
        variant="danger"
        onClick={() => {
          toggleSubmitButton(SUBMIT_BTN);
          axios
            .post(
              API_UNPUBLISH_GUEST_POST,
              { pk: props.postId },
              {
                headers: { Authorization: `Token ${authToken}` }
              }
            )
            .then(response => {
              const postElement = document.getElementById(
                generateWrapperPostId(props.postId)
              ) as HTMLElement;
              postElement.innerHTML = "";
              props.closeOverlay();
              dispatch(setSuccessAlerts(["Post was unpublished!"]));
            })
            .catch((error: any) => {
              displaySingleErrorMessageInErrorDiv(
                ERROR_DIV_ID,
                "Unable to unpublish post!"
              );
              toggleSubmitButton(SUBMIT_BTN);
            });
        }}
      >
        <IconWrapper Icon={Io.IoIosTrash} />
        Confirm
      </Button>
      <div id={ERROR_DIV_ID} />
    </CardOverlay>
  );
};
