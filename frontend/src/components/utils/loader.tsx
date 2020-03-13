import React from "react";
import { Spinner } from "react-bootstrap";
import styled from "styled-components";

import { themeColour } from "../../constants/style";

const SpinnerWrapper = styled.div`
  margin-top: 4rem;
  width: 100%;
  div {
    color: ${themeColour};
  }
`;

export default () => {
  return (
    <SpinnerWrapper>
      <Spinner animation="border" className="ml-auto mr-auto d-block" />
    </SpinnerWrapper>
  );
};
