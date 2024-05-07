import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL: any = process.env.URL_SOCKET ? process.env.URL_SOCKET : 'http://localhost:5555';
console.log(URL);
export const socket = io(URL, { 
 autoConnect: false,
 reconnection: true 
});