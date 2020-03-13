import React from "react";
import { Route } from "react-router-dom";

import { useUserAuthSelector } from "../../../state/typedSelectors";
import {
  getAccountLinksAsArray,
  accountBaseRoute,
  settingsLink,
  myPodcastLink,
  contactDetailsLink
} from "./accountLinks";
import NavSidebox from "../../navigation/navSidebox";

import AccountDetailsView from "./accountCredentials";
import MyPodcastView from "./myPodcasts/myPodcastView";
import ContactDetailsView from "./contactDetails/provider";

export default () => {
  const username = useUserAuthSelector(state => state.userAuthReducer.username);
  return (
    <Route path={accountBaseRoute.link}>
      <div className="row">
        <div className="col-md-4 d-none d-md-block text-center">
          <NavSidebox
            boxHeader={{
              title: accountBaseRoute.displayName,
              icon: accountBaseRoute.icon
            }}
            links={getAccountLinksAsArray(username)}
          />
        </div>
        <div className="col-md-8">
          <Route path={settingsLink.link} component={AccountDetailsView} />
          <Route path={myPodcastLink.link} component={MyPodcastView} />
          <Route
            path={contactDetailsLink.link}
            component={ContactDetailsView}
          />
        </div>
      </div>
    </Route>
  );
};
