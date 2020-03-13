import React from "react";
import { Card, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import * as Io from "react-icons/io";
import * as Fa from "react-icons/fa";

import IconWrapper from "../../../utils/elementWrappers/IconWrapper";
import { LabelledText } from "../../../utils/labelledText";
import { contactDetailsEditLink } from "../accountLinks";
import {
  emailTextHeader,
  discordTextHeader,
  skypeTextHeader
} from "./fieldHeaders";
import { ContactDetailsState } from "./provider";
import { useUserPostingStateSelector } from "../../../../state/typedSelectors";
import { confirmUserViewedContacts } from "../../../../state/userPostingState/actions";

interface Props {
  contactDetails: ContactDetailsState;
}

export default (props: Props) => {
  const dispatch = useDispatch();
  const { email, discord, skype } = props.contactDetails;

  const { hasCreatedContactDetails } = useUserPostingStateSelector(
    state => state.postingStateReducer
  );

  if (!hasCreatedContactDetails) {
    dispatch(confirmUserViewedContacts());
  }
  return (
    <Card>
      <Card.Body>
        <LabelledText
          Icon={Io.IoIosMail}
          Header={emailTextHeader}
          Value={`${email}`}
        />
        <LabelledText
          Icon={Fa.FaDiscord}
          Header={discordTextHeader}
          Value={`${discord}`}
        />
        <LabelledText
          Icon={Fa.FaSkype}
          Header={skypeTextHeader}
          Value={`${skype}`}
        />
        <Button onClick={() => dispatch(push(contactDetailsEditLink.link))}>
          <IconWrapper Icon={Io.IoMdCreate} /> Edit
        </Button>
      </Card.Body>
    </Card>
  );
};
