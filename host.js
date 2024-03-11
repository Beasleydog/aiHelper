const express = require('express');
const path = require('path');

const app = express();

// Middleware to set CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Content-Type', 'application/javascript');
    next();
});

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route for serving bundle.js with the correct Content-Type
app.get('/bundle.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'bundle.js'));
});

// Start the server
const port = 8080;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
