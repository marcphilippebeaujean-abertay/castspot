import React, { useState, FunctionComponent, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Io from "react-icons/io";

import IconWrapper from "../../../../utils/elementWrappers/IconWrapper";
import CardOverlay from "../../../../utils/elementWrappers/cardOverlay";
import { handleInputChange } from "../../../../utils/formUtils";
import Submit from "./submission";
import * as fieldnames from "./fieldnames";
import { useUserAuthSelector } from "../../../../../state/typedSelectors";
import { GuestPostsContext } from "../providerComponent";

interface Props {
  closeOverlayCallback: Function;
}

export interface PostFormValueInterface {
  [fieldnames.POST_HEADING]: string;
  [fieldnames.DESCRIPTION]: string;
  [fieldnames.ONLY_PODCASTERS_CAN_APPLY]: boolean;
}

export const headingMaxCharacters = 50;
export const descriptionMaxCharacters = 500;

const CreatePostOverlay: FunctionComponent<Props> = props => {
  const { addPostToGrid } = useContext(GuestPostsContext);

  const [formValues, setFormValues] = useState<PostFormValueInterface>({
    [fieldnames.POST_HEADING]: "",
    [fieldnames.DESCRIPTION]: "",
    [fieldnames.ONLY_PODCASTERS_CAN_APPLY]: true
  });
  const dispatch = useDispatch();

  const handleChange = (e: React.FormEvent<HTMLInputElement>) =>
    handleInputChange(e, formValues, setFormValues);

  const { authToken } = useUserAuthSelector(state => state.userAuthReducer);
  return (
    <CardOverlay
      title={"Create a new Post"}
      closeOverlay={() => props.closeOverlayCallback()}
    >
      <Form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
          Submit(
            e,
            formValues,
            dispatch,
            `${authToken}`,
            () => props.closeOverlayCallback(),
            addPostToGrid
          )
        }
      >
        <Form.Group>
          <Form.Label>
            <IconWrapper Icon={Io.IoIosChatboxes} />
            Conversation Topic
          </Form.Label>
          <Form.Control
            name={fieldnames.POST_HEADING}
            value={formValues[fieldnames.POST_HEADING]}
            onChange={handleChange}
            type="text"
            placeholder="Show about Antarctic Sealife"
          ></Form.Control>
          <Form.Text className="text-muted">
            {`${
              formValues[fieldnames.POST_HEADING].length
            }/${headingMaxCharacters}`}
          </Form.Text>
          <Form.Text
            className="d-none text-danger"
            id={fieldnames.POST_HEADING + "-error"}
          >
            Episode topic nees to be between 8 and 50 Characters long
          </Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <IconWrapper Icon={Io.IoIosInformationCircle} /> Description
          </Form.Label>
          <Form.Control
            name={fieldnames.DESCRIPTION}
            value={formValues[fieldnames.DESCRIPTION]}
            onChange={handleChange}
            as="textarea"
            rows="3"
            placeholder="My ideal guest knows their way around the various animal types and their habitat. They should have experience in..."
          ></Form.Control>
          <Form.Text className="text-muted">
            {`${
              formValues[fieldnames.DESCRIPTION].length
            }/${descriptionMaxCharacters}`}
          </Form.Text>
          <Form.Text
            className="d-none text-danger"
            id={fieldnames.DESCRIPTION + "-error"}
          >
            Description can be at most 500 Characters long
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
