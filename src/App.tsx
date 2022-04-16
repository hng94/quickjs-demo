import React, { useEffect } from "react"
import "./App.css"
import { newQuickJSWASMModule } from "quickjs-emscripten"
import registerEverestFn from "./everestFn"

function App() {
  const [evalResult, setEvalResult] = React.useState<any>(undefined)
  const handleEval = React.useCallback(async () => {
    const wasmModule = await newQuickJSWASMModule()
    try {
      	const vm = wasmModule.newContext()
        registerEverestFn(vm)
        const result = vm.evalCode(`(async () => {
          const response = await everest.getData();
          everest.log(response)
          return response;
        })()`)
        const promiseHandle = vm.unwrapResult(result)
        const resolvedResult = await vm.resolvePromise(promiseHandle)
        promiseHandle.dispose()
        const resolvedHandle = vm.unwrapResult(resolvedResult)
        const res =  vm.getString(resolvedHandle)
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
