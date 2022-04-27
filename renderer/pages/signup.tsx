import Head from "next/head";
import React, { useState } from "react";
import Laycon from "renderer/elements/laycon";
import { Breadcrumb } from "antd";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@config/firebaseConfig";
import { useAtom } from "jotai";
import authAtom from "@stores/authAtom";
import { useRouter } from "next/router";

interface SignUpProps {}

function SignUp({}: SignUpProps) {
  const router = useRouter();
  const [, setUserAtom] = useAtom(authAtom);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    displayName: "",
  });
  const { email, password, displayName } = inputs;
  const onChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    if (name === "displayName") {
      setInputs({
        ...inputs,
        [name]: value.slice(0, 20),
      });
    } else {
      setInputs({
        ...inputs,
        [name]: value,
      });
    }
  };

  const Register = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const email = user.email;
        const displayName = user.displayName;
        const uid = user.uid;
        setUserAtom(() => ({
          email,
          displayName,
          uid,
        }));
        updateProfile(user, {
          displayName: displayName,
        }).then(() => {
          router.push("/home");
        });
      })
      .catch((error) => {
        const errorCode = error.code;
      });

    setInputs({
      email: "",
      password: "",
      displayName: "",
    });
  };

  return (
    <div>
      <Head>
        <title>SignUp</title>
      </Head>
      <Laycon>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>SignUp</Breadcrumb.Item>
        </Breadcrumb>
        <div className="grid grid-col-1 text-2xl w-full text-center">
          <img className="ml-auto mr-auto" src="/images/logo.png" />
          <span>⚡ SignUp ⚡</span>
        </div>
        <form action="" onSubmit={Register}>
          <div className="flex flex-col justify-center mx-auto w-80 border-4 rounded-2xl">
            <input
              type="email"
              name="email"
              placeholder="이메일 주소"
              required
              className="rounded-2xl p-2 m-1"
              value={email}
              onChange={onChange}
            />
            <input
              type="displayName"
              name="displayName"
              placeholder="닉네임"
              required
              className="rounded-2xl p-2 m-1"
              value={displayName}
              onChange={onChange}
            />
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
              required
              className="rounded-2xl p-2 m-1"
              value={password}
              onChange={onChange}
            />
            <input
              type="submit"
              className="btn-blue m-1 rounded-2xl"
              value="SignUp"
            />
          </div>
        </form>
      </Laycon>
    </div>
  );
}

export default SignUp;
