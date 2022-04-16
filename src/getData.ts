const registerGetData = (vm: any) => {
        const fetchHandle = vm.newFunction("getData", () => {
        const promise = vm.newPromise();
        fetch('https://6257047615aa015c8239d7cd.mockapi.io/hello')
        .then(response => response.json())
        .then(data => 
          {
            promise.resolve(vm.newString(JSON.stringify(data)))
          });

        // IMPORTANT: Once you resolve an async action inside QuickJS,
        // call runtime.executePendingJobs() to run any code that was
        // waiting on the promise or callback.
        promise.settled.then(vm.runtime.executePendingJobs)
        return promise.handle
        })
      fetchHandle.consume((handle: any) => vm.setProp(vm.global, "getData", handle))
}

export default registerGetData;