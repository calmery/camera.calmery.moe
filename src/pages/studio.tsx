import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { useTranslation } from "~/hooks/useTranslation";

const Studio: NextPage = () => {
  const { t } = useTranslation();
  return <div>{t("message")}</div>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  if (process.env.NODE_ENV === "production") {
    return { notFound: true };
  }

  return {
    props: {},
  };
};

export default Studio;
