import React from "react";
import { Route, Switch } from "react-router-dom";

import DatenschutzErklaerung from "./datenschutzErklaerung";
import DataPolicy from "./dataPolicyAndImprint";

export const deDatenschutzLink = "/datenschutz-und-impressum";
export const enDatenschutzLink = "/data-policy-and-imprint";

// Route that redirects the user to the home page if accessed while logged in (authorised)
export default () => {
  return (
    <React.Fragment>
      <Switch>
        <Route path={deDatenschutzLink} component={DatenschutzErklaerung} />
        <Route path={enDatenschutzLink} component={DataPolicy} />
      </Switch>
    </React.Fragment>
  );
};
