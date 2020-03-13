import React from "react";
import { LinkContainer } from "react-router-bootstrap";

import * as accountLinks from "../views/accounts/accountLinks";
import Dropdown from "./dropdown";
import { NavDropdown, Nav } from "react-bootstrap";
import { ShowOnlyWhenLoggedIn } from "../utils/elementWrappers/authBasedVisibilityWrappers";
import { useUserAuthSelector } from "../../state/typedSelectors";

export default () => {
  const username = useUserAuthSelector(state => state.userAuthReducer.username);
  return (
    <ShowOnlyWhenLoggedIn>
      <Nav activeKey={accountLinks.accountBaseRoute}>
        <Dropdown
          link={accountLinks.accountBaseRoute}
          activeKey={accountLinks.accountBaseRoute.link}
        >
          {username !== null
            ? accountLinks.getAccountLinksAsArray(username).map(link => (
                <LinkContainer
                  to={link.link}
                  key={`accounts dropdown linke ${link.displayName}`}
                >
                  <NavDropdown.Item>
                    {link.icon}
                    {link.displayName}
                  </NavDropdown.Item>
                </LinkContainer>
              ))
            : null}
        </Dropdown>
      </Nav>
    </ShowOnlyWhenLoggedIn>
  );
};
