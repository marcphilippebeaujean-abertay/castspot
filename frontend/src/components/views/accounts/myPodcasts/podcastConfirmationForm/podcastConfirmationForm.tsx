import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { CODE_INPUT, SUBMIT, FORM_ERROR_DIV } from "./fieldNames";
import submitForm from "./submission";
import { useUserAuthSelector } from "../../../../../state/typedSelectors";

export default () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const dispatch = useDispatch();
  const authToken = useUserAuthSelector(
    state => state.userAuthReducer.authToken
  );
  return (
    <Form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
        submitForm(confirmationCode, e, dispatch, authToken)
      }
    >
      <Form.Group>
        <Form.Label>
          Please enter the Confirmation Code sent to you via Email
        </Form.Label>
        <Form.Control
          name={CODE_INPUT}
          value={confirmationCode}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            const target = e.currentTarget;
            setConfirmationCode(target.value);
          }}
          type="text"
          placeholder=""
        ></Form.Control>
        <Form.Text className="d-none text-danger" id={CODE_INPUT + "-error"}>
          Invalid Code
        </Form.Text>
      </Form.Group>
      <Form.Group controlId="submit">
        <Button id={SUBMIT} variant="primary" type="submit">
          Submit
        </Button>
        <div id={FORM_ERROR_DIV}>{/* errors inserted here */}</div>
      </Form.Group>
    </Form>
  );
};
