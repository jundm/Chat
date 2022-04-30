import React, { useEffect, useState } from "react";
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
import { auth, db } from "@config/firebaseConfig";
import { useRouter } from "next/router";
import { collection, onSnapshot, query, where } from "firebase/firestore";

interface SidebarProps {
  children: React.ReactNode;
}

function Sidebar({ children }: SidebarProps) {
  const router = useRouter();
  const [userAtom, setUserAtom] = useAtom(authAtom);
  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState("");
  const [fetchUser, setFetchUser] = useState([]);
  const [getPersonalUser, SetGetPersonalUser] = useState([]);
  const [getGroupUser, SetGetGroupUser] = useState([
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]);

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };
  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

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
      label,
      key,
      icon,
      children,
      type,
    } as MenuItem;
  }

  const initialItem: MenuItem[] = [
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
    ...initialItem,
    getItem("User", "sub1", <UserOutlined />, getPersonalUser),
    getItem("Team", "sub2", <TeamOutlined />, getGroupUser),
  ];

  useEffect(() => {
    if (auth?.currentUser?.uid === undefined) {
      return SetGetPersonalUser([]), SetGetGroupUser([]);
    }
    const chatRef = collection(db, "Pchats");
    const q = query(
      chatRef,
      where("users", "array-contains", auth?.currentUser?.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setFetchUser(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });

    let userItems = [];
    fetchUser.forEach((user, index) => {
      if (user.name[0] === userAtom.nickName) {
        userItems.push(
          getItem(
            <Link href={`/chat/${user.users[0]}`}>
              <a>{user.name[1]}</a>
            </Link>,
            `user-${index}`
          )
        );
      }
      if (user.name[1] === userAtom.nickName) {
        userItems.push(
          getItem(
            <Link href={`/chat/${user.users[0]}`}>
              <a>{user.name[0]}</a>
            </Link>,
            `user-${index}`
          )
        );
      }
    });
    SetGetPersonalUser(userItems);
    return () => {
      unsubscribe;
    };
  }, [collapsed, router.query]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Menu
          onClick={onClick}
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
