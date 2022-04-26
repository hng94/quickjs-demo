// import { newQuickJSAsyncWASMModule } from "quickjs-emscripten"
// const main = async () => {
  
//   const module = await newQuickJSAsyncWASMModule()
//   const runtime = module.newRuntime()
//   const path = await import("path")
//   const { promises: fs } = await import("fs")

//   const importsPath = path.join(__dirname, "../examples/imports") + "/"
//   // Module loaders can return promises.
//   // Execution will suspend until the promise resolves.
//   runtime.setModuleLoader((moduleName) => {
//     const modulePath = path.join(importsPath, moduleName)
//     if (!modulePath.startsWith(importsPath)) {
//       throw new Error("out of bounds")
//     }
//     console.log("loading", moduleName, "from", modulePath)
//     return fs.readFile(modulePath, "utf-8")
//   })

//   // evalCodeAsync is required when execution may suspend.
//   const context = runtime.newContext()
//   const result = await context.evalCodeAsync(`
//   import * as React from 'esm.sh/react@17'
//   import * as ReactDOMServer from 'esm.sh/react-dom@17/server'
//   const e = React.createElement
//   globalThis.html = ReactDOMServer.renderToStaticMarkup(
//     e('div', null, e('strong', null, 'Hello world!'))
//   )
//   `)
//   context.unwrapResult(result).dispose()
//   const html = context.getProp(context.global, "html").consume(context.getString)
//   console.log(html) // <div><strong>Hello world!</strong></div>
// }

// main()
export default function main(){}
console.log('dev')