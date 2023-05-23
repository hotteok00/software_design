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

/* connecting with client */
server.on('connection', (socket) => {
    console.log('Client connected');

    // Handle messages from client
    socket.on('message', (message) => {
        message = JSON.parse(message);
        console.dir(message);

        const sql = message.sql;
        const values = message.values;

        // connection.connect();
        connection.query(sql, values, (error, results, fields) => {
            if (error)
                console.log(error);
            console.log(results);
            socket.send(JSON.stringify(results));
        });
        // connection.end();
    });

    // Handle WebSocket connection close event
    socket.on('close', () => {
        console.log('WebSocket connection closed by the client.');
    });

    // Handle any errors that occur during the WebSocket connection
    socket.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});