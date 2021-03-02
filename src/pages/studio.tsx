import { GetServerSideProps, NextPage } from "next";
import React from "react";

const Studio: NextPage = () => {
  return <div>Calmery-Chan Camera Studio</div>;
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
