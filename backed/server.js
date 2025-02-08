const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/run", (req, res) => {
    const code = req.body.code;
    const fileName = "temp.cpp";

    fs.writeFileSync(fileName, code);

    const outputFile = process.platform === "win32" ? "temp.exe" : "./temp.out";
    exec(`g++ ${fileName} -o temp && ${outputFile}`, (error, stdout, stderr) => {
        if (error) {
            return res.json({ output: stderr });
        }
        res.json({ output: stdout });
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));
