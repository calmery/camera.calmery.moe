import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import { Button } from "~/components/button";
import { increment } from "~/modules/counter/actions";
import { withRedux, NextPageContextWithRedux } from "~/modules";
import { Image } from "~/components/image";

const Home: NextPage = () => (
  <div className="container">
    <Head>
      <title>Create Next App</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Button />
    <br />
    <Button primary />

    <Image src="/images/logo.svg" />
  </div>
);

Home.getInitialProps = async ({ store }: NextPageContextWithRedux) => {
  store.dispatch(increment(100));
};

export default withRedux(Home);
