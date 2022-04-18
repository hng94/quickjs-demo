const registerEverestFn = (vm: any) => {
    const log = vm.newFunction("log", (p: any) => {
        const s = vm.getString(p);
        console.log("LOG from sandbox:", s);
    });

    const fetchHandle = vm.newFunction("getData", () => {
        const promise = vm.newPromise();
        fetch('https://6257047615aa015c8239d7cd.mockapi.io/hello')
            .then(response => response.json())
            .then(data => {
                promise.resolve(vm.newString(JSON.stringify(data)))
            });
        promise.settled.then(vm.runtime.executePendingJobs)
        return promise.handle
    })
    const _everest = vm.newObject();
    vm.setProp(_everest, "log", log);
    log.dispose();
    vm.setProp(_everest, "getData", fetchHandle);
    fetchHandle.dispose()
    vm.setProp(vm.global, "everest", _everest);
    _everest.dispose();
}

export default registerEverestFn;