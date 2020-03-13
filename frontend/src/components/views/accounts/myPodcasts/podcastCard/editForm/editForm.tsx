import React, { useState, FunctionComponent } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Io from "react-icons/io";
import * as Md from "react-icons/md";
import * as Fa from "react-icons/fa";

import { PublishingLinks } from "../../../../../../state/userPodcastsState/userPodcastsTypes";
import { LabelledLink } from "../../../../../utils/labelledText";
import { useUserAuthSelector } from "../../../../../../state/typedSelectors";
import { handleInputChange } from "../../../../../utils/formUtils";
import formSubmit from "./submission";
import IconWrapper from "../../../../../utils/elementWrappers/IconWrapper";
import * as fieldNames from "../fieldNames";

interface Props {
  initLinksValues: PublishingLinks;
  rssFeed: string;
  toggleEditMode: Function;
}

const PodcastEditForm: FunctionComponent<Props> = ({
  initLinksValues,
  rssFeed,
  toggleEditMode
}) => {
  const SUBMIT_ID = fieldNames.generateSubmitId(rssFeed);
  const ERROR_DIV_ID = fieldNames.generateErrorDiv(rssFeed);

  const [publishingLinks, setPublishinkLinks] = useState<PublishingLinks>(
    initLinksValues
  );

  const updateFormElement = (e: React.FormEvent<HTMLInputElement>) =>
    handleInputChange(e, publishingLinks, setPublishinkLinks);

  const authToken = useUserAuthSelector(
    state => state.userAuthReducer.authToken
  );

  const dispatch = useDispatch();

  return (
    <Form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
        formSubmit(
          e,
          publishingLinks,
          `${authToken}`,
          dispatch,
          () => toggleEditMode(false),
          SUBMIT_ID,
          ERROR_DIV_ID
        )
      }
    >
      <LabelledLink Icon={Io.IoLogoRss} Header={"RSS Feed"} Value={rssFeed} />
      <Form.Group controlId={fieldNames.SPOTIFY} className="mt-3">
        <Form.Label>
          <IconWrapper Icon={Fa.FaSpotify} />
          {fieldNames.HEADER_SPOTIFY}
        </Form.Label>
        <Form.Control
          name={fieldNames.SPOTIFY}
          type="text"
          placeholder="Enter Spotify link"
          value={`${publishingLinks.spotify}`}
          onChange={updateFormElement}
        />
      </Form.Group>
      <Form.Group controlId={fieldNames.APPLE_PODCAST}>
        <Form.Label>
          <IconWrapper Icon={Fa.FaPodcast} />
          {fieldNames.HEADER_APPLE_PODCAST}
        </Form.Label>
        <Form.Control
          name={fieldNames.APPLE_PODCAST}
          type="text"
          placeholder="Enter Apple Podcast link"
          value={`${publishingLinks.apple_podcast}`}
          onChange={updateFormElement}
        />
        <Form.Text
          className="d-none text-danger"
          id={fieldNames.HEADER_APPLE_PODCAST + "-error"}
        >
          Invalid Apple Podcast Link
        </Form.Text>
      </Form.Group>
      <Form.Group controlId={fieldNames.WEBSITE}>
        <Form.Label>
          <IconWrapper Icon={Fa.FaLink} />
          {fieldNames.HEADER_WEBSITE}
        </Form.Label>
        <Form.Control
          name={fieldNames.WEBSITE}
          type="text"
          placeholder="Enter skype username"
          value={`${publishingLinks.website}`}
          onChange={updateFormElement}
        />
      </Form.Group>
      <Form.Group controlId={SUBMIT_ID} className="mb-0 d-flex">
        <Button id={SUBMIT_ID} type="submit" className="mr-2">
          <IconWrapper Icon={Io.IoIosSave} /> Save
        </Button>
        <Button
          onClick={() => toggleEditMode(false)}
          variant="outline-secondary"
        >
          <IconWrapper Icon={Md.MdCancel} /> Cancel
        </Button>
        <div id={ERROR_DIV_ID}>{/* errors inserted here */}</div>
      </Form.Group>
    </Form>
  );
};

export default PodcastEditForm;
