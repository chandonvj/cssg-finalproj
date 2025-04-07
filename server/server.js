const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

app.use(cors());
app.use(express.static(path.join(__dirname, "../client/public")));
app.use(express.json())


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/public/index.html"));
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/public/index.html"));
});
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html')); 
});
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html')); 
});
  