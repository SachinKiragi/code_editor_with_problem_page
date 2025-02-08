import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

function App() {
    const [code, setCode] = useState(`#include <iostream>\nusing namespace std;\nint main() { cout << "Hello, World!"; return 0; }`);
    const [output, setOutput] = useState("");

    const runCode = async () => {
        try {
            const response = await axios.post("http://localhost:5000/run", { code });
            setOutput(response.data.output);
        } catch (error) {
            setOutput("Error running code");
        }
    };

    return (
        <div>
            <h2>C++ Online Compiler</h2>
            <Editor height="300px" language="cpp" theme="vs-dark" value={code} onChange={setCode} />
            <button onClick={runCode}>Run Code</button>
            <pre>{output}</pre>
        </div>
    );
}

export default App;
