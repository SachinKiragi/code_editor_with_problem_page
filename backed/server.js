const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());



// const processError = async(error)=>{
//     const { GoogleGenerativeAI } = require("@google/generative-ai");

//     const genAI = new GoogleGenerativeAI("AIzaSyBRkUrd3S2oKQYcSkO3gt3UfOb5ivF2Auw");
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `You are an AI tutor using the Socratic method to teach Data Structures and Algorithms. Instead of giving direct answers, guide students by asking probing questions that help them realize their mistakes or inefficiencies.${error} for the above error generate Socratic question generate only one question in 2 sentences max.`;

//     const result = await model.generateContent(prompt);
//     console.log(result.response.text());
//     return result.response.text();
// }





const  { GoogleGenerativeAI } = require ("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyBRkUrd3S2oKQYcSkO3gt3UfOb5ivF2Auw");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: "Hello" }],
    },
    {
      role: "model",
      parts: [{ text: "Great to meet you. What would you like to know?" }],
    },
  ],
});


async function processError(error){
    let result = await chat.sendMessage(`You are an AI tutor using the Socratic method to teach Data Structures and Algorithms. Instead of giving direct answers, guide students by asking probing questions that help them realize their mistakes or inefficiencies.${error} for the above error generate Socratic question generate only one question in 2 sentences max.`);

    return result.response.text();
}
async function getResponse(input){
    let result = await chat.sendMessage(input);

    return result.response.text();
}



app.post("/run", (req, res) => {
    const code = req.body.code;
    const fileName = "temp.cpp";

    fs.writeFileSync(fileName, code);

    const outputFile = process.platform === "win32" ? "temp.exe" : "./temp.out";
    exec(`g++ ${fileName} -o temp && ${outputFile}`, async(error, stdout, stderr) => {
        if (error) {
            const sorcaticQuestion = await processError(stderr);
            return res.json({ output: sorcaticQuestion });
        }
        
        res.json({ output: stdout });
    });
});


app.post("/userinput", async(req, res) => {
 
    const input = (req.body.userInput);
    const response = await getResponse(input);

    return res.json({ output:  response});
    
});

app.listen(5000, () => console.log("Server running on port 5000"));