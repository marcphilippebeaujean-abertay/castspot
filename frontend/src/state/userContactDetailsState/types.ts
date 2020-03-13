export const SET_CONTACT_DETAILS = "setContactDetails";

export interface ContactDetailsState {
  email: string | null;
  discord: string | null;
  skype: string | null;
}

export interface SetContactDetails {
  type: typeof SET_CONTACT_DETAILS;
  payload: ContactDetailsState;
}
