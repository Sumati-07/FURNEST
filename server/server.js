
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");

const app = express();


app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to FURNEST API"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`FURNEST server running on port ${PORT}`);
});