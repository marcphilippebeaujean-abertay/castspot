import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Io from "react-icons/io";

import { FEED_INPUT, SUBMIT, FORM_ERROR_DIV } from "./rssFeedFieldNames";
import submitForm from "./rssFeedSubmission";
import IconWrapper from "../../../../utils/elementWrappers/IconWrapper";
import { useUserAuthSelector } from "../../../../../state/typedSelectors";

export default () => {
  const [rssFeed, setRSSFeed] = useState("");
  const dispatch = useDispatch();
  const authToken = useUserAuthSelector(
    state => state.userAuthReducer.authToken
  );
  return (
    <div>
      <Form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
          submitForm(rssFeed, e, dispatch, authToken)
        }
      >
        <Form.Group>
          <Form.Label>
            <IconWrapper Icon={Io.IoLogoRss} />
            RSS Feed
          </Form.Label>
          <Form.Control
            name={FEED_INPUT}
            value={rssFeed}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const target = e.currentTarget;
              setRSSFeed(target.value);
            }}
            type="text"
            placeholder="mypodcast.com/rss.xml"
          ></Form.Control>
          <Form.Text className="d-none text-danger" id={FEED_INPUT + "-error"}>
            Invalid RSS Feed
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="submit">
          <Button id={SUBMIT} variant="primary" type="submit">
            Submit
          </Button>
          <div id={FORM_ERROR_DIV}>{/* errors inserted here */}</div>
        </Form.Group>
      </Form>
      <p>
        RSS feed authentication powered by{" "}
        <a
          href="https://www.listennotes.com/"
          rel="noopener noreferrer"
          className="st-link"
          target="_blank"
        >
          listennotes
        </a>
      </p>
    </div>
  );
};
