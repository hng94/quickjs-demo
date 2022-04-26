import React, { useEffect } from "react"
import "./App.css"
import { newQuickJSWASMModule } from "quickjs-emscripten"
import { Arena } from "quickjs-emscripten-sync"
import { io } from "socket.io-client";
function App() {
  const [evalResult, setEvalResult] = React.useState<any>(undefined)
  const handleEval = React.useCallback(async () => {
    const wasmModule = await newQuickJSWASMModule()
    try {
      	const vm = wasmModule.newContext()
        const arena = new Arena(vm, { isMarshalable: true });
        arena.expose({
          console: {
            log: console.log
          },
          io
        });
        arena.evalCode(`
          const socket = io('ws://localhost:4000');
          socket.on("msg", (arg) => {
            console.log(arg); 
          });
          socket.emit("msg", "hi server")
        `); // run console.log
      } catch (err) {
        console.log("eval error:", err)
        setEvalResult(JSON.stringify(err))
      }
  }, [setEvalResult])
  useEffect(() => {
    handleEval()
  }, [handleEval, setEvalResult])
  
  return (
    <div className="App">
      <div>
        <h3>Eval result:</h3>
        <pre>{evalResult}</pre>
      </div>
    </div>
  )
}

export default App
