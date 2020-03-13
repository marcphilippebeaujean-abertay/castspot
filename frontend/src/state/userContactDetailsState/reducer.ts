import * as types from "./types";

export const initialState: types.ContactDetailsState = {
  email: null,
  discord: null,
  skype: null
};

export default (
  previousState: types.ContactDetailsState = initialState,
  action: types.SetContactDetails
): types.ContactDetailsState => {
  switch (action.type) {
    case types.SET_CONTACT_DETAILS:
      return action.payload;
  }
  return previousState;
};
