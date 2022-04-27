import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import React from "react";

interface LayconProps {
  children: React.ReactNode;
}

function Laycon({ children }: LayconProps) {
  return (
    <Layout className="site-layout">
      <Content style={{ margin: "0 16px" }}>{children}</Content>
    </Layout>
  );
}

export default Laycon;
