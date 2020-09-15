import { NextPage, NextPageContext } from "next";
import React from "react";
import Head from "next/head";

const Header: React.FC<{ ogImageUrl: string }> = ({ ogImageUrl }) => (
  <Head>
    <meta property="og:image" content={ogImageUrl} key="og_image" />
    <meta property="og:image:height" content="630" key="og_image_height" />
    <meta property="og:image:width" content="1200" key="og_image_width" />
    <meta
      name="twitter:card"
      content="summary_large_image"
      key="twitter_card"
    />
    <meta name="twitter:image" content={ogImageUrl} key="twitter_image" />
  </Head>
);

const Share: NextPage<{
  image_url: string;
  og_image_url: string;
}> = ({ image_url, og_image_url }) => {
  return (
    <>
      <Header ogImageUrl={og_image_url} />
    </>
  );
};

Share.getInitialProps = async ({ query }: NextPageContext) => {
  const { data } = await fetch(
    `${
      process.env.NODE_ENV === "production"
        ? "https://api.calmery.moe"
        : "http://localhost:5000"
    }/camera/images/${query.id}`
  ).then<{
    data: {
      id: string;
      image_url: string;
      og_image_url: string;
    };
  }>((r) => r.json());

  return data;
};

export default Share;
