"use client";
import React, { useEffect, useState } from "react";
import { UserList } from "../models/interfaces";
interface Props {
  dataUser: UserList;
  showChatMessage(dataUser: any): void;
  selected: string | undefined;
}
const ListUsers = ({ dataUser, showChatMessage, selected }: Props) => {
  return (
    <div className={`flex items-center justify-between p-2 ${selected == dataUser.uid ? 'bg-gray-100' : 'hover:bg-gray-100'} cursor-pointer`} onClick={() => showChatMessage(dataUser) }>
      <div className="flex items-center mr-6">
        <div className="flex-none relative">
          <img
            src={`https://ui-avatars.com/api/?name=${dataUser.name}&background=random`}
            className="h-12 w-12 rounded-full object-cover"
            alt=""
          />
          { dataUser.status === 1 ? <>
            <div className={`absolute right-0 bottom-[0.5px] rounded-full w-3 h-3 bg-green-600`}></div>
          </> : "" }      
        </div>
        <div className="mx-3">
          <p className="mb-1 font-semibold">{dataUser.name}</p>
        </div>
      </div>
      <div>{dataUser.datetime}</div>
    </div>
  );
};

export default ListUsers;
