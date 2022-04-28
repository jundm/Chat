import React, { useState, useEffect, useRef } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { auth, db } from "@config/firebaseConfig";

interface UserListProps {}

function UserList({}: UserListProps) {
  const id = useRef(null);
  
  return (
    <div>
      <h1>userlist</h1>
    </div>
  );
}

export default UserList;
