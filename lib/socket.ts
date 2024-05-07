import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL: any = 'https://server-chat-message.vercel.app/';
console.log(URL);
export const socket = io(URL, { 
 autoConnect: false,
 reconnection: true 
});