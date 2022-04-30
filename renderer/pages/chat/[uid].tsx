import InputMessage from "@elements/InputMessage";
import { Breadcrumb, Layout } from "antd";
import Head from "next/head";
import React from "react";

interface UIDProps {}

function UID({}: UIDProps) {
  const { Content, Footer } = Layout;

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Layout
        className="site-layout"
        style={{ minHeight: "100vh", marginBottom: "-100px" }}
      >
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>User</Breadcrumb.Item>
          </Breadcrumb>
          <div className="">내용</div>
        </Content>
        <Footer>
          <InputMessage />
        </Footer>
      </Layout>
    </>
  );
}

export default UID;
