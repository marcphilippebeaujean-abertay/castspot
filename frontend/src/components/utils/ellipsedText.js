import React from "react";

import styled from "styled-components";

export default styled.p`
  white-space: nowrap;
  width: 100%;
  overflow: hidden; /* "overflow"-Wert darf nicht "visible" sein */
  text-overflow: ellipsis;
  margin-bottom: 0 !important;
`;

const EllipsedLinkStyle = styled.a`
  display: block;
  white-space: nowrap;
  text-decoration: none;
  width: 100%;
  overflow: hidden; /* "overflow"-Wert darf nicht "visible" sein */
  text-overflow: ellipsis;
`;

export const EllipsedLink = ({ children, href }) => {
  return (
    <EllipsedLinkStyle href={href} target="_blank" className="st-link">
      {children}
    </EllipsedLinkStyle>
  );
};
