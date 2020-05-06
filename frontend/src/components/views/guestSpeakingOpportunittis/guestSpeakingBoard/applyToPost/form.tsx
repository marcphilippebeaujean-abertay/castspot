import React, { useState, FunctionComponent } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Io from "react-icons/io";

import IconWrapper from "../../../../utils/elementWrappers/IconWrapper";
import CardOverlay from "../../../../utils/elementWrappers/cardOverlay";
import Submit from "./submission";
import * as fieldnames from "./fieldnames";
import { enDatenschutzLink } from "../../../legal/legalRoutes";
import { contactDetailsLink } from "../../../accounts/accountLinks";
import { handleInputChange } from "../../../../utils/formUtils";
import { useUserAuthSelector } from "../../../../../state/typedSelectors";
import { Link } from "react-router-dom";

interface Props {
  closeOverlayCallback: Function;
  postId: string;
}

export const messageMaxCharacters = 500;

const CreatePostOverlay: FunctionComponent<Props> = props => {
  const [formValues, setFormValues] = useState({
    [fieldnames.MESSAGE]: "",
    [fieldnames.AGREED_TO_TERMS]: false
  });
  const dispatch = useDispatch();

  const handleChange = (e: React.FormEvent<HTMLInputElement>) =>
    handleInputChange(e, formValues, setFormValues);

  const { authToken } = useUserAuthSelector(state => state.userAuthReducer);
  return (
    <CardOverlay
      title={"Apply to Post"}
      closeOverlay={() => props.closeOverlayCallback()}
    >
      <Form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          Submit(
            e,
            formValues[fieldnames.MESSAGE],
            formValues[fieldnames.AGREED_TO_TERMS],
            props.postId,
            dispatch,
            `${authToken}`,
            props.closeOverlayCallback
          );
        }}
      >
        <Form.Group>
          <Form.Label>
            <IconWrapper Icon={Io.IoIosInformationCircle} /> Application Message
          </Form.Label>
          <Form.Control
            name={fieldnames.MESSAGE}
            value={formValues[fieldnames.MESSAGE]}
            onChange={handleChange}
            as="textarea"
            rows="3"
            placeholder="Hi! I saw you were looking for an expert on rare animals. My own podcast happense to cover these topics and..."
          ></Form.Control>
          <Form.Text className="text-muted">
            {`${formValues[fieldnames.MESSAGE].length}/${messageMaxCharacters}`}
          </Form.Text>
          <Form.Text
            className="d-none text-danger"
            id={fieldnames.MESSAGE + "-error"}
          >
            Message can be at most 500 Characters long
          </Form.Text>
        </Form.Group>
        <Form.Group controlId={fieldnames.AGREED_TO_TERMS}>
          <div className="d-flex m-0">
            <Form.Check
              name={fieldnames.AGREED_TO_TERMS}
              type="checkbox"
              checked={formValues[fieldnames.AGREED_TO_TERMS]}
              onChange={handleChange}
            />
            <p className="m-0">
              I agree to share my
              <Link to={contactDetailsLink.link} className="st-link">
                Contact Details
              </Link>{" "}
              with another user and the
              <Link to={enDatenschutzLink} className="st-link">
                Data Policy
              </Link>
            </p>
          </div>
          <Form.Text
            className="d-none text-danger"
            id={fieldnames.AGREED_TO_TERMS + "-error"}
          >
            You need to agree to the Terms to use our Service
          </Form.Text>
        </Form.Group>
        <Form.Group controlId={fieldnames.SUBMIT} className="mb-0">
          <Button type="submit" id={fieldnames.SUBMIT}>
            Submit
          </Button>
          <div id={fieldnames.ERROR_DIV} />
        </Form.Group>
      </Form>
    </CardOverlay>
  );
};

export default CreatePostOverlay;
