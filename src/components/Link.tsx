import _Link, { LinkProps } from "next/link";
import React from "react";
import { Locale } from "~/locales";

export const Link: React.FC<LinkProps & { locale?: Locale }> = (props) => (
  <_Link {...props} />
);
