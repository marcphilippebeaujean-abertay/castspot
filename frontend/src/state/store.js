import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createBrowserHistory } from "history";
import { connectRouter, routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";

import * as reducerNames from "./reducerNames";
import userAuthReducer from "./userAuthState/userAuthReducer";
import userProfileReducer from "./accountDetailsState/accountDetailsReducer";
import alertsReducer from "./alertsState/alertReducer";
import userPodcastsReducer from "./userPodcastsState/userPodcastsReducer";
import userContactDetailsReducer from "./userContactDetailsState/reducer";
import userPostingReducer from "./userPostingState/reducer";

export const history = createBrowserHistory();

const createRootReducer = history =>
  combineReducers({
    [reducerNames.USER_AUTH_REDUCER]: userAuthReducer,
    [reducerNames.USER_PROFILE_REDUCER]: userProfileReducer,
    [reducerNames.ROUTE_HISTORY_REDUCER]: connectRouter(history),
    [reducerNames.ALERTS_REDUCER]: alertsReducer,
    [reducerNames.USER_PODCAST_REDUCER]: userPodcastsReducer,
    [reducerNames.USER_CONTACT_DETAILS_REDUCER]: userContactDetailsReducer,
    [reducerNames.POSTING_STATE_REDUCER]: userPostingReducer
  });

export default function configureStore() {
  return createStore(
    createRootReducer(history),
    composeWithDevTools(applyMiddleware(thunk, routerMiddleware(history)))
  );
}
