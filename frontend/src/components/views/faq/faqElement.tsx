import React, { useState } from "react";
import { Card } from "react-bootstrap";
import styled from "styled-components";
import * as Io from "react-icons/io";

interface Props {
  question: string;
  answer: string;
}

const FAQWrapper = styled(Card)`
  background-color: white;
  padding: 1rem;
  border-radius: 10px;
  color: black;
  max-width: 50rem;
  display: block;
  margin: 0 auto;
  h4 {
    margin: 0 !important;
  }
  p {
    margin: 0 !important;
  }
  :hover {
    cursor: pointer;
  }
  .icon-faq {
    display: inline-block;
    margin-left: 1rem;
    top: -0.1rem;
    position: relative;
    bottom: 10px;
    transition: ease-in 0.2s;
  }
  .icon-faq:hover {
    color: lightgrey;
  }
`;

export default (props: Props) => {
  const [opened, setOpened] = useState(false);
  return (
    <FAQWrapper onClick={() => setOpened(!opened)} className="mb-2">
      <div className="d-flex flex-row">
        <div style={{ width: "100%" }}>
          <p>
            {props.question}
            {opened === false ? (
              <Io.IoIosAddCircleOutline size={30} className="icon-faq" />
            ) : (
              <Io.IoIosRemoveCircleOutline size={30} className="icon-faq" />
            )}
          </p>
        </div>
        <div>
          <div
            style={{ height: "100%" }}
            className="d-flex justify-content-center"
          ></div>
        </div>
      </div>
      <p className={`font-italic ${opened ? "d-block pt-3" : "d-none pt-0"}`}>
        {props.answer}
      </p>
    </FAQWrapper>
  );
};
