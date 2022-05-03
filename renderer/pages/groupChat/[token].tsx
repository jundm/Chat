import authAtom from "@stores/authAtom";
import { Breadcrumb, Layout } from "antd";
import { useAtom } from "jotai";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@config/firebaseConfig";

interface TokenProps {}
interface ChatProps {
  [key: string]: {
    nanoseconds: number;
    createdAt: { seconds: number; nanoseconds: number };
    id: string;
    message: string;
    user: string;
  };
}

function Token({}: TokenProps) {
  const { Content } = Layout;
  const [userAtom, setUserAtom] = useAtom(authAtom);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([{}]);
  const [group, setGroup] = useState([]);
  const router = useRouter();
  const GchatId = router.query.token;
  const scrollRef = useRef<HTMLInputElement | null>(null);
  const sendMessage = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (userInput === "") return;
    const messageRef = collection(db, "Gchats", `${GchatId}`, "message");
    await addDoc(messageRef, {
      createdAt: serverTimestamp(),
      message: userInput,
      user: userAtom.nickName,
    });
    setUserInput("");
  };
  const scrollToBottom = () => {
    if (scrollRef && scrollRef.current) {
      const scrollBottom =
        scrollRef.current?.scrollHeight - scrollRef.current?.clientHeight;
      const currentScroll = scrollRef.current?.scrollTop;
      const isBottom = scrollBottom - currentScroll;
      if (isBottom === 63) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  };
  const leaveMessage = async () => {
    if (confirm("나가시겠습니까?")) {
      await deleteDoc(doc(db, "Gchats", `${GchatId}`));
      router.push("/home");
    }
  };
  useEffect(() => {
    const messageRef = collection(db, "Gchats", `${GchatId}`, "message");
    const q = query(messageRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          // createdAt: doc.data().createdAt?.toDate(),
        }));

        setMessages(data);
        scrollToBottom();
      }
    );
    return () => {
      unsubscribe();
    };
  }, [router.query]);
  // useEffect(() => {
  //   const fetchUserData = (async () => {
  //     const groupRef = collection(db, "Gchats", `${GchatId}`);
  //     const querySnapshot = await getDocs(groupRef);
  //     console.log(querySnapshot, "querySnapshot");
  //     setGruop(
  //       querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  //     );
  //   })();
  // }, []);
  // console.log(group, "group");
  const userList = async () => {
    const userRef = doc(db, "Gchats", `${GchatId}`);
    const querySnapshot = await getDoc(userRef);
    // console.log(querySnapshot.data(), "querySnapshot");
    // setGroup(querySnapshot.doc.map((doc) => doc.data()));
    // console.log(querySnapshot, "querySnapshot");
  };
  userList();
  console.log(messages, "messages");
  return (
    <>
      <Head>
        <title>Home - Group</title>
      </Head>
      <Layout className="site-layout" style={{}}>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Group</Breadcrumb.Item>
          </Breadcrumb>
          <ul
            className="overflow-auto"
            style={{ height: `calc(100vh - 100px)` }}
            ref={() => scrollRef}
          >
            {messages?.map((message: ChatProps, index: number) => {
              const time = message.createdAt.nanoseconds;
              console.log(typeof time, "message.createdAt");
              console.log(time, "time");
              return (
                <li key={index}>
                  {userAtom.nickName !== message.user ? (
                    <>
                      <div className="flex items-center">
                        <div className="font-bold">{message.user}</div>
                        <small className="ml-1 ">
                          {dayjs(time).format("MM월DD일 HH:mm")}
                        </small>
                      </div>
                      <div className="">{message.message}</div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-end">
                        <small className="mr-1 ">
                          {dayjs(time).format("MM월DD일 HH:mm")}
                        </small>
                        <div className="font-bold">{message.user}</div>
                      </div>
                      <div className="text-right">{message.message}</div>
                    </>
                  )}
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
            <input type="button" value="나가기" onClick={leaveMessage} />
          </div>
        </form>
      </Layout>
    </>
  );
}

export default Token;
