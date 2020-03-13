import React from "react";
import { Card, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import styled from "styled-components";

import { LinkItem } from "../utils/navLinkUtils";

const CardWrapper = styled(Card)`
  z-index: 0;
  .pad-small {
    padding-bottom: 0.5rem;
  }
`;

interface BoxHeader {
  title: string;
  icon: JSX.Element;
}

export default (props: { boxHeader: BoxHeader; links: Array<LinkItem> }) => {
  return (
    <CardWrapper className="text-left">
      {/*<Card.Header className="bg-white">
        {props.boxHeader.icon}
        {props.boxHeader.title}
  </Card.Header>*/}
      <Navbar bg="white" expand="lg" sticky="top" className="p-0">
        <Nav activeKey={""}>
          <Card.Body className="d-flex flex-column">
            {props.links.map(link => (
              <Nav.Item
                className="p-0"
                key={`sidebox-item ${link.displayName}`}
              >
                <LinkContainer to={link.link}>
                  <Nav.Link className="pb-1" eventKey={link.link}>
                    {link.icon}
                    {link.displayName}
                  </Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Card.Body>
        </Nav>
      </Navbar>
    </CardWrapper>
  );
};
