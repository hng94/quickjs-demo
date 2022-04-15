import React, { useEffect } from "react"
import "./App.css"
import { getQuickJS, newQuickJSAsyncWASMModule } from "quickjs-emscripten"

function stringify(val: unknown) {
  if (typeof val === "undefined") {
    return "undefined"
  }

  return JSON.stringify(val, undefined, 2)
}


function App() {
  const [evalResult, setEvalResult] = React.useState<any>(undefined)
  const handleEval = React.useCallback(async () => {
    const wasmModule = await newQuickJSAsyncWASMModule()
    try {
      	const wasm = wasmModule.newContext()
        const fetchHandle = wasm.newFunction("fetch", (args) => {
        const url = wasm.getString(args)
        const promise = wasm.newPromise();
        fetch(url)
        .then(response => response.json())
        .then(data => 
          {
            console.log(data)
            promise.resolve(wasm.newString(JSON.stringify(data)))
          });

        // IMPORTANT: Once you resolve an async action inside QuickJS,
        // call runtime.executePendingJobs() to run any code that was
        // waiting on the promise or callback.
        promise.settled.then(wasm.runtime.executePendingJobs)
        return promise.handle
        })
      fetchHandle.consume((handle) => wasm.setProp(wasm.global, "getData", handle))
      const result = wasm.evalCode(`(async () => {
        const response = await getData('https://6257047615aa015c8239d7cd.mockapi.io/hello')
        // const data =  await response.json()
        return response
      })()`)
      const promiseHandle = wasm.unwrapResult(result)

      // Convert the promise handle into a native promise and await it.
      // If code like this deadlocks, make sure you are calling
      // runtime.executePendingJobs appropriately.
      const resolvedResult = await wasm.resolvePromise(promiseHandle)
      promiseHandle.dispose()
      const resolvedHandle = wasm.unwrapResult(resolvedResult)
      const res =  wasm.getString(resolvedHandle)
      console.log(res)
      setEvalResult(res)
      resolvedHandle.dispose()

    } catch (err) {
      console.log("eval error:", err)
      setEvalResult(err)
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
