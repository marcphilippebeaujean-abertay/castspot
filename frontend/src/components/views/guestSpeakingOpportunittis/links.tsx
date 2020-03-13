import React from "react";
import * as Io from "react-icons/io";

import IconWrapper from "../../utils/elementWrappers/IconWrapper";
import { LinkItem } from "../../utils/navLinkUtils";

export const guestBoard: LinkItem = {
  link: "/guest-board",
  displayName: "Guest Speaking Opportunities",
  icon: <IconWrapper Icon={Io.IoIosMegaphone} />
};

export const deletePostUrl = "/delete-post/";
