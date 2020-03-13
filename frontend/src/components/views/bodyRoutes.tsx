import React from "react";
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";

import AccountRoutes from "./accounts/accountRoutes";
import UserAccessRoutes from "./userAccess/userAccessRoutes";
import PasswordResetRoutes from "./userAccess/passwordReset/passwordResetRoutes";
import GuestPostRoutes from "./guestSpeakingOpportunittis/routes";
import LegalRoutes from "./legal/legalRoutes";
import { useRouterSelector } from "../../state/typedSelectors";
import { home } from "./userAccess/userAccessLinks";

export default () => {
  const dispatch = useDispatch();

  const path = useRouterSelector(state => state.router.location.pathname);
  if (path === "/") {
    dispatch(push(home.link));
  }

  return (
    <React.Fragment>
      {/* TODO wo sind email confirmation */}
      <AccountRoutes />
      <UserAccessRoutes />
      <PasswordResetRoutes />
      <GuestPostRoutes />
      <LegalRoutes />
    </React.Fragment>
  );
};
