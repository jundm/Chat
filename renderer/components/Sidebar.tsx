import React, { useState } from "react";
import { Layout, Menu, MenuProps } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import authAtom from "@stores/authAtom";
import { useAtom } from "jotai";
import { signOut } from "firebase/auth";
import { auth } from "@config/firebaseConfig";
import { useRouter } from "next/router";

interface SidebarProps {
  children: React.ReactNode;
}

function Sidebar({ children }: SidebarProps) {
  const router = useRouter();
  const [userAtom, setUserAtom] = useAtom(authAtom);
  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState("");

  const onCollapse = (collapsed: boolean) => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };
  // const onClick: MenuProps["onClick"] = (e) => {
  //   console.log("click ", e);
  //   setCurrent(e.key);
  // };

  const useSignOutButton = () =>
    signOut(auth)
      .then(() => {
        router.push("/login");
        setUserAtom(() => ({
          email: null,
          nickName: null,
          uid: null,
        }));
      })
      .catch((error) => {
        const errorCode = error.code;
        console.error(errorCode);
      });

  const { Header, Content, Footer, Sider } = Layout;
  type MenuItem = Required<MenuProps>["items"][number];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }

  const standardItem: MenuItem[] = [
    getItem(
      userAtom.nickName ? (
        <div onClick={useSignOutButton}>{userAtom.nickName}</div>
      ) : (
        <Link href="/login">
          <a>Login</a>
        </Link>
      ),
      "1",
      <PieChartOutlined />
    ),
    getItem(
      <Link href="/home">
        <a>Home</a>
      </Link>,
      "2",
      <DesktopOutlined />
    ),
  ];

  const items: MenuItem[] = [
    ...standardItem,
    getItem("User", "sub1", <UserOutlined />, [
      getItem("Tom", "3"),
      getItem("Bill", "4"),
      getItem("Alex", "5"),
    ]),
    getItem("Team", "sub2", <TeamOutlined />, [
      getItem("Team 1", "6"),
      getItem("Team 2", "8"),
    ]),
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="text-cyan-500">logo</div>
        <Menu
          // onClick={onClick}
          selectedKeys={[current]}
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>

      <Layout className="site-layout">
        <Content style={{ margin: "0 16px" }}>{children}</Content>
        <Footer style={{ textAlign: "center" }}>
          Tera ChatApp ©2022 Created by LazyJun
        </Footer>
      </Layout>
    </Layout>
  );
}

export default Sidebar;
