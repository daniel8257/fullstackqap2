const http = require('http');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

// Define the port number
const port = 3000;

// Extend EventEmitter class
class MyEmitter extends EventEmitter {};
const myEmitter = new MyEmitter();

// Helper function to read and serve HTML files
const serveFile = (res, filePath) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            myEmitter.emit('error', filePath);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Server Error');
        } else {
            myEmitter.emit('fileReadSuccess', filePath);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
};

// Set up event listeners
myEmitter.on('fileReadSuccess', (filePath) => {
    console.log(`File successfully read: ${filePath}`);
});

myEmitter.on('error', (filePath) => {
    console.log(`Error reading file: ${filePath}`);
});

myEmitter.on('routeAccess', (route) => {
    console.log(`Route accessed: ${route}`);
});

myEmitter.on('nonHomeAccess', (route) => {
    if (route !== '/') {
        console.log(`Non-home route accessed: ${route}`);
    }
});

// Create the server
const server = http.createServer((req, res) => {
    console.log(`Request for URL: ${req.url}`);

    myEmitter.emit('routeAccess', req.url);
    myEmitter.emit('nonHomeAccess', req.url);

    let filePath = path.join(__dirname, 'views', 'index.html'); // Default to index.html

    switch (req.url) {
        case '/about':
            filePath = path.join(__dirname, 'views', 'about.html');
            break;
        case '/contact':
            filePath = path.join(__dirname, 'views', 'contact.html');
            break;
        case '/products':
            filePath = path.join(__dirname, 'views', 'products.html');
            break;
        case '/subscribe':
            filePath = path.join(__dirname, 'views', 'subscribe.html');
            break;
        case '/':
            filePath = path.join(__dirname, 'views', 'index.html');
            break;
        default:
            filePath = path.join(__dirname, 'views', '404.html');
            break;
    }

    serveFile(res, filePath);
});

// Server listens on the defined port
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
