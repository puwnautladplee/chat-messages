import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon, ArrowLeftEndOnRectangleIcon } from "@heroicons/react/20/solid";
import { useRouter } from 'next/navigation'
import { socket } from "@/lib/socket";
export default function Dropdowns() {
  const router = useRouter()
  const signOut = () => {
    socket.disconnect();
    localStorage.removeItem("uid");
    localStorage.removeItem("nameProfile");
    router.push('/')
  }
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-full bg-[#f4f4f4] px-2 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200">
          <EllipsisHorizontalIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={()=> signOut()}
                  className={`flex px-4 py-2 text-sm ${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  }`}
                >
                  <ArrowLeftEndOnRectangleIcon 
                   className="h-5 w-5 text-gray-400 mr-2"
                  /> Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
