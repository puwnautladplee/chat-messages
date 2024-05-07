import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL: any = 'http://localhost:5555';

export const socket = io(URL, { 
 autoConnect: false,
 reconnection: true 
});