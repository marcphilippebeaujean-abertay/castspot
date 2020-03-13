export const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000/api/"
    : document.location.origin + "/api/";
export const API_RESTAUTH_URL = API_URL + "rest-auth/";
export const API_REGISTRATION_URL = API_RESTAUTH_URL + "registration/";

// Specific endpoints
export const API_LOGIN_URL = API_RESTAUTH_URL + "login/";
export const API_LOGOUT_URL = API_RESTAUTH_URL + "logout/";
export const API_CONFIRM_EMAIL = API_REGISTRATION_URL + "verify-email/";
export const API_PROFILE_URL = API_URL + "account-details/";

export const API_PASSWORD_REQUEST = API_RESTAUTH_URL + "password/";
export const API_PASSWORD_RESET_REQUEST = API_PASSWORD_REQUEST + "reset/";
export const API_PASSWORD_RESET_CONFIRM =
  API_PASSWORD_RESET_REQUEST + "confirm/";

export const API_INIT_RSS_FEED_CONFIRM = API_URL + "rss-feed-confirmation/";

export const API_PODCAST_CONFIRMATION = API_URL + "podcast-confirmation/";
export const API_GET_USER_PODCAST_DATA = API_URL + "podcast-user-data/";
export const API_UPDATE_PUBLICATION_LINKS = API_URL + `publishing-links/`;

export const API_USER_CONTACT_DETAILS_VIEW = API_URL + "user-contact-details/";

export const API_GUEST_POST = API_URL + `guest-posts/`;
export const API_GUEST_POST_LIST = (page: string) =>
  API_GUEST_POST + `?page=${page}`;

export const API_SPEAKING_APPLICATION = API_URL + "speaking-application/";
export const API_UNPUBLISH_GUEST_POST = API_URL + "unpublish-post/";
export const API_POSTING_AVAILABILITY = API_URL + "posting-availability/";
