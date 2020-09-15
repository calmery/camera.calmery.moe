import { NextPage, NextPageContext } from "next";
import React from "react";
import * as cloudinary from "cloudinary-core";
import Head from "next/head";

const Share: NextPage<{ url: string }> = ({ url }) => {
  return (
    <>
      <Head>
        <meta key="og_image" property="og:image" content={url} />
        <meta key="og_image_width" property="og:image:width" content="1200" />
        <meta key="og_image_height" property="og:image:height" content="630" />
        <meta key="twitter_image" name="twitter:image" content={url} />
      </Head>
    </>
  );
};

Share.getInitialProps = async ({ query }: NextPageContext) => {
  const { id } = query;

  const c = new cloudinary.Cloudinary({ cloud_name: "calmery", secure: true });

  return {
    url: c.url(`camera/edited_images/${id}`, {
      transformation: [
        {
          background: "#fff",
          crop: "pad",
          height: 630,
          width: 1200,
        },
      ],
    }),
  };
};

export default Share;
