import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@config/firebaseConfig";

interface GroupListProps {}

function GroupList({}: GroupListProps) {
  const [gruop, setGruop] = useState([]);
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

      {gruop.map((group, index) => {
        return (
          <div
            key={index}
            className="p-1 cursor-pointer hover:text-blue-700"
            onClick={() => {}}
          >{`${group.title}`}</div>
        );
      })}
    </>
  );
}

export default GroupList;
