import React from "react";
import { Route, Switch } from "react-router-dom";

import RegisterPage from "./registration/form";
import LoginPage from "./login/form";
import ConfirmEmail from "./registration/emailConfirmation";

import { login, register, emailConfirmationUrl } from "./userAccessLinks";

// Route that redirects the user to the home page if accessed while logged in (authorised)
export default () => {
  return (
    <React.Fragment>
      <Switch>
        <Route path={emailConfirmationUrl} component={ConfirmEmail} />
        <Route path={register.link} component={RegisterPage} />
        <Route path={login.link} component={LoginPage} />
      </Switch>
    </React.Fragment>
  );
};
