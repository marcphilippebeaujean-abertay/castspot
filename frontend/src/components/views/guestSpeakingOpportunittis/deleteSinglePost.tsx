import React from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Io from "react-icons/io";

import IconWrapper from "../../utils/elementWrappers/IconWrapper";
import { useUserAuthSelector } from "../../../state/typedSelectors";
import {
  toggleSubmitButton,
  displaySingleErrorMessageInErrorDiv
} from "../../utils/formUtils";
import { API_UNPUBLISH_GUEST_POST } from "../../../constants/apiUrl";
import {
  setSuccessAlerts,
  setLoadingAlertVisibility
} from "../../../state/alertsState/alertActions";

const SUBMIT_BTN = "unpublishSubmit";
const ERROR_DIV_ID = "unpublishErrorDiv";

export default () => {
  const pathUrl = window.location.pathname;
  const urlParts = pathUrl.split("/");
  const postPk = urlParts[urlParts.length - 1];

  const dispatch = useDispatch();

  const { authToken } = useUserAuthSelector(state => state.userAuthReducer);
  return (
    <div>
      {authToken === null ? (
        <p className="text-danger">
          Warning! This action requires you to be logged in.
        </p>
      ) : (
        <p className="text-danger">
          Warning! This will unpublish the post, users can no longer see and
          apply to it. This is not reversable and winnotes.comll not increase
          the number of posts you can make this month.
        </p>
      )}
      <Button
        id={SUBMIT_BTN}
        variant={"danger"}
        disabled={authToken === null}
        onClick={() => {
          toggleSubmitButton(SUBMIT_BTN);
          setLoadingAlertVisibility("loading");
          axios
            .post(
              API_UNPUBLISH_GUEST_POST,
              { pk: postPk },
              {
                headers: { Authorization: `Token ${authToken}` }
              }
            )
            .then(response => {
              dispatch(setSuccessAlerts(["Post was unpublished!"]));
            })
            .catch((error: any) => {
              displaySingleErrorMessageInErrorDiv(
                ERROR_DIV_ID,
                "Unable to unpublish post! Make sure the url is correct or that you haven't unpublished already."
              );
            })
            .finally(() => setLoadingAlertVisibility("finishing"));
        }}
      >
        <IconWrapper Icon={Io.IoIosTrash} />
        Unpublish Post
      </Button>
      <div id={ERROR_DIV_ID} />
    </div>
  );
};
