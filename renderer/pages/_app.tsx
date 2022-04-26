import React from "react";
import type { AppProps } from "next/app";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "@styles/globals.css";
import Sidebar from "@components/Sidebar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Component {...pageProps} />
      <Sidebar />
    </React.Fragment>
  );
}

export default MyApp;
