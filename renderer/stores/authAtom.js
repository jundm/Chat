import { atom } from "jotai";

const authAtom = atom({
  email: null,
  displayName: null,
  uid: null,
});

export default authAtom;
