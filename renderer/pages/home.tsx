import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Breadcrumb, Layout } from "antd";
import authAtom from "@stores/authAtom";
import { useAtom } from "jotai";
import UserList from "@components/UserList";
import GroupList from "@components/GroupList";

function Home() {
  const [userAtom, setUserAtom] = useAtom(authAtom);
  const { Header, Content, Footer, Sider } = Layout;
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <Layout className="site-layout">
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </Breadcrumb>
          <div className="grid grid-col-1 text-2xl w-full text-center">
            <img className="ml-auto mr-auto" src="/images/logo.png" />
            <span>⚡ Tera ChatApp ⚡</span>
          </div>
          <div className="flex mx-auto w-96">
            <UserList />
            <GroupList />
          </div>
        </Content>
      </Layout>
    </>
  );
}

export default Home;
