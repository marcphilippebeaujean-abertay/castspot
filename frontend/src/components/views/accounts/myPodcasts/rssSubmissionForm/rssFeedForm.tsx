import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Io from "react-icons/io";

import { FEED_INPUT, SUBMIT, FORM_ERROR_DIV } from "./rssFeedFieldNames";
import submitForm from "./rssFeedSubmission";
import IconWrapper from "../../../../utils/elementWrappers/IconWrapper";
import { useUserAuthSelector } from "../../../../../state/typedSelectors";
import { API_PODCAST_LISTENNOTES } from "../../../../../constants/apiUrl";

export default () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchingData, setFetchingData] = useState(false);
  const [rssFeed, setRSSFeed] = useState("");
  const dispatch = useDispatch();
  const authToken = useUserAuthSelector(
    state => state.userAuthReducer.authToken
  );
  return (
    <div>
      <Form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          //submitForm(rssFeed, e, dispatch, authToken)
          e.preventDefault();
          setFetchingData(true);
          const config =
            authToken === null
              ? {}
              : {
                  params: {
                    search_term: searchTerm
                  },
                  headers: { Authorization: "Token " + authToken }
                };
          axios
            .get(API_PODCAST_LISTENNOTES, config)
            .then(response => {
              setFetchingData(false);
              console.log(response);
            })
            .catch(error => {
              console.log(error);
            });
        }}
      >
        <Form.Group>
          <Form.Label>
            <IconWrapper Icon={Io.IoIosSearch} />
            Please Search for your Podcast
          </Form.Label>
          <Form.Control
            name={FEED_INPUT}
            value={searchTerm}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              const target = e.currentTarget;
              setSearchTerm(target.value);
            }}
            type="text"
            placeholder="The Joe Rogan Experience"
          ></Form.Control>
          <Form.Text className="d-none text-danger" id={FEED_INPUT + "-error"}>
            Invalid RSS Feed
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="submit">
          <Button id={SUBMIT} variant="primary" type="submit">
            Search
          </Button>
          <div id={FORM_ERROR_DIV}>{/* errors inserted here */}</div>
        </Form.Group>
      </Form>
      <p>
        Podcast search and authentication powered by{" "}
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
