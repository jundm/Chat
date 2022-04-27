import { atom } from "jotai";

const authAtom = atom({
  email: null,
  nickName: null,
  uid: null,
});

export default authAtom;
