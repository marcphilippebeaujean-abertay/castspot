import React from "react";
import styled from "styled-components";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Container } from "react-bootstrap";

import { DontShowWhenLoggedIn } from "../utils/elementWrappers/authBasedVisibilityWrappers";
import { guestBoard } from "../views/guestSpeakingOpportunittis/links";
import * as linkItems from "../views/userAccess/userAccessLinks";
import UserAccessLinks from "./userAccessLinks";
import AccountsDropdown from "./accountsDropdown";
import CookieBanner from "./cookieBanner";
import LoadingAlertBar from "./loadingAlertBar";

const NavbarStyle = styled.div`
  #nav-bar-main-style {
    display: flex;
    flex-direction: column;
    padding: 0 !important;
    box-shadow: 3px 2px 2px 1px rgba(0, 0, 0, 0.1);
  }
  .max-width {
    display: flex;
    width: 100%;
  }
  .rounded-left-0 {
    border-bottom-left-radius: 0rem !important;
    border-top-left-radius: 0rem !important;
  }
  .rounded-right-0 {
    border-bottom-right-radius: 0rem !important;
    border-top-right-radius: 0rem !important;
  }
  #nav-space-filler {
    padding-bottom: 3.5rem;
  }
  #logo-home-nav {
    width: 30px;
    height: auto;
  }
  .nav-toggle {
    align-self: flex-end;
  }
`;

export default () => {
  return (
    <NavbarStyle>
      <div id="nav-space-filler"></div>
      <Navbar
        bg="white"
        expand="lg"
        fixed="top"
        id="nav-bar-main-style"
        collapseOnSelect
      >
        <CookieBanner />
        <div className="max-width">
          <Container className="pt-2 pb-2">
            <div></div>
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              className="nav-toggle"
            />
            <Navbar.Collapse id="basic-navbar-nav" className="flex-end">
              <Nav className="max-width" activeKey={""}>
                <div className="col-12 col-lg-6 d-block d-lg-flex flex-row">
                  <DontShowWhenLoggedIn>
                    <LinkContainer to={linkItems.home.link}>
                      <Nav.Link eventKey={linkItems.home.link}>
                        {linkItems.home.icon}
                        {linkItems.home.displayName}
                      </Nav.Link>
                    </LinkContainer>
                  </DontShowWhenLoggedIn>
                  <AccountsDropdown />
                  <LinkContainer to={guestBoard.link}>
                    <Nav.Link eventKey={guestBoard.link}>
                      {guestBoard.icon}
                      {guestBoard.displayName}
                    </Nav.Link>
                  </LinkContainer>
                </div>
                <UserAccessLinks />
              </Nav>
            </Navbar.Collapse>
          </Container>
        </div>
        <div className="max-width">
          <LoadingAlertBar />
        </div>
      </Navbar>
      <div className="mt-4"></div>
    </NavbarStyle>
  );
};
