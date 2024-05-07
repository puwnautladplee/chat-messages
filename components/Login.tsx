"use client";
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from 'next/navigation'
import uniqid from "uniqid";
const Login = () => {
  const [isError, setIsError] = useState(false);
  const [nameProfile, setNameProfile] = useState("");
  const router = useRouter()

  const onsubmit = () => {
    if (!nameProfile) {
      setIsError(true);
      return false;
    }
    setIsError(false);
    localStorage.setItem("uid", uniqid());
    localStorage.setItem("nameProfile", nameProfile);
    router.push('/chat')
  };
  
  useEffect(() => {
   let uid = localStorage.getItem("uid");
   if(uid){
    redirect("/chat")
   }
  }, []);
  return (
    <div className="w-full max-w-xs">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="text-gray-700 flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-14 h-14"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
        </div>
        <div className="text-gray-700 text-center my-4 text-xl font-bold">
          <h1 className="mb-4">MaChatSi</h1>
          <hr></hr>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            onChange={(e) => setNameProfile(e.target.value)}
          />
          {isError ? (
            <p className="text-red-500 text-xs italic">Please enter name.</p>
          ) : (
            ""
          )}
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={onsubmit}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
