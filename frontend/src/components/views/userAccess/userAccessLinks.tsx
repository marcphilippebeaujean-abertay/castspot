import * as Io from "react-icons/io";
import IconWrapper from "../../utils/elementWrappers/IconWrapper";
import React from "react";
import { LinkItem } from "../../utils/navLinkUtils";

export const home: LinkItem = {
  link: "/home",
  displayName: "Home",
  icon: <IconWrapper Icon={Io.IoIosHome} />
};

export const login: LinkItem = {
  link: "/login",
  displayName: "Login",
  icon: <IconWrapper Icon={Io.IoIosLogIn} />
};

export const register: LinkItem = {
  link: "/register",
  displayName: "Sign Up",
  icon: <IconWrapper Icon={Io.IoIosPersonAdd} />
};

export const logout: LinkItem = {
  link: "/home",
  displayName: "Sign Out",
  icon: <IconWrapper Icon={Io.IoIosLogOut} />
};

export const emailConfirmationUrl = "/accounts/confirm-email/";
