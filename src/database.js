// connect my_db
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '0000',
    database: 'my_db'
});// in my_db, TABLE : user, account

// websocket send to client DB_data
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8090 });

// database connection start
connection.connect();


/* user ########################################*/

connection.query('select * from user', function (error, results, fields) {
    if (error) throw error;
    console.log('user');
    console.log(results);
});


/* account ###################################*/

connection.query('select * from account', function (error, results, fields) {
    if (error) throw error;
    console.log('account');
    console.log(results);

    if (results.length > 0) {
        server.on('connection', (socket) => {
            console.log('Client connected');

            // Send shared variable to client
            socket.send(JSON.stringify(results));

            // Handle messages from client
            socket.on('message', (message) => {
                sharedVariable = JSON.parse(message).value;
                console.log(`Shared variable updated: ${sharedVariable}`);
            });
        });
    }
});

// database connection close
connection.end();