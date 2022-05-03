import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@config/firebaseConfig";
import { useRouter } from "next/router";

interface UserListProps {}

function UserList({}: UserListProps) {
  const router = useRouter();
  const [user, setUser] = useState([]);
  useEffect(() => {
    const fetchUserData = (async () => {
      const userRef = collection(db, "users");
      const querySnapshot = await getDocs(userRef);
      setUser(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    })();
  }, [db]);
  const createChat = async (id, name) => {
    if (auth?.currentUser?.uid === undefined) return;
    if (auth?.currentUser?.uid === id) return;
    const chatRef = collection(db, "Pchats");
    const q = query(
      chatRef,
      where("users", "array-contains", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    const chatAlreadyExist = (mate_id: string) =>
      !!querySnapshot?.docs.find(
        (chat) =>
          chat.data().users.find((user: string) => user === mate_id)?.length > 0
      );
    if (!chatAlreadyExist(id)) {
      addDoc(chatRef, {
        users: [auth.currentUser.uid, id],
        name: [auth.currentUser.displayName, name],
      });
    } else {
      alert("방이 이미 존재합니다");
    }
  };

  return (
    <>
      {user.map((user, index) => {
        return (
          <div
            key={index}
            className="p-1 cursor-pointer hover:text-blue-700"
            onClick={() => {
              createChat(user.id, user.displayName);
            }}
          >{`${user.displayName}(${user.email})`}</div>
        );
      })}
    </>
  );
}

export default UserList;
