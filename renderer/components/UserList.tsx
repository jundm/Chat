import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@config/firebaseConfig";

interface UserListProps {}

//TODO 이메일 폰트 바꾸기
function UserList({}: UserListProps) {
  const [user, setUser] = useState([]);
  useEffect(() => {
    const fetchUserData = (async () => {
      const userRef = collection(db, "users");
      const querySnapshot = await getDocs(userRef);
      setUser(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    })();
  }, [db]);

  const createChat = async (id) => {
    if (auth?.currentUser?.uid === undefined) return;
    if (auth?.currentUser?.uid === id) return;
    const chatRef = collection(db, "Pchats");
    const q = query(
      chatRef,
      where("users", "array-contains", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    const chatAlreadyExist = (mate_id: number) =>
      !!querySnapshot?.docs.find(
        (chat) =>
          chat.data().users.find((user: number) => user === mate_id)?.length > 0
      );

    if (!chatAlreadyExist(id)) {
      addDoc(chatRef, { users: [auth.currentUser.uid, id] });
    } else {
      alert("채팅방이 존재합니다");
    }
  };

  return (
    <div className="flex flex-col justify-center mx-auto w-80 border-4 rounded-2xl">
      {user.map((user, index) => {
        return (
          <div
            key={index}
            className="p-1 ml-2 cursor-pointer"
            onClick={() => {
              createChat(user.id);
            }}
          >{`${user.displayName}(${user.email})`}</div>
        );
      })}
    </div>
  );
}

export default UserList;
