import React from "react";
import styled from "styled-components";
import { LinkContainer } from "react-router-bootstrap";
import { Container, Nav, Navbar } from "react-bootstrap";
import * as Io from "react-icons/io";
import * as Fa from "react-icons/fa";

import IconWrapper from "./utils/elementWrappers/IconWrapper";
import {
  deDatenschutzLink,
  enDatenschutzLink
} from "./views/legal/legalRoutes";
import { faqLink } from "./views/faq/faqSection";

export const footerHeight = `8rem`;

const Footer = styled.footer`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: ${footerHeight};
  .footer-border {
    border-width: 1px 0px 0px 0px;
    border-style: solid;
    border-color: lightgrey;
  }
  a {
    padding-bottom: 0;
  }
`;

export default () => (
  <Footer>
    <Container className="footer-border">
      <Navbar bg="light" expand="lg" className="m-auto d-block">
        <Nav className="max-width" activeKey={""}>
          <div style={{ width: "100%" }} className="text-center text-lg-left">
            <LinkContainer to={deDatenschutzLink}>
              <Nav.Link eventKey={deDatenschutzLink}>
                Data Policy and Imprint (EN)
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to={enDatenschutzLink}>
              <Nav.Link eventKey={enDatenschutzLink}>
                Datenschutz und Impressum (DE)
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to={faqLink.link}>
              <Nav.Link eventKey={faqLink.link}>{faqLink.displayName}</Nav.Link>
            </LinkContainer>
          </div>
          <div style={{ width: "100%" }} className="d-flex justify-content-end">
            <Nav.Link target="_blank" href="https://twitter.com/MarcBeaujean">
              <IconWrapper Icon={Io.IoLogoTwitter} />
            </Nav.Link>
            <Nav.Link target="_blank" href="https://byteschool.io">
              <IconWrapper Icon={Fa.FaExternalLinkAlt} />
            </Nav.Link>
          </div>
        </Nav>
      </Navbar>
    </Container>
  </Footer>
);
