"use client";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Dropdowns from "@/components/Dropdowns";
import ModalUser from "@/components/ModalUser";
import ListUsers from "@/components/ListUsers";
import { Bars4Icon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { UserList } from "../models/interfaces";
import { socket } from "@/lib/socket";

const ChatMessage = () => {
  var moment = require("moment");
  const [isShowChatMenu, setIsShowChatMenu] = useState(false);
  const [myName, setMyName] = useState("");
  const [myUid, setMyUid] = useState("");
  const [chatUser, setChatUser] = useState<UserList>();
  const [chatMessages, setChatMessages] = useState([]);
  const [userLists, setUserLists] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const newMessage = (message: any) => {
    setChatMessages((current: any) => {
      current = [...current, message];
      return current;
    });
  };

  const updateUserLists = (uid: string, status: number) => {
    setUserLists((current: any) => {
      let userIndex = current.findIndex((user: any) => user.uid === uid);
      if (userIndex !== -1) {
        current[userIndex].status = status;
        current = [...current];
      }
      return current;
    });
  };
  useEffect(() => {
    let name: string = localStorage.getItem("nameProfile") ?? "";
    let uid: string = localStorage.getItem("uid") ?? "";
    if (!uid) {
      redirect("/");
    }
    setMyName(name);
    setMyUid(uid);
    socket.connect();
    socket.on("connect", () => {
      socket.emit("join-chat", { uid, name });
      socket.emit("get-group-list", { uid: uid }, (dataChat: any) => {
        console.log(dataChat);
        let dataUserList: any = [...userLists];
        if (dataChat.length > 0) {
          dataChat.map((data: any) => {
            let user = data.users_list[0];
            dataUserList.push({
              uid: user.uid,
              name: user.name,
              datetime: "",
              status: user.status ?? 0,
              group_id: data.group_id,
            });
          });
          setUserLists(dataUserList);
          showChatMessage(dataUserList[0]);
        } else {
          setIsShowChatMenu(true);
        }
      });

      socket.on("join-group-chat", (userdata: any, groupData: any) => {
        let chatUsers: any = [...userLists, userdata];
        setUserLists(chatUsers);
        showChatMessage(userdata);
      });

      socket.on("receive-chat-message", (chatMessage: any) => {
        newMessage(chatMessage);
      });

      socket.on("update-status-user", (uid: string, status: number) => {
        updateUserLists(uid, status);
      });
    });
  }, []);

  const showChatMessage = (userdata: any) => {
    setChatUser(userdata);
    socket.emit("get-chat-group-message", userdata, (messages: any) => {
      setChatMessages(messages);
    });
  };

  const sendMessage = () => {
    if (textMessage.trim()) {
      socket.emit("chat-group-message", myUid, chatUser, textMessage);
      setTextMessage("");
    }
  };
  const sendMessageHandle = (event: any) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    if (!isShowChatMenu) {
      setTimeout(() => {
        const element: any = document.querySelector(".chat-messages-box");
        element.behavior = "smooth";
        element.scrollTop = element.scrollHeight;
      });
    }
  };

  useEffect(() => {
    if (chatMessages.length) {
      scrollToBottom();
    }
  }, [chatMessages]);
  return (
    <div className="relative flex w-full gap-5">
      <div
        className={`w-2/4 xl:w-1/4 gap-5 bg-white text-black rounded-md shadow-md absolute z-10 hidden h-full xl:relative xl:block ${
          isShowChatMenu ? "!block" : ""
        }`}
      >
        <div
          className={`w-full min-h-screen space-y-4 overflow-hidden p-4 xl:relative xl:block`}
        >
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center mr-6">
              <div className="flex-none">
                <img
                  src={`https://ui-avatars.com/api/?name=${myName}&background=random`}
                  className="h-12 w-12 rounded-full object-cover"
                  alt=""
                />
              </div>
              <div className="mx-3">
                <p className="mb-1 font-semibold">{myName}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <ModalUser
                myUid={myUid}
                userLists={userLists}
                showChatMessage={showChatMessage}
              />
              <Dropdowns />
            </div>
          </div>
          <div className="h-px w-full border-b border-[#5b6d884b]"></div>
          <div>
            {userLists.map((user: UserList, index: any) => {
              return (
                <ListUsers
                  key={index}
                  selected={chatUser?.uid}
                  dataUser={user}
                  showChatMessage={showChatMessage}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div
        className={`absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${
          isShowChatMenu ? "!block xl:!hidden" : ""
        }`}
        onClick={() => {
          if (userLists.length) setIsShowChatMenu(!isShowChatMenu);
        }}
      ></div>
      <div className="bg-white w-full xl:w-3/4 rounded-md shadow-md text-black relative">
        {chatUser?.uid ? (
          <>
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center mr-6">
                <button
                  type="button"
                  className="hover:text-primary mr-2 xl:hidden"
                  onClick={() => setIsShowChatMenu(!isShowChatMenu)}
                >
                  <Bars4Icon className="h-7 w-7" />
                </button>
                <div className="flex-none relative">
                  <img
                    src={`https://ui-avatars.com/api/?name=${chatUser.name}&background=random`}
                    className="h-12 w-12 rounded-full object-cover"
                    alt=""
                  />
                  {chatUser.status === 1 ? (
                    <>
                      <div
                        className={`absolute right-0 bottom-[0.5px] rounded-full w-3 h-3 bg-green-600 block xl:hidden`}
                      ></div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div className="mx-3">
                  <p className="mb-1 font-semibold">{chatUser.name}</p>
                </div>
              </div>
            </div>
            <div className="h-px w-full border-b border-[#5b6d884b]"></div>
            <div className="p-6 h-[calc(100vh_-_150px)]">
              {chatMessages && chatMessages.length ? (
                <div className="chat-messages-box h-[calc(100vh_-_250px)] xl:h-[calc(100vh_-_200px)] overflow-auto">
                  {chatMessages.map((message: any, index: any) => {
                    return (
                      <div key={index}>
                        <div
                          className={`flex items-start gap-3 mb-2 ${
                            myUid === message.uid ? "justify-end" : ""
                          }`}
                        >
                          <div
                            className={`flex-none ${
                              myUid === message.uid ? "order-2" : ""
                            }`}
                          >
                            {myUid === message.uid ? (
                              <img
                                src={`https://ui-avatars.com/api/?name=${myName}&background=random`}
                                className="h-10 w-10 rounded-full object-cover"
                                alt=""
                              />
                            ) : (
                              ""
                            )}
                            {myUid !== message.uid ? (
                              <img
                                src={`https://ui-avatars.com/api/?name=${chatUser.name}&background=random`}
                                className="h-10 w-10 rounded-full object-cover"
                                alt=""
                              />
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div
                                className={`rounded-md bg-gray-200 p-4 py-2 ${
                                  message.uid === myUid
                                    ? "!bg-primaryrounded-md"
                                    : "rounded-md"
                                }`}
                              >
                                {message.msg}
                              </div>
                              <div
                                className={`${
                                  myUid === message.uid ? "hidden" : ""
                                }`}
                              ></div>
                            </div>
                            <div
                              className={`text-xs text-white-dark ${
                                myUid === message.uid
                                  ? "text-right"
                                  : "text-left"
                              }`}
                            >
                              {message.datetime
                                ? moment(parseInt(message.datetime)).format(
                                    "HH:mm"
                                  )
                                : "5h ago"}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className=" h-screen"></div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 w-full p-4">
              <div className="w-full items-center space-x-3 rtl:space-x-reverse sm:flex">
                <div className="relative flex-1">
                  <input
                    className="form-input w-full rounded-full border-0 bg-[#f4f4f4] px-12 py-2 focus:outline-none"
                    placeholder="Type a message"
                    value={textMessage}
                    onChange={(e: any) => setTextMessage(e.target.value)}
                    onKeyUp={sendMessageHandle}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 -translate-y-1/2 hover:text-primary right-4"
                    onClick={() => sendMessage()}
                  >
                    <PaperAirplaneIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className=" h-screen"></div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
