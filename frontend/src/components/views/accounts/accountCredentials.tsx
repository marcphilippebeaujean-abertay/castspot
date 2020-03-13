import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Io from "react-icons/io";

import IconWrapper from "../../utils/elementWrappers/IconWrapper";
import { useProfileSelector } from "../../../state/typedSelectors";
import { useUserAuthSelector } from "../../../state/typedSelectors";
import { fetchUserProfileData } from "../../../state/accountDetailsState/accountDetailsActions";
import { passwordResetRequest } from "../userAccess/passwordReset/passwordResetLinks";
import { marginBottom } from "../../utils/labelledText";
import Loader from "../../utils/loader";

export default () => {
  const previousProfileUsername = useProfileSelector(
    state => state.userAuthProfileReducer.profileUsername
  );
  const { email } = useProfileSelector(state => state.userAuthProfileReducer);

  const authToken = useUserAuthSelector(
    state => state.userAuthReducer.authToken
  );

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const pathUrl = window.location.pathname;
  const urlParts = pathUrl.split("/");
  const profileUsername = urlParts[urlParts.length - 1];

  if (previousProfileUsername !== profileUsername) {
    if (authToken !== null && loading === false) {
      setLoading(true);
      dispatch(fetchUserProfileData(profileUsername, authToken));
    }
  } else {
    if (loading === true) {
      setLoading(false);
    }
  }
  return (
    <div>
      <h1>Credentials</h1>
      {loading === true ? (
        <Loader />
      ) : (
        <Card className="mb-2">
          <Card.Body>
            <small>
              <IconWrapper Icon={Io.IoIosPerson} />
              Username
            </small>
            <p className={marginBottom}>{profileUsername}</p>
            <small>
              <IconWrapper Icon={Io.IoIosMail} />
              Email
            </small>
            <p className={marginBottom}>{email}</p>
            <small>
              <IconWrapper Icon={Io.IoIosLock} />
              Password
            </small>
            <p className="mb-0">
              Unsure about the safety of your password?{" "}
              <Link to={passwordResetRequest.link} className="st-link">
                {passwordResetRequest.displayName}
              </Link>
            </p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};
