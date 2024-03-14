const express = require('express');
const path = require('path');

const app = express();



// Route for serving bundle.js with the correct Content-Type
app.get('/bundle.js', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'bundle.js'));
});
app.get("/", (req, res) => {
    //hello
    res.send("hello");
});
// Start the server
const port = 8080;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
