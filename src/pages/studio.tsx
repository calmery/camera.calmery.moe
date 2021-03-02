import { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const Studio: NextPage = () => {
  const { t } = useTranslation("common");
  return <div>Calmery-Chan Camera Studio {t("message")}</div>;
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
