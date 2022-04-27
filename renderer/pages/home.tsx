import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Breadcrumb } from "antd";
import Laycon from "@elements/laycon";

function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>Home</title>
      </Head>
      <Laycon>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
        <div className="grid grid-col-1 text-2xl w-full text-center">
          <img className="ml-auto mr-auto" src="/images/logo.png" />
          <span>⚡ Tera ChatApp ⚡</span>
        </div>
        {/* <div className="mt-1 w-full flex-wrap flex justify-center">
          <Link href="/next">
            <a className="btn-blue">Go to next page</a>
          </Link>
        </div> */}
      </Laycon>
    </React.Fragment>
  );
}

export default Home;
