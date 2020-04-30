import io from 'socket.io-client';

let socket = io('https://spher.herokuapp.com/');

export default socket;
