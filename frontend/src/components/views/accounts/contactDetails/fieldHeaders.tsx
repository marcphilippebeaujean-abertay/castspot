import React from "react";
import * as Io from "react-icons/io";
import * as Fa from "react-icons/fa";

import IconWrapper from "../../../utils/elementWrappers/IconWrapper";

export const emailTextHeader = "Contact Email";
export const discordTextHeader = "Discord Username";
export const skypeTextHeader = "Skype Username";

export const EMAIL_FIELD_HEADER = (
  <small>
    <IconWrapper Icon={Io.IoIosMail} />
    {emailTextHeader}
  </small>
);

export const DISCORD_FIELD_HEADER = (
  <small>
    <IconWrapper Icon={Fa.FaDiscord} />
    {discordTextHeader}
  </small>
);

export const SKYPE_FIELD_HEADER = (
  <small>
    <IconWrapper Icon={Fa.FaSkype} />
    {skypeTextHeader}
  </small>
);
