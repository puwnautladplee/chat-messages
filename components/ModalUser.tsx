import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  PlusIcon,
  UsersIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/outline";
import { UserList } from "../models/interfaces";
import { socket } from '@/lib/socket';
import uniqid from "uniqid";
export default function ModalUser({ myUid, userLists, showChatMessage } : any) {
  const [open, setOpen] = useState(false);
  const [userOnlineLists, setUserOnlineLists] = useState([]);
  const cancelButtonRef = useRef(null);
  const addChatMessage = (userData: any) => {
    let checkDuplicate = userLists.find((user: any) => user.uid === userData.uid) ;
    if(checkDuplicate){
      showChatMessage(checkDuplicate);
    }else{
      let groupId = uniqid(`${myUid}_group_`);
      socket.emit("create-group-chat", groupId, userData, userLists);
    }
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      socket.emit("get-users", (dataUsers: any) => {
        setUserOnlineLists(dataUsers);
      });
    }
  }, [open]);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="inline-flex w-full justify-center gap-x-1.5 rounded-full bg-[#f4f4f4] px-2 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200"
      >
        <PlusIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-1/2 xl:w-1/4">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="flex items-center">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-500 sm:mx-0 sm:h-10 sm:w-10">
                        <UsersIcon className="h-6 w-6" aria-hidden="true" />
                      </div>

                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Users Online
                        </Dialog.Title>
                      </div>
                    </div>
                    <div className="mt-4 h-px w-full border-b border-[#5b6d884b]"></div>
                    <div className="text-black">
                      {userOnlineLists.map((dataUser: UserList, index: any) => {
                        if(dataUser.uid == myUid) return false ;
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2"
                          >
                            <div className="flex items-center mr-6">
                              <div className="flex-none">
                                <img
                                  src={`https://ui-avatars.com/api/?name=${dataUser.name}&background=random`}
                                  className="h-12 w-12 rounded-full object-cover"
                                  alt=""
                                />
                              </div>
                              <div className="mx-3">
                                <p className="mb-1 font-semibold">
                                  {dataUser.name}
                                </p>
                              </div>
                            </div>
                            <div>
                              <div
                                onClick={() => addChatMessage(dataUser)}
                                className=" cursor-pointer inline-flex w-full justify-center gap-x-1.5 rounded-full bg-[#f4f4f4] px-2 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200"
                              >
                                <ChatBubbleBottomCenterIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
