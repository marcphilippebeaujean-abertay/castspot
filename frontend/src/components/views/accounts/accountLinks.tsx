import { LinkItem } from "../../utils/navLinkUtils";
import * as Io from "react-icons/io";
import * as Fa from "react-icons/fa";
import * as Md from "react-icons/md";
import IconWrapper from "../../utils/elementWrappers/IconWrapper";
import React from "react";

export const accountBaseRoute: LinkItem = {
  link: "/account/",
  displayName: "Account",
  icon: <IconWrapper Icon={Io.IoIosPerson} />
};

export const settingsLink: LinkItem = {
  link: accountBaseRoute.link + "credentials/",
  displayName: "Credentials",
  icon: <IconWrapper Icon={Io.IoIosKey} />
};

export const contactDetailsLink: LinkItem = {
  link: accountBaseRoute.link + "contact-details/",
  displayName: "Contact Details",
  icon: <IconWrapper Icon={Md.MdContactMail} />
};

export const contactDetailsEditLink: LinkItem = {
  link: accountBaseRoute.link + "contact-details/edit",
  displayName: "Edit Contact Details"
};

export const myPodcastLink: LinkItem = {
  link: accountBaseRoute.link + "podcast/",
  displayName: "My Podcast",
  icon: <IconWrapper Icon={Fa.FaPodcast} />
};

export const myPodcastEditLink: LinkItem = {
  link: myPodcastLink.link + "edit",
  displayName: "Edit Podcast Links"
};

export const profileLink: LinkItem = {
  link: accountBaseRoute.link + "profile/",
  displayName: "Profile",
  icon: <IconWrapper Icon={Io.IoIosToday} />
};

export const getAccountLinksAsArray = (username: string): Array<LinkItem> => {
  return [
    myPodcastLink,
    contactDetailsLink,
    {
      ...settingsLink,
      link: settingsLink.link + username
    }
  ];
};
