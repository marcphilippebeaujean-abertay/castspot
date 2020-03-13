import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";
import * as Io from "react-icons/io";
import * as Md from "react-icons/md";

import {
  EMAIL_FIELD_HEADER,
  DISCORD_FIELD_HEADER,
  SKYPE_FIELD_HEADER
} from "../fieldHeaders";
import { useUserAuthSelector } from "../../../../../state/typedSelectors";
import { ContactDetailsState } from "../../../../../state/userContactDetailsState/types";
import { contactDetailsLink } from "../../accountLinks";
import { handleInputChange } from "../../../../utils/formUtils";
import formSubmit from "./submission";
import IconWrapper from "../../../../utils/elementWrappers/IconWrapper";
import * as fieldNames from "./fieldNames";

interface Props {
  contactDetails: ContactDetailsState;
  setContactDetails: Function | null;
}

export default (props: Props) => {
  const [contactDetails, setContactDetails] = useState<ContactDetailsState>(
    props.contactDetails
  );

  const updateFormElement = (e: React.FormEvent<HTMLInputElement>) =>
    handleInputChange(e, contactDetails, setContactDetails);

  const authToken = useUserAuthSelector(
    state => state.userAuthReducer.authToken
  );

  const dispatch = useDispatch();
  return props.setContactDetails === null ? null : (
    <Card>
      <Card.Body>
        <Form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
            formSubmit(
              e,
              contactDetails,
              `${authToken}`,
              dispatch,
              props.setContactDetails
            )
          }
        >
          <Form.Group controlId={fieldNames.EMAIL}>
            <Form.Label>{EMAIL_FIELD_HEADER}</Form.Label>
            <Form.Control
              name={fieldNames.EMAIL}
              type="email"
              placeholder="Enter email"
              value={`${contactDetails.email}`}
              onChange={updateFormElement}
            />
            <Form.Text
              className="d-none text-danger"
              id={fieldNames.EMAIL + "-error"}
            >
              Invalid Email
            </Form.Text>
          </Form.Group>
          <Form.Group controlId={fieldNames.DISCORD}>
            <Form.Label>{DISCORD_FIELD_HEADER}</Form.Label>
            <Form.Control
              name={fieldNames.DISCORD}
              type="text"
              placeholder="Enter discord username"
              value={`${contactDetails.discord}`}
              onChange={updateFormElement}
            />
          </Form.Group>
          <Form.Group controlId={fieldNames.SKYPE}>
            <Form.Label>{SKYPE_FIELD_HEADER}</Form.Label>
            <Form.Control
              name={fieldNames.SKYPE}
              type="text"
              placeholder="Enter skype username"
              value={`${contactDetails.skype}`}
              onChange={updateFormElement}
            />
          </Form.Group>
          <Form.Group controlId={fieldNames.SUBMIT} className="mb-0 d-flex">
            <Button id={fieldNames.SUBMIT} type="submit" className="mr-2">
              <IconWrapper Icon={Io.IoIosSave} /> Save
            </Button>
            <Button
              onClick={() => dispatch(push(contactDetailsLink.link))}
              variant="outline-secondary"
            >
              <IconWrapper Icon={Md.MdCancel} /> Cancel
            </Button>
            <div id={fieldNames.ERROR_DIV}>{/* errors inserted here */}</div>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};
