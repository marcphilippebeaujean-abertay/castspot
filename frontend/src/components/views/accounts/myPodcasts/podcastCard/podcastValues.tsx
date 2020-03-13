import React, { FunctionComponent } from "react";
import * as Io from "react-icons/io";
import * as Fa from "react-icons/fa";

import { UserPodcast } from "../../../../../state/userPodcastsState/userPodcastsTypes";
import { LabelledLink } from "../../../../utils/labelledText";
import * as fieldNames from "./fieldNames";

interface PodcastCardProps {
  podcast: UserPodcast;
}

const PodcastInfo: FunctionComponent<PodcastCardProps> = ({ podcast }) => {
  return (
    <div>
      <LabelledLink
        Icon={Io.IoLogoRss}
        Header={fieldNames.HEADER_PODCAST_RSS}
        Value={podcast.rss_url}
      />
      <LabelledLink
        Icon={Fa.FaSpotify}
        Header={fieldNames.HEADER_SPOTIFY}
        Value={podcast.publishing_links.spotify}
      />
      <LabelledLink
        Icon={Fa.FaPodcast}
        Header={fieldNames.HEADER_APPLE_PODCAST}
        Value={podcast.publishing_links.apple_podcast}
      />
      <LabelledLink
        Icon={Fa.FaLink}
        Header={fieldNames.HEADER_WEBSITE}
        Value={podcast.publishing_links.website}
      />
    </div>
  );
};

export default PodcastInfo;
