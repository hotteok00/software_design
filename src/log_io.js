// Elements
const LogIn = document.getElementById('log in');
const registration = document.getElementById('registration');

const socket = new WebSocket('ws://localhost:8090', 'tcp');


socket.onopen = () => {
    console.log('socket.onopen');
};
socket.onmessage = (event) => {
    console.log('socket.onmessage');

    let jsonData = JSON.parse(event.data);
    console.log(event);
    console.log(jsonData);
};
socket.onclose = () => {
    console.log('socket.onclose');
};
socket.onerror = (event) => {
    console.log('socket.error');
    console.log(event);
};


/*check ###########################################*/
const checkElement = function () {
    console.dir(LogIn);
    console.dir(registration);
};
checkElement();