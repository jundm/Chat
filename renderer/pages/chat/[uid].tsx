import { db } from "@config/firebaseConfig";
import authAtom from "@stores/authAtom";
import { Breadcrumb, Layout, Input } from "antd";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useAtom } from "jotai";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

interface UIDProps {}
interface ChatProps {
  createdAt: {
    nanoseconds: number;
    seconds: number;
  };
  id: string;
  message: string;
  user: string;
}

function UID({}: UIDProps) {
  const { Header, Content } = Layout;
  const [userAtom, setUserAtom] = useAtom(authAtom);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const PchatId = router.query.uid;
  const scrollRef = useRef<HTMLUListElement>();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (userInput === "") return;
    const messageRef = collection(db, "Pchats", `${PchatId}`, "message");
    await addDoc(messageRef, {
      createdAt: serverTimestamp(),
      message: userInput,
      user: userAtom.nickName,
    });
    setUserInput("");
  };

  const scrollToBottom = () => {
    const scrollBottom =
      scrollRef.current?.scrollHeight - scrollRef.current?.clientHeight;
    const currentScroll = scrollRef.current?.scrollTop;
    const isBottom = scrollBottom - currentScroll;
    if (isBottom === 63) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    const messageRef = collection(db, "Pchats", `${PchatId}`, "message");
    const q = query(messageRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
          createdAt: doc.data().createdAt?.toDate(),
        }))
      );
      scrollToBottom();
    });
    return () => {
      unsubscribe();
    };
  }, [router.query]);

  return (
    <>
      <Head>
        <title>Home - User</title>
      </Head>
      <Layout className="site-layout" style={{}}>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>User</Breadcrumb.Item>
          </Breadcrumb>
          <ul
            className="overflow-auto"
            style={{ height: `calc(100vh - 100px)` }}
            ref={scrollRef}
          >
            {messages?.map((message: ChatProps, index) => {
              return (
                <li key={index}>
                  <div>{message.user}</div>
                  <div>{message.message}</div>
                  <div>
                    {dayjs(message.createdAt?.nanoseconds).format(
                      "YYYY/MM/DD/HH:mm"
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Content>

        <form action="" onSubmit={sendMessage}>
          <div className="flex ">
            <input
              className="w-full h-7 rounded-2xl p-2 m-1"
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <input
              className="h-7 m-1 btn-blue leading-none"
              type="submit"
              value="입력"
            />
          </div>
        </form>
      </Layout>
    </>
  );
}

export default UID;
