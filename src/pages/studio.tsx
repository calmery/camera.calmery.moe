import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Link } from "~/components/Link";
import { useTranslation } from "~/hooks/useTranslation";

const Studio: NextPage = () => {
  const { pathname } = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <div>{t("message")}</div>
      <Link href={pathname} locale="en">
        English
      </Link>
      <Link href={pathname} locale="ja">
        日本語
      </Link>
    </>
  );
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
