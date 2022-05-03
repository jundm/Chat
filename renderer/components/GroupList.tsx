import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@config/firebaseConfig";
import { useAtom } from "jotai";
import authAtom from "@stores/authAtom";
import { useRouter } from "next/router";

interface GroupListProps {}

function GroupList({}: GroupListProps) {
  const router = useRouter();
  const [userAtom, setUserAtom] = useAtom(authAtom);
  const [group, setGruop] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [title, setTitle] = useState("");
  useEffect(() => {
    const fetchUserData = (async () => {
      const groupRef = collection(db, "Gchats");
      const querySnapshot = await getDocs(groupRef);
      setGruop(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    })();
  }, [openCreate]);

  const createGroup = async (e) => {
    e.preventDefault();
    if (!title) return;
    if (auth?.currentUser?.uid === undefined) return;
    const chatRef = collection(db, "Gchats");
    addDoc(chatRef, {
      title,
      users: [auth.currentUser.uid],
      name: [auth.currentUser.displayName],
    });
    setOpenCreate(false);
  };

  const enterGroup = (group) => {
    if (auth?.currentUser?.uid === undefined) return;
    const alreadyExist = !!!group.users.find((doc) => doc === userAtom.uid);
    if (alreadyExist) {
      const enterRef = doc(db, "Gchats", `${group.id}`);
      updateDoc(enterRef, {
        name: [...group.name, userAtom.nickName],
        users: [...group.users, userAtom.uid],
      });
    } else {
      router.push(`/groupChat/${group.id}`);
    }
  };
  return (
    <>
      <input
        type="button"
        className="btn-blue w-5/6 m-1 rounded-2xl cursor-pointer"
        value="Create Group"
        onClick={() => setOpenCreate(!openCreate)}
      />
      {openCreate && (
        <form action="" onSubmit={createGroup}>
          <input
            type="text"
            placeholder="제목을 입력 하세요"
            className="w-5/6 m-1 p-2 rounded-2xl bg-red-200"
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <input
            type="submit"
            value="Create"
            className="btn-blue w-5/6 m-1 rounded-2xl cursor-pointer"
          />
        </form>
      )}

      {group.map((group, index) => {
        return (
          <div
            key={index}
            className="p-1 cursor-pointer hover:text-blue-700"
            onClick={() => {
              enterGroup(group);
            }}
          >{`${group.title}`}</div>
        );
      })}
    </>
  );
}

export default GroupList;
