import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const Problem = () => {

    const [code, setCode] = useState(`#include <iostream>\nusing namespace std;\nint main() { cout << "Hello, World!"; return 0; }`);
    const [output, setOutput] = useState("");
    const [userInput, setuserInput] = useState('');

    const runCode = async () => {
        try {
            const response = await axios.post("http://localhost:5000/run", { code });
            setOutput(response.data.output);
        } catch (error) {
            setOutput("Error running code");
        }
    };

    const getGeminiResponse = async()=>{
        try {
            const response = await axios.post("http://localhost:5000/userinput", { userInput });
            setOutput(response.data.output);
        } catch (error) {
            setOutput("Error running code");
        }
    }

  return (

    <div style={{display:'flex', flexDirection:'row'}}>
    <div style={{flex:1}}>
        <h2>
        Problem description
        </h2>
    </div>
    <div style={{flex:1}}>

            <h2>C++ Online Compiler</h2>
            <Editor height="300px" language="cpp" theme="vs-dark" value={code} onChange={setCode} />
            <button onClick={runCode}>Run Code</button>
            <pre>{output}</pre>

            <div>
                <input type="text"  onChange={(e)=>setuserInput(e.target.value)} value={userInput}/>
                <button onClick={getGeminiResponse}>Submit </button>
            </div>
        </div>
    </div>

  )
}

export default Problem