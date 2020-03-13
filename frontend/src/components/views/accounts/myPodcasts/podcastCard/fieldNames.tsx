export const PODCAST_RSS = "podcastRSS";
export const APPLE_PODCAST = "apple_podcast";
export const SPOTIFY = "spotify";
export const WEBSITE = "website";

export const HEADER_PODCAST_RSS = "RSS Feed";
export const HEADER_SPOTIFY = "Spotify";
export const HEADER_APPLE_PODCAST = "Apple Podcast";
export const HEADER_WEBSITE = "Website";

export const generateErrorDiv = (rssFeed: string) => `error-div-${rssFeed}`;
export const generateSubmitId = (rssFeed: string) => `submit-${rssFeed}`;
