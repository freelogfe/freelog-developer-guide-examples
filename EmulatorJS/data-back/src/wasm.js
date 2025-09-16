﻿;(function(proxyWindow) {
    with (proxyWindow.__MICRO_APP_WINDOW__) {
        (function(window, self, globalThis, document, Document, Array, Object, String, Boolean, Math, Number, Symbol, Date, Function, Proxy, WeakMap, WeakSet, Set, Map, Reflect, Element, Node, RegExp, Error, TypeError, JSON, isNaN, parseFloat, parseInt, performance, console, decodeURI, encodeURI, decodeURIComponent, encodeURIComponent, navigator, undefined, location, history) {
            ;// To work around a bug in emscripten's polyfills for setImmediate in strict mode
            var setImmediate;

            // To work around a deadlock in firefox
            // Use platform_emscripten_has_async_atomics() to determine actual availability
            if (Atomics && !Atomics.waitAsync)
                Atomics.waitAsync = true;
            var EJS_Runtime = (()=>{
                var _scriptName = typeof document != 'undefined' ? document.currentScript?.src : undefined;
                return (async function(moduleArg={}) {
                    var moduleRtn;

                    var Module = moduleArg;
                    var readyPromiseResolve, readyPromiseReject;
                    var readyPromise = new Promise((resolve,reject)=>{
                        readyPromiseResolve = resolve;
                        readyPromiseReject = reject
                    }
                    );
                    var ENVIRONMENT_IS_WEB = typeof window == "object";
                    var ENVIRONMENT_IS_WORKER = typeof WorkerGlobalScope != "undefined";
                    var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string" && process.type != "renderer";
                    var arguments_ = [];
                    var thisProgram = "./this.program";
                    var quit_ = (status,toThrow)=>{
                        throw toThrow
                    }
                    ;
                    if (ENVIRONMENT_IS_WORKER) {
                        _scriptName = self.location.href
                    }
                    var scriptDirectory = "";
                    function locateFile(path) {
                        if (Module["locateFile"]) {
                            return Module["locateFile"](path, scriptDirectory)
                        }
                        return scriptDirectory + path
                    }
                    var readAsync, readBinary;
                    if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
                        try {
                            scriptDirectory = new URL(".",_scriptName).href
                        } catch {}
                        {
                            if (ENVIRONMENT_IS_WORKER) {
                                readBinary = url=>{
                                    var xhr = new XMLHttpRequest;
                                    xhr.open("GET", url, false);
                                    xhr.responseType = "arraybuffer";
                                    xhr.send(null);
                                    return new Uint8Array(xhr.response)
                                }
                            }
                            readAsync = async url=>{
                                var response = await fetch(url, {
                                    credentials: "same-origin"
                                });
                                if (response.ok) {
                                    return response.arrayBuffer()
                                }
                                throw new Error(response.status + " : " + response.url)
                            }
                        }
                    } else {}
                    var out = console.log.bind(console);
                    var err = console.error.bind(console);
                    var wasmBinary;
                    var wasmMemory;
                    var ABORT = false;
                    var EXITSTATUS;
                    function assert(condition, text) {
                        if (!condition) {
                            abort(text)
                        }
                    }
                    var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAP64, HEAPU64, HEAPF64;
                    var runtimeInitialized = false;
                    function updateMemoryViews() {
                        var b = wasmMemory.buffer;
                        HEAP8 = new Int8Array(b);
                        HEAP16 = new Int16Array(b);
                        Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
                        HEAPU16 = new Uint16Array(b);
                        HEAP32 = new Int32Array(b);
                        HEAPU32 = new Uint32Array(b);
                        HEAPF32 = new Float32Array(b);
                        HEAPF64 = new Float64Array(b);
                        HEAP64 = new BigInt64Array(b);
                        HEAPU64 = new BigUint64Array(b)
                    }
                    function preRun() {
                        if (Module["preRun"]) {
                            if (typeof Module["preRun"] == "function")
                                Module["preRun"] = [Module["preRun"]];
                            while (Module["preRun"].length) {
                                addOnPreRun(Module["preRun"].shift())
                            }
                        }
                        callRuntimeCallbacks(onPreRuns)
                    }
                    function initRuntime() {
                        runtimeInitialized = true;
                        SOCKFS.root = FS.mount(SOCKFS, {}, null);
                        if (!Module["noFSInit"] && !FS.initialized)
                            FS.init();
                        TTY.init();
                        wasmExports["vh"]();
                        FS.ignorePermissions = false
                    }
                    function preMain() {}
                    function postRun() {
                        if (Module["postRun"]) {
                            if (typeof Module["postRun"] == "function")
                                Module["postRun"] = [Module["postRun"]];
                            while (Module["postRun"].length) {
                                addOnPostRun(Module["postRun"].shift())
                            }
                        }
                        callRuntimeCallbacks(onPostRuns)
                    }
                    var runDependencies = 0;
                    var dependenciesFulfilled = null;
                    function getUniqueRunDependency(id) {
                        return id
                    }
                    function addRunDependency(id) {
                        runDependencies++;
                        Module["monitorRunDependencies"]?.(runDependencies)
                    }
                    function removeRunDependency(id) {
                        runDependencies--;
                        Module["monitorRunDependencies"]?.(runDependencies);
                        if (runDependencies == 0) {
                            if (dependenciesFulfilled) {
                                var callback = dependenciesFulfilled;
                                dependenciesFulfilled = null;
                                callback()
                            }
                        }
                    }
                    function abort(what) {
                        Module["onAbort"]?.(what);
                        what = "Aborted(" + what + ")";
                        err(what);
                        ABORT = true;
                        what += ". Build with -sASSERTIONS for more info.";
                        var e = new WebAssembly.RuntimeError(what);
                        readyPromiseReject(e);
                        throw e
                    }
                    var wasmBinaryFile;
                    function findWasmBinary() {
                        return locateFile("fceumm_libretro.wasm")
                    }
                    function getBinarySync(file) {
                        if (file == wasmBinaryFile && wasmBinary) {
                            return new Uint8Array(wasmBinary)
                        }
                        if (readBinary) {
                            return readBinary(file)
                        }
                        throw "both async and sync fetching of the wasm failed"
                    }
                    async function getWasmBinary(binaryFile) {
                        if (!wasmBinary) {
                            try {
                                var response = await readAsync(binaryFile);
                                return new Uint8Array(response)
                            } catch {}
                        }
                        return getBinarySync(binaryFile)
                    }
                    async function instantiateArrayBuffer(binaryFile, imports) {
                        try {
                            var binary = await getWasmBinary(binaryFile);
                            var instance = await WebAssembly.instantiate(binary, imports);
                            return instance
                        } catch (reason) {
                            err(`failed to asynchronously prepare wasm: ${reason}`);
                            abort(reason)
                        }
                    }
                    async function instantiateAsync(binary, binaryFile, imports) {
                        if (!binary && typeof WebAssembly.instantiateStreaming == "function") {
                            try {
                                var response = fetch(binaryFile, {
                                    credentials: "same-origin"
                                });
                                var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
                                return instantiationResult
                            } catch (reason) {
                                err(`wasm streaming compile failed: ${reason}`);
                                err("falling back to ArrayBuffer instantiation")
                            }
                        }
                        return instantiateArrayBuffer(binaryFile, imports)
                    }
                    function getWasmImports() {
                        return {
                            a: wasmImports
                        }
                    }
                    async function createWasm() {
                        function receiveInstance(instance, module) {
                            wasmExports = instance.exports;
                            wasmExports = Asyncify.instrumentWasmExports(wasmExports);
                            wasmMemory = wasmExports["uh"];
                            updateMemoryViews();
                            wasmTable = wasmExports["wh"];
                            removeRunDependency("wasm-instantiate");
                            return wasmExports
                        }
                        addRunDependency("wasm-instantiate");
                        function receiveInstantiationResult(result) {
                            return receiveInstance(result["instance"])
                        }
                        var info = getWasmImports();
                        if (Module["instantiateWasm"]) {
                            return new Promise((resolve,reject)=>{
                                Module["instantiateWasm"](info, (mod,inst)=>{
                                    resolve(receiveInstance(mod, inst))
                                }
                                )
                            }
                            )
                        }
                        wasmBinaryFile ??= findWasmBinary();
                        try {
                            var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
                            var exports = receiveInstantiationResult(result);
                            return exports
                        } catch (e) {
                            readyPromiseReject(e);
                            return Promise.reject(e)
                        }
                    }
                    class ExitStatus {
                        name = "ExitStatus";
                        constructor(status) {
                            this.message = `Program terminated with exit(${status})`;
                            this.status = status
                        }
                    }
                    var callRuntimeCallbacks = callbacks=>{
                        while (callbacks.length > 0) {
                            callbacks.shift()(Module)
                        }
                    }
                    ;
                    var onPostRuns = [];
                    var addOnPostRun = cb=>onPostRuns.push(cb);
                    var onPreRuns = [];
                    var addOnPreRun = cb=>onPreRuns.push(cb);
                    function getValue(ptr, type="i8") {
                        if (type.endsWith("*"))
                            type = "*";
                        switch (type) {
                        case "i1":
                            return HEAP8[ptr];
                        case "i8":
                            return HEAP8[ptr];
                        case "i16":
                            return HEAP16[ptr >> 1];
                        case "i32":
                            return HEAP32[ptr >> 2];
                        case "i64":
                            return HEAP64[ptr >> 3];
                        case "float":
                            return HEAPF32[ptr >> 2];
                        case "double":
                            return HEAPF64[ptr >> 3];
                        case "*":
                            return HEAPU32[ptr >> 2];
                        default:
                            abort(`invalid type for getValue: ${type}`)
                        }
                    }
                    var noExitRuntime = true;
                    function setValue(ptr, value, type="i8") {
                        if (type.endsWith("*"))
                            type = "*";
                        switch (type) {
                        case "i1":
                            HEAP8[ptr] = value;
                            break;
                        case "i8":
                            HEAP8[ptr] = value;
                            break;
                        case "i16":
                            HEAP16[ptr >> 1] = value;
                            break;
                        case "i32":
                            HEAP32[ptr >> 2] = value;
                            break;
                        case "i64":
                            HEAP64[ptr >> 3] = BigInt(value);
                            break;
                        case "float":
                            HEAPF32[ptr >> 2] = value;
                            break;
                        case "double":
                            HEAPF64[ptr >> 3] = value;
                            break;
                        case "*":
                            HEAPU32[ptr >> 2] = value;
                            break;
                        default:
                            abort(`invalid type for setValue: ${type}`)
                        }
                    }
                    var stackRestore = val=>__emscripten_stack_restore(val);
                    var stackSave = ()=>_emscripten_stack_get_current();
                    var RPE = {
                        canvasWidth: 0,
                        canvasHeight: 0,
                        sentinelPromise: null,
                        command_queue: [],
                        command_reply_queue: []
                    };
                    function _PlatformEmscriptenGLContextEventInit() {
                        Module.canvas.addEventListener("webglcontextlost", function(e) {
                            e.preventDefault();
                            _platform_emscripten_gl_context_lost_cb()
                        });
                        Module.canvas.addEventListener("webglcontextrestored", function() {
                            _platform_emscripten_gl_context_restored_cb()
                        })
                    }
                    var _PlatformEmscriptenGetSystemInfo = function() {
                        var userAgent = navigator?.userAgent?.toLowerCase?.();
                        if (!userAgent)
                            return 0;
                        var browser = 1 + ["chrom", "firefox", "safari"].findIndex(i=>userAgent.includes(i));
                        var os = 1 + [/windows/, /linux|cros|android/, /iphone|ipad/, /mac os/].findIndex(i=>i.test(userAgent));
                        return browser | os << 16
                    };
                    function PlatformEmscriptenUpdateMemoryUsage() {
                        _platform_emscripten_update_memory_usage_cb(BigInt(performance.memory.usedJSHeapSize || 0), BigInt(performance.memory.jsHeapSizeLimit || 0));
                        setTimeout(PlatformEmscriptenUpdateMemoryUsage, 5e3)
                    }
                    function _PlatformEmscriptenMemoryUsageInit() {
                        if (!performance.memory)
                            return;
                        PlatformEmscriptenUpdateMemoryUsage()
                    }
                    function PlatformEmscriptenPowerStateChange(e) {
                        _platform_emscripten_update_power_state_cb(true, Number.isFinite(e.target.dischargingTime) ? e.target.dischargingTime : 2147483647, e.target.level, e.target.charging)
                    }
                    function _PlatformEmscriptenPowerStateInit() {
                        if (!navigator.getBattery)
                            return;
                        navigator.getBattery().then(function(battery) {
                            battery.addEventListener("chargingchange", PlatformEmscriptenPowerStateChange);
                            battery.addEventListener("levelchange", PlatformEmscriptenPowerStateChange);
                            PlatformEmscriptenPowerStateChange({
                                target: battery
                            })
                        })
                    }
                    var PlatformEmscriptenDoSetCanvasSize = async function(width, height) {
                        var expAX = 600;
                        var expAY = 450;
                        var expBX = expAX + 100;
                        var expBY = expAY + 100;
                        await new Promise(r=>setTimeout(r, 0));
                        window.resizeTo(expAX, expAY);
                        await new Promise(r=>setTimeout(r, 50));
                        var oldWidth = RPE.canvasWidth;
                        var oldHeight = RPE.canvasHeight;
                        window.resizeTo(expBX, expBY);
                        await new Promise(r=>setTimeout(r, 50));
                        var projX = (expBX - expAX) * (width - oldWidth) / (RPE.canvasWidth - oldWidth) + expAX;
                        var projY = (expBY - expAY) * (height - oldHeight) / (RPE.canvasHeight - oldHeight) + expAY;
                        window.resizeTo(Math.round(projX), Math.round(projY))
                    };
                    PlatformEmscriptenDoSetCanvasSize.isAsync = true;
                    function _PlatformEmscriptenSetCanvasSize(width, height) {
                        PlatformEmscriptenDoSetCanvasSize(width, height)
                    }
                    async function PlatformEmscriptenDoSetWakeLock(state) {
                        if (state && !RPE.sentinelPromise && navigator?.wakeLock?.request) {
                            try {
                                RPE.sentinelPromise = navigator.wakeLock.request("screen")
                            } catch (e) {}
                        } else if (!state && RPE.sentinelPromise) {
                            try {
                                var sentinel = await RPE.sentinelPromise;
                                sentinel.release()
                            } catch (e) {}
                            RPE.sentinelPromise = null
                        }
                    }
                    PlatformEmscriptenDoSetWakeLock.isAsync = true;
                    function _PlatformEmscriptenSetWakeLock(state) {
                        PlatformEmscriptenDoSetWakeLock(state)
                    }
                    function _PlatformEmscriptenWatchCanvasSizeAndDpr(dpr) {
                        if (RPE.observer) {
                            RPE.observer.unobserve(Module.canvas);
                            RPE.observer.observe(Module.canvas);
                            return
                        }
                        RPE.observer = new ResizeObserver(function(e) {
                            var width, height;
                            var entry = e.find(i=>i.target == Module.canvas);
                            if (!entry)
                                return;
                            if (entry.devicePixelContentBoxSize) {
                                width = entry.devicePixelContentBoxSize[0].inlineSize;
                                height = entry.devicePixelContentBoxSize[0].blockSize
                            } else {
                                width = Math.round(entry.contentRect.width * window.devicePixelRatio);
                                height = Math.round(entry.contentRect.height * window.devicePixelRatio)
                            }
                            RPE.canvasWidth = width;
                            RPE.canvasHeight = height;
                            HEAPF64[dpr >> 3] = window.devicePixelRatio;
                            _platform_emscripten_update_canvas_dimensions_cb(width, height, dpr)
                        }
                        );
                        RPE.observer.observe(Module.canvas);
                        window.addEventListener("resize", function() {
                            RPE.observer.unobserve(Module.canvas);
                            RPE.observer.observe(Module.canvas)
                        }, false)
                    }
                    function _PlatformEmscriptenWatchFullscreen() {
                        document.addEventListener("fullscreenchange", function() {
                            _platform_emscripten_update_fullscreen_state_cb(!!document.fullscreenElement)
                        }, false)
                    }
                    function _PlatformEmscriptenWatchWindowVisibility() {
                        document.addEventListener("visibilitychange", function() {
                            _platform_emscripten_update_window_hidden_cb(document.visibilityState == "hidden")
                        }, false)
                    }
                    var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder : undefined;
                    var UTF8ArrayToString = (heapOrArray,idx=0,maxBytesToRead=NaN)=>{
                        var endIdx = idx + maxBytesToRead;
                        var endPtr = idx;
                        while (heapOrArray[endPtr] && !(endPtr >= endIdx))
                            ++endPtr;
                        if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
                            return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr))
                        }
                        var str = "";
                        while (idx < endPtr) {
                            var u0 = heapOrArray[idx++];
                            if (!(u0 & 128)) {
                                str += String.fromCharCode(u0);
                                continue
                            }
                            var u1 = heapOrArray[idx++] & 63;
                            if ((u0 & 224) == 192) {
                                str += String.fromCharCode((u0 & 31) << 6 | u1);
                                continue
                            }
                            var u2 = heapOrArray[idx++] & 63;
                            if ((u0 & 240) == 224) {
                                u0 = (u0 & 15) << 12 | u1 << 6 | u2
                            } else {
                                u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63
                            }
                            if (u0 < 65536) {
                                str += String.fromCharCode(u0)
                            } else {
                                var ch = u0 - 65536;
                                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
                            }
                        }
                        return str
                    }
                    ;
                    var UTF8ToString = (ptr,maxBytesToRead)=>ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
                    var ___assert_fail = (condition,filename,line,func)=>abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"]);
                    var initRandomFill = ()=>view=>crypto.getRandomValues(view);
                    var randomFill = view=>{
                        (randomFill = initRandomFill())(view)
                    }
                    ;
                    var PATH = {
                        isAbs: path=>path.charAt(0) === "/",
                        splitPath: filename=>{
                            var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                            return splitPathRe.exec(filename).slice(1)
                        }
                        ,
                        normalizeArray: (parts,allowAboveRoot)=>{
                            var up = 0;
                            for (var i = parts.length - 1; i >= 0; i--) {
                                var last = parts[i];
                                if (last === ".") {
                                    parts.splice(i, 1)
                                } else if (last === "..") {
                                    parts.splice(i, 1);
                                    up++
                                } else if (up) {
                                    parts.splice(i, 1);
                                    up--
                                }
                            }
                            if (allowAboveRoot) {
                                for (; up; up--) {
                                    parts.unshift("..")
                                }
                            }
                            return parts
                        }
                        ,
                        normalize: path=>{
                            var isAbsolute = PATH.isAbs(path)
                              , trailingSlash = path.slice(-1) === "/";
                            path = PATH.normalizeArray(path.split("/").filter(p=>!!p), !isAbsolute).join("/");
                            if (!path && !isAbsolute) {
                                path = "."
                            }
                            if (path && trailingSlash) {
                                path += "/"
                            }
                            return (isAbsolute ? "/" : "") + path
                        }
                        ,
                        dirname: path=>{
                            var result = PATH.splitPath(path)
                              , root = result[0]
                              , dir = result[1];
                            if (!root && !dir) {
                                return "."
                            }
                            if (dir) {
                                dir = dir.slice(0, -1)
                            }
                            return root + dir
                        }
                        ,
                        basename: path=>path && path.match(/([^\/]+|\/)\/*$/)[1],
                        join: (...paths)=>PATH.normalize(paths.join("/")),
                        join2: (l,r)=>PATH.normalize(l + "/" + r)
                    };
                    var PATH_FS = {
                        resolve: (...args)=>{
                            var resolvedPath = ""
                              , resolvedAbsolute = false;
                            for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                                var path = i >= 0 ? args[i] : FS.cwd();
                                if (typeof path != "string") {
                                    throw new TypeError("Arguments to path.resolve must be strings")
                                } else if (!path) {
                                    return ""
                                }
                                resolvedPath = path + "/" + resolvedPath;
                                resolvedAbsolute = PATH.isAbs(path)
                            }
                            resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(p=>!!p), !resolvedAbsolute).join("/");
                            return (resolvedAbsolute ? "/" : "") + resolvedPath || "."
                        }
                        ,
                        relative: (from,to)=>{
                            from = PATH_FS.resolve(from).slice(1);
                            to = PATH_FS.resolve(to).slice(1);
                            function trim(arr) {
                                var start = 0;
                                for (; start < arr.length; start++) {
                                    if (arr[start] !== "")
                                        break
                                }
                                var end = arr.length - 1;
                                for (; end >= 0; end--) {
                                    if (arr[end] !== "")
                                        break
                                }
                                if (start > end)
                                    return [];
                                return arr.slice(start, end - start + 1)
                            }
                            var fromParts = trim(from.split("/"));
                            var toParts = trim(to.split("/"));
                            var length = Math.min(fromParts.length, toParts.length);
                            var samePartsLength = length;
                            for (var i = 0; i < length; i++) {
                                if (fromParts[i] !== toParts[i]) {
                                    samePartsLength = i;
                                    break
                                }
                            }
                            var outputParts = [];
                            for (var i = samePartsLength; i < fromParts.length; i++) {
                                outputParts.push("..")
                            }
                            outputParts = outputParts.concat(toParts.slice(samePartsLength));
                            return outputParts.join("/")
                        }
                    };
                    var FS_stdin_getChar_buffer = [];
                    var lengthBytesUTF8 = str=>{
                        var len = 0;
                        for (var i = 0; i < str.length; ++i) {
                            var c = str.charCodeAt(i);
                            if (c <= 127) {
                                len++
                            } else if (c <= 2047) {
                                len += 2
                            } else if (c >= 55296 && c <= 57343) {
                                len += 4;
                                ++i
                            } else {
                                len += 3
                            }
                        }
                        return len
                    }
                    ;
                    var stringToUTF8Array = (str,heap,outIdx,maxBytesToWrite)=>{
                        if (!(maxBytesToWrite > 0))
                            return 0;
                        var startIdx = outIdx;
                        var endIdx = outIdx + maxBytesToWrite - 1;
                        for (var i = 0; i < str.length; ++i) {
                            var u = str.charCodeAt(i);
                            if (u >= 55296 && u <= 57343) {
                                var u1 = str.charCodeAt(++i);
                                u = 65536 + ((u & 1023) << 10) | u1 & 1023
                            }
                            if (u <= 127) {
                                if (outIdx >= endIdx)
                                    break;
                                heap[outIdx++] = u
                            } else if (u <= 2047) {
                                if (outIdx + 1 >= endIdx)
                                    break;
                                heap[outIdx++] = 192 | u >> 6;
                                heap[outIdx++] = 128 | u & 63
                            } else if (u <= 65535) {
                                if (outIdx + 2 >= endIdx)
                                    break;
                                heap[outIdx++] = 224 | u >> 12;
                                heap[outIdx++] = 128 | u >> 6 & 63;
                                heap[outIdx++] = 128 | u & 63
                            } else {
                                if (outIdx + 3 >= endIdx)
                                    break;
                                heap[outIdx++] = 240 | u >> 18;
                                heap[outIdx++] = 128 | u >> 12 & 63;
                                heap[outIdx++] = 128 | u >> 6 & 63;
                                heap[outIdx++] = 128 | u & 63
                            }
                        }
                        heap[outIdx] = 0;
                        return outIdx - startIdx
                    }
                    ;
                    var intArrayFromString = (stringy,dontAddNull,length)=>{
                        var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
                        var u8array = new Array(len);
                        var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
                        if (dontAddNull)
                            u8array.length = numBytesWritten;
                        return u8array
                    }
                    ;
                    var FS_stdin_getChar = ()=>{
                        if (!FS_stdin_getChar_buffer.length) {
                            var result = null;
                            if (typeof window != "undefined" && typeof window.prompt == "function") {
                                result = window.prompt("Input: ");
                                if (result !== null) {
                                    result += "\n"
                                }
                            } else {}
                            if (!result) {
                                return null
                            }
                            FS_stdin_getChar_buffer = intArrayFromString(result, true)
                        }
                        return FS_stdin_getChar_buffer.shift()
                    }
                    ;
                    var TTY = {
                        ttys: [],
                        init() {},
                        shutdown() {},
                        register(dev, ops) {
                            TTY.ttys[dev] = {
                                input: [],
                                output: [],
                                ops
                            };
                            FS.registerDevice(dev, TTY.stream_ops)
                        },
                        stream_ops: {
                            open(stream) {
                                var tty = TTY.ttys[stream.node.rdev];
                                if (!tty) {
                                    throw new FS.ErrnoError(43)
                                }
                                stream.tty = tty;
                                stream.seekable = false
                            },
                            close(stream) {
                                stream.tty.ops.fsync(stream.tty)
                            },
                            fsync(stream) {
                                stream.tty.ops.fsync(stream.tty)
                            },
                            read(stream, buffer, offset, length, pos) {
                                if (!stream.tty || !stream.tty.ops.get_char) {
                                    throw new FS.ErrnoError(60)
                                }
                                var bytesRead = 0;
                                for (var i = 0; i < length; i++) {
                                    var result;
                                    try {
                                        result = stream.tty.ops.get_char(stream.tty)
                                    } catch (e) {
                                        throw new FS.ErrnoError(29)
                                    }
                                    if (result === undefined && bytesRead === 0) {
                                        throw new FS.ErrnoError(6)
                                    }
                                    if (result === null || result === undefined)
                                        break;
                                    bytesRead++;
                                    buffer[offset + i] = result
                                }
                                if (bytesRead) {
                                    stream.node.atime = Date.now()
                                }
                                return bytesRead
                            },
                            write(stream, buffer, offset, length, pos) {
                                if (!stream.tty || !stream.tty.ops.put_char) {
                                    throw new FS.ErrnoError(60)
                                }
                                try {
                                    for (var i = 0; i < length; i++) {
                                        stream.tty.ops.put_char(stream.tty, buffer[offset + i])
                                    }
                                } catch (e) {
                                    throw new FS.ErrnoError(29)
                                }
                                if (length) {
                                    stream.node.mtime = stream.node.ctime = Date.now()
                                }
                                return i
                            }
                        },
                        default_tty_ops: {
                            get_char(tty) {
                                return FS_stdin_getChar()
                            },
                            put_char(tty, val) {
                                if (val === null || val === 10) {
                                    out(UTF8ArrayToString(tty.output));
                                    tty.output = []
                                } else {
                                    if (val != 0)
                                        tty.output.push(val)
                                }
                            },
                            fsync(tty) {
                                if (tty.output?.length > 0) {
                                    out(UTF8ArrayToString(tty.output));
                                    tty.output = []
                                }
                            },
                            ioctl_tcgets(tty) {
                                return {
                                    c_iflag: 25856,
                                    c_oflag: 5,
                                    c_cflag: 191,
                                    c_lflag: 35387,
                                    c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                }
                            },
                            ioctl_tcsets(tty, optional_actions, data) {
                                return 0
                            },
                            ioctl_tiocgwinsz(tty) {
                                return [24, 80]
                            }
                        },
                        default_tty1_ops: {
                            put_char(tty, val) {
                                if (val === null || val === 10) {
                                    err(UTF8ArrayToString(tty.output));
                                    tty.output = []
                                } else {
                                    if (val != 0)
                                        tty.output.push(val)
                                }
                            },
                            fsync(tty) {
                                if (tty.output?.length > 0) {
                                    err(UTF8ArrayToString(tty.output));
                                    tty.output = []
                                }
                            }
                        }
                    };
                    var mmapAlloc = size=>{
                        abort()
                    }
                    ;
                    var MEMFS = {
                        ops_table: null,
                        mount(mount) {
                            return MEMFS.createNode(null, "/", 16895, 0)
                        },
                        createNode(parent, name, mode, dev) {
                            if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
                                throw new FS.ErrnoError(63)
                            }
                            MEMFS.ops_table ||= {
                                dir: {
                                    node: {
                                        getattr: MEMFS.node_ops.getattr,
                                        setattr: MEMFS.node_ops.setattr,
                                        lookup: MEMFS.node_ops.lookup,
                                        mknod: MEMFS.node_ops.mknod,
                                        rename: MEMFS.node_ops.rename,
                                        unlink: MEMFS.node_ops.unlink,
                                        rmdir: MEMFS.node_ops.rmdir,
                                        readdir: MEMFS.node_ops.readdir,
                                        symlink: MEMFS.node_ops.symlink
                                    },
                                    stream: {
                                        llseek: MEMFS.stream_ops.llseek
                                    }
                                },
                                file: {
                                    node: {
                                        getattr: MEMFS.node_ops.getattr,
                                        setattr: MEMFS.node_ops.setattr
                                    },
                                    stream: {
                                        llseek: MEMFS.stream_ops.llseek,
                                        read: MEMFS.stream_ops.read,
                                        write: MEMFS.stream_ops.write,
                                        mmap: MEMFS.stream_ops.mmap,
                                        msync: MEMFS.stream_ops.msync
                                    }
                                },
                                link: {
                                    node: {
                                        getattr: MEMFS.node_ops.getattr,
                                        setattr: MEMFS.node_ops.setattr,
                                        readlink: MEMFS.node_ops.readlink
                                    },
                                    stream: {}
                                },
                                chrdev: {
                                    node: {
                                        getattr: MEMFS.node_ops.getattr,
                                        setattr: MEMFS.node_ops.setattr
                                    },
                                    stream: FS.chrdev_stream_ops
                                }
                            };
                            var node = FS.createNode(parent, name, mode, dev);
                            if (FS.isDir(node.mode)) {
                                node.node_ops = MEMFS.ops_table.dir.node;
                                node.stream_ops = MEMFS.ops_table.dir.stream;
                                node.contents = {}
                            } else if (FS.isFile(node.mode)) {
                                node.node_ops = MEMFS.ops_table.file.node;
                                node.stream_ops = MEMFS.ops_table.file.stream;
                                node.usedBytes = 0;
                                node.contents = null
                            } else if (FS.isLink(node.mode)) {
                                node.node_ops = MEMFS.ops_table.link.node;
                                node.stream_ops = MEMFS.ops_table.link.stream
                            } else if (FS.isChrdev(node.mode)) {
                                node.node_ops = MEMFS.ops_table.chrdev.node;
                                node.stream_ops = MEMFS.ops_table.chrdev.stream
                            }
                            node.atime = node.mtime = node.ctime = Date.now();
                            if (parent) {
                                parent.contents[name] = node;
                                parent.atime = parent.mtime = parent.ctime = node.atime
                            }
                            return node
                        },
                        getFileDataAsTypedArray(node) {
                            if (!node.contents)
                                return new Uint8Array(0);
                            if (node.contents.subarray)
                                return node.contents.subarray(0, node.usedBytes);
                            return new Uint8Array(node.contents)
                        },
                        expandFileStorage(node, newCapacity) {
                            var prevCapacity = node.contents ? node.contents.length : 0;
                            if (prevCapacity >= newCapacity)
                                return;
                            var CAPACITY_DOUBLING_MAX = 1024 * 1024;
                            newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
                            if (prevCapacity != 0)
                                newCapacity = Math.max(newCapacity, 256);
                            var oldContents = node.contents;
                            node.contents = new Uint8Array(newCapacity);
                            if (node.usedBytes > 0)
                                node.contents.set(oldContents.subarray(0, node.usedBytes), 0)
                        },
                        resizeFileStorage(node, newSize) {
                            if (node.usedBytes == newSize)
                                return;
                            if (newSize == 0) {
                                node.contents = null;
                                node.usedBytes = 0
                            } else {
                                var oldContents = node.contents;
                                node.contents = new Uint8Array(newSize);
                                if (oldContents) {
                                    node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)))
                                }
                                node.usedBytes = newSize
                            }
                        },
                        node_ops: {
                            getattr(node) {
                                var attr = {};
                                attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
                                attr.ino = node.id;
                                attr.mode = node.mode;
                                attr.nlink = 1;
                                attr.uid = 0;
                                attr.gid = 0;
                                attr.rdev = node.rdev;
                                if (FS.isDir(node.mode)) {
                                    attr.size = 4096
                                } else if (FS.isFile(node.mode)) {
                                    attr.size = node.usedBytes
                                } else if (FS.isLink(node.mode)) {
                                    attr.size = node.link.length
                                } else {
                                    attr.size = 0
                                }
                                attr.atime = new Date(node.atime);
                                attr.mtime = new Date(node.mtime);
                                attr.ctime = new Date(node.ctime);
                                attr.blksize = 4096;
                                attr.blocks = Math.ceil(attr.size / attr.blksize);
                                return attr
                            },
                            setattr(node, attr) {
                                for (const key of ["mode", "atime", "mtime", "ctime"]) {
                                    if (attr[key] != null) {
                                        node[key] = attr[key]
                                    }
                                }
                                if (attr.size !== undefined) {
                                    MEMFS.resizeFileStorage(node, attr.size)
                                }
                            },
                            lookup(parent, name) {
                                throw MEMFS.doesNotExistError
                            },
                            mknod(parent, name, mode, dev) {
                                return MEMFS.createNode(parent, name, mode, dev)
                            },
                            rename(old_node, new_dir, new_name) {
                                var new_node;
                                try {
                                    new_node = FS.lookupNode(new_dir, new_name)
                                } catch (e) {}
                                if (new_node) {
                                    if (FS.isDir(old_node.mode)) {
                                        for (var i in new_node.contents) {
                                            throw new FS.ErrnoError(55)
                                        }
                                    }
                                    FS.hashRemoveNode(new_node)
                                }
                                delete old_node.parent.contents[old_node.name];
                                new_dir.contents[new_name] = old_node;
                                old_node.name = new_name;
                                new_dir.ctime = new_dir.mtime = old_node.parent.ctime = old_node.parent.mtime = Date.now()
                            },
                            unlink(parent, name) {
                                delete parent.contents[name];
                                parent.ctime = parent.mtime = Date.now()
                            },
                            rmdir(parent, name) {
                                var node = FS.lookupNode(parent, name);
                                for (var i in node.contents) {
                                    throw new FS.ErrnoError(55)
                                }
                                delete parent.contents[name];
                                parent.ctime = parent.mtime = Date.now()
                            },
                            readdir(node) {
                                return [".", "..", ...Object.keys(node.contents)]
                            },
                            symlink(parent, newname, oldpath) {
                                var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
                                node.link = oldpath;
                                return node
                            },
                            readlink(node) {
                                if (!FS.isLink(node.mode)) {
                                    throw new FS.ErrnoError(28)
                                }
                                return node.link
                            }
                        },
                        stream_ops: {
                            read(stream, buffer, offset, length, position) {
                                var contents = stream.node.contents;
                                if (position >= stream.node.usedBytes)
                                    return 0;
                                var size = Math.min(stream.node.usedBytes - position, length);
                                if (size > 8 && contents.subarray) {
                                    buffer.set(contents.subarray(position, position + size), offset)
                                } else {
                                    for (var i = 0; i < size; i++)
                                        buffer[offset + i] = contents[position + i]
                                }
                                return size
                            },
                            write(stream, buffer, offset, length, position, canOwn) {
                                if (buffer.buffer === HEAP8.buffer) {
                                    canOwn = false
                                }
                                if (!length)
                                    return 0;
                                var node = stream.node;
                                node.mtime = node.ctime = Date.now();
                                if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                                    if (canOwn) {
                                        node.contents = buffer.subarray(offset, offset + length);
                                        node.usedBytes = length;
                                        return length
                                    } else if (node.usedBytes === 0 && position === 0) {
                                        node.contents = buffer.slice(offset, offset + length);
                                        node.usedBytes = length;
                                        return length
                                    } else if (position + length <= node.usedBytes) {
                                        node.contents.set(buffer.subarray(offset, offset + length), position);
                                        return length
                                    }
                                }
                                MEMFS.expandFileStorage(node, position + length);
                                if (node.contents.subarray && buffer.subarray) {
                                    node.contents.set(buffer.subarray(offset, offset + length), position)
                                } else {
                                    for (var i = 0; i < length; i++) {
                                        node.contents[position + i] = buffer[offset + i]
                                    }
                                }
                                node.usedBytes = Math.max(node.usedBytes, position + length);
                                return length
                            },
                            llseek(stream, offset, whence) {
                                var position = offset;
                                if (whence === 1) {
                                    position += stream.position
                                } else if (whence === 2) {
                                    if (FS.isFile(stream.node.mode)) {
                                        position += stream.node.usedBytes
                                    }
                                }
                                if (position < 0) {
                                    throw new FS.ErrnoError(28)
                                }
                                return position
                            },
                            mmap(stream, length, position, prot, flags) {
                                if (!FS.isFile(stream.node.mode)) {
                                    throw new FS.ErrnoError(43)
                                }
                                var ptr;
                                var allocated;
                                var contents = stream.node.contents;
                                if (!(flags & 2) && contents && contents.buffer === HEAP8.buffer) {
                                    allocated = false;
                                    ptr = contents.byteOffset
                                } else {
                                    allocated = true;
                                    ptr = mmapAlloc(length);
                                    if (!ptr) {
                                        throw new FS.ErrnoError(48)
                                    }
                                    if (contents) {
                                        if (position > 0 || position + length < contents.length) {
                                            if (contents.subarray) {
                                                contents = contents.subarray(position, position + length)
                                            } else {
                                                contents = Array.prototype.slice.call(contents, position, position + length)
                                            }
                                        }
                                        HEAP8.set(contents, ptr)
                                    }
                                }
                                return {
                                    ptr,
                                    allocated
                                }
                            },
                            msync(stream, buffer, offset, length, mmapFlags) {
                                MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
                                return 0
                            }
                        }
                    };
                    var asyncLoad = async url=>{
                        var arrayBuffer = await readAsync(url);
                        return new Uint8Array(arrayBuffer)
                    }
                    ;
                    asyncLoad.isAsync = true;
                    var FS_createDataFile = (...args)=>FS.createDataFile(...args);
                    var preloadPlugins = [];
                    var FS_handledByPreloadPlugin = (byteArray,fullname,finish,onerror)=>{
                        if (typeof Browser != "undefined")
                            Browser.init();
                        var handled = false;
                        preloadPlugins.forEach(plugin=>{
                            if (handled)
                                return;
                            if (plugin["canHandle"](fullname)) {
                                plugin["handle"](byteArray, fullname, finish, onerror);
                                handled = true
                            }
                        }
                        );
                        return handled
                    }
                    ;
                    var FS_createPreloadedFile = (parent,name,url,canRead,canWrite,onload,onerror,dontCreateFile,canOwn,preFinish)=>{
                        var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
                        var dep = getUniqueRunDependency(`cp ${fullname}`);
                        function processData(byteArray) {
                            function finish(byteArray) {
                                preFinish?.();
                                if (!dontCreateFile) {
                                    FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn)
                                }
                                onload?.();
                                removeRunDependency(dep)
                            }
                            if (FS_handledByPreloadPlugin(byteArray, fullname, finish, ()=>{
                                onerror?.();
                                removeRunDependency(dep)
                            }
                            )) {
                                return
                            }
                            finish(byteArray)
                        }
                        addRunDependency(dep);
                        if (typeof url == "string") {
                            asyncLoad(url).then(processData, onerror)
                        } else {
                            processData(url)
                        }
                    }
                    ;
                    var FS_modeStringToFlags = str=>{
                        var flagModes = {
                            r: 0,
                            "r+": 2,
                            w: 512 | 64 | 1,
                            "w+": 512 | 64 | 2,
                            a: 1024 | 64 | 1,
                            "a+": 1024 | 64 | 2
                        };
                        var flags = flagModes[str];
                        if (typeof flags == "undefined") {
                            throw new Error(`Unknown file open mode: ${str}`)
                        }
                        return flags
                    }
                    ;
                    var FS_getMode = (canRead,canWrite)=>{
                        var mode = 0;
                        if (canRead)
                            mode |= 292 | 73;
                        if (canWrite)
                            mode |= 146;
                        return mode
                    }
                    ;
                    var IDBFS = {
                        dbs: {},
                        indexedDB: ()=>{
                            if (typeof indexedDB != "undefined")
                                return indexedDB;
                            var ret = null;
                            if (typeof window == "object")
                                ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
                            return ret
                        }
                        ,
                        DB_VERSION: 21,
                        DB_STORE_NAME: "FILE_DATA",
                        queuePersist: mount=>{
                            function onPersistComplete() {
                                if (mount.idbPersistState === "again")
                                    startPersist();
                                else
                                    mount.idbPersistState = 0
                            }
                            function startPersist() {
                                mount.idbPersistState = "idb";
                                IDBFS.syncfs(mount, false, onPersistComplete)
                            }
                            if (!mount.idbPersistState) {
                                mount.idbPersistState = setTimeout(startPersist, 0)
                            } else if (mount.idbPersistState === "idb") {
                                mount.idbPersistState = "again"
                            }
                        }
                        ,
                        mount: mount=>{
                            var mnt = MEMFS.mount(mount);
                            if (mount?.opts?.autoPersist) {
                                mnt.idbPersistState = 0;
                                var memfs_node_ops = mnt.node_ops;
                                mnt.node_ops = {
                                    ...mnt.node_ops
                                };
                                mnt.node_ops.mknod = (parent,name,mode,dev)=>{
                                    var node = memfs_node_ops.mknod(parent, name, mode, dev);
                                    node.node_ops = mnt.node_ops;
                                    node.idbfs_mount = mnt.mount;
                                    node.memfs_stream_ops = node.stream_ops;
                                    node.stream_ops = {
                                        ...node.stream_ops
                                    };
                                    node.stream_ops.write = (stream,buffer,offset,length,position,canOwn)=>{
                                        stream.node.isModified = true;
                                        return node.memfs_stream_ops.write(stream, buffer, offset, length, position, canOwn)
                                    }
                                    ;
                                    node.stream_ops.close = stream=>{
                                        var n = stream.node;
                                        if (n.isModified) {
                                            IDBFS.queuePersist(n.idbfs_mount);
                                            n.isModified = false
                                        }
                                        if (n.memfs_stream_ops.close)
                                            return n.memfs_stream_ops.close(stream)
                                    }
                                    ;
                                    return node
                                }
                                ;
                                mnt.node_ops.mkdir = (...args)=>(IDBFS.queuePersist(mnt.mount),
                                memfs_node_ops.mkdir(...args));
                                mnt.node_ops.rmdir = (...args)=>(IDBFS.queuePersist(mnt.mount),
                                memfs_node_ops.rmdir(...args));
                                mnt.node_ops.symlink = (...args)=>(IDBFS.queuePersist(mnt.mount),
                                memfs_node_ops.symlink(...args));
                                mnt.node_ops.unlink = (...args)=>(IDBFS.queuePersist(mnt.mount),
                                memfs_node_ops.unlink(...args));
                                mnt.node_ops.rename = (...args)=>(IDBFS.queuePersist(mnt.mount),
                                memfs_node_ops.rename(...args))
                            }
                            return mnt
                        }
                        ,
                        syncfs: (mount,populate,callback)=>{
                            IDBFS.getLocalSet(mount, (err,local)=>{
                                if (err)
                                    return callback(err);
                                IDBFS.getRemoteSet(mount, (err,remote)=>{
                                    if (err)
                                        return callback(err);
                                    var src = populate ? remote : local;
                                    var dst = populate ? local : remote;
                                    IDBFS.reconcile(src, dst, callback)
                                }
                                )
                            }
                            )
                        }
                        ,
                        quit: ()=>{
                            Object.values(IDBFS.dbs).forEach(value=>value.close());
                            IDBFS.dbs = {}
                        }
                        ,
                        getDB: (name,callback)=>{
                            var db = IDBFS.dbs[name];
                            if (db) {
                                return callback(null, db)
                            }
                            var req;
                            try {
                                req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION)
                            } catch (e) {
                                return callback(e)
                            }
                            if (!req) {
                                return callback("Unable to connect to IndexedDB")
                            }
                            req.onupgradeneeded = e=>{
                                var db = e.target.result;
                                var transaction = e.target.transaction;
                                var fileStore;
                                if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
                                    fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME)
                                } else {
                                    fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME)
                                }
                                if (!fileStore.indexNames.contains("timestamp")) {
                                    fileStore.createIndex("timestamp", "timestamp", {
                                        unique: false
                                    })
                                }
                            }
                            ;
                            req.onsuccess = ()=>{
                                db = req.result;
                                IDBFS.dbs[name] = db;
                                callback(null, db)
                            }
                            ;
                            req.onerror = e=>{
                                callback(e.target.error);
                                e.preventDefault()
                            }
                        }
                        ,
                        getLocalSet: (mount,callback)=>{
                            var entries = {};
                            function isRealDir(p) {
                                return p !== "." && p !== ".."
                            }
                            function toAbsolute(root) {
                                return p=>PATH.join2(root, p)
                            }
                            var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
                            while (check.length) {
                                var path = check.pop();
                                var stat;
                                try {
                                    stat = FS.stat(path)
                                } catch (e) {
                                    return callback(e)
                                }
                                if (FS.isDir(stat.mode)) {
                                    check.push(...FS.readdir(path).filter(isRealDir).map(toAbsolute(path)))
                                }
                                entries[path] = {
                                    timestamp: stat.mtime
                                }
                            }
                            return callback(null, {
                                type: "local",
                                entries
                            })
                        }
                        ,
                        getRemoteSet: (mount,callback)=>{
                            var entries = {};
                            IDBFS.getDB(mount.mountpoint, (err,db)=>{
                                if (err)
                                    return callback(err);
                                try {
                                    var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readonly");
                                    transaction.onerror = e=>{
                                        callback(e.target.error);
                                        e.preventDefault()
                                    }
                                    ;
                                    var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
                                    var index = store.index("timestamp");
                                    index.openKeyCursor().onsuccess = event=>{
                                        var cursor = event.target.result;
                                        if (!cursor) {
                                            return callback(null, {
                                                type: "remote",
                                                db,
                                                entries
                                            })
                                        }
                                        entries[cursor.primaryKey] = {
                                            timestamp: cursor.key
                                        };
                                        cursor.continue()
                                    }
                                } catch (e) {
                                    return callback(e)
                                }
                            }
                            )
                        }
                        ,
                        loadLocalEntry: (path,callback)=>{
                            var stat, node;
                            try {
                                var lookup = FS.lookupPath(path);
                                node = lookup.node;
                                stat = FS.stat(path)
                            } catch (e) {
                                return callback(e)
                            }
                            if (FS.isDir(stat.mode)) {
                                return callback(null, {
                                    timestamp: stat.mtime,
                                    mode: stat.mode
                                })
                            } else if (FS.isFile(stat.mode)) {
                                node.contents = MEMFS.getFileDataAsTypedArray(node);
                                return callback(null, {
                                    timestamp: stat.mtime,
                                    mode: stat.mode,
                                    contents: node.contents
                                })
                            } else {
                                return callback(new Error("node type not supported"))
                            }
                        }
                        ,
                        storeLocalEntry: (path,entry,callback)=>{
                            try {
                                if (FS.isDir(entry["mode"])) {
                                    FS.mkdirTree(path, entry["mode"])
                                } else if (FS.isFile(entry["mode"])) {
                                    FS.writeFile(path, entry["contents"], {
                                        canOwn: true
                                    })
                                } else {
                                    return callback(new Error("node type not supported"))
                                }
                                FS.chmod(path, entry["mode"]);
                                FS.utime(path, entry["timestamp"], entry["timestamp"])
                            } catch (e) {
                                return callback(e)
                            }
                            callback(null)
                        }
                        ,
                        removeLocalEntry: (path,callback)=>{
                            try {
                                var stat = FS.stat(path);
                                if (FS.isDir(stat.mode)) {
                                    FS.rmdir(path)
                                } else if (FS.isFile(stat.mode)) {
                                    FS.unlink(path)
                                }
                            } catch (e) {
                                return callback(e)
                            }
                            callback(null)
                        }
                        ,
                        loadRemoteEntry: (store,path,callback)=>{
                            var req = store.get(path);
                            req.onsuccess = event=>callback(null, event.target.result);
                            req.onerror = e=>{
                                callback(e.target.error);
                                e.preventDefault()
                            }
                        }
                        ,
                        storeRemoteEntry: (store,path,entry,callback)=>{
                            try {
                                var req = store.put(entry, path)
                            } catch (e) {
                                callback(e);
                                return
                            }
                            req.onsuccess = event=>callback();
                            req.onerror = e=>{
                                callback(e.target.error);
                                e.preventDefault()
                            }
                        }
                        ,
                        removeRemoteEntry: (store,path,callback)=>{
                            var req = store.delete(path);
                            req.onsuccess = event=>callback();
                            req.onerror = e=>{
                                callback(e.target.error);
                                e.preventDefault()
                            }
                        }
                        ,
                        reconcile: (src,dst,callback)=>{
                            var total = 0;
                            var create = [];
                            Object.keys(src.entries).forEach(key=>{
                                var e = src.entries[key];
                                var e2 = dst.entries[key];
                                if (!e2 || e["timestamp"].getTime() != e2["timestamp"].getTime()) {
                                    create.push(key);
                                    total++
                                }
                            }
                            );
                            var remove = [];
                            Object.keys(dst.entries).forEach(key=>{
                                if (!src.entries[key]) {
                                    remove.push(key);
                                    total++
                                }
                            }
                            );
                            if (!total) {
                                return callback(null)
                            }
                            var errored = false;
                            var db = src.type === "remote" ? src.db : dst.db;
                            var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readwrite");
                            var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
                            function done(err) {
                                if (err && !errored) {
                                    errored = true;
                                    return callback(err)
                                }
                            }
                            transaction.onerror = transaction.onabort = e=>{
                                done(e.target.error);
                                e.preventDefault()
                            }
                            ;
                            transaction.oncomplete = e=>{
                                if (!errored) {
                                    callback(null)
                                }
                            }
                            ;
                            create.sort().forEach(path=>{
                                if (dst.type === "local") {
                                    IDBFS.loadRemoteEntry(store, path, (err,entry)=>{
                                        if (err)
                                            return done(err);
                                        IDBFS.storeLocalEntry(path, entry, done)
                                    }
                                    )
                                } else {
                                    IDBFS.loadLocalEntry(path, (err,entry)=>{
                                        if (err)
                                            return done(err);
                                        IDBFS.storeRemoteEntry(store, path, entry, done)
                                    }
                                    )
                                }
                            }
                            );
                            remove.sort().reverse().forEach(path=>{
                                if (dst.type === "local") {
                                    IDBFS.removeLocalEntry(path, done)
                                } else {
                                    IDBFS.removeRemoteEntry(store, path, done)
                                }
                            }
                            )
                        }
                    };
                    var FS = {
                        root: null,
                        mounts: [],
                        devices: {},
                        streams: [],
                        nextInode: 1,
                        nameTable: null,
                        currentPath: "/",
                        initialized: false,
                        ignorePermissions: true,
                        filesystems: null,
                        syncFSRequests: 0,
                        readFiles: {},
                        ErrnoError: class {
                            name = "ErrnoError";
                            constructor(errno) {
                                this.errno = errno
                            }
                        }
                        ,
                        FSStream: class {
                            shared = {};
                            get object() {
                                return this.node
                            }
                            set object(val) {
                                this.node = val
                            }
                            get isRead() {
                                return (this.flags & 2097155) !== 1
                            }
                            get isWrite() {
                                return (this.flags & 2097155) !== 0
                            }
                            get isAppend() {
                                return this.flags & 1024
                            }
                            get flags() {
                                return this.shared.flags
                            }
                            set flags(val) {
                                this.shared.flags = val
                            }
                            get position() {
                                return this.shared.position
                            }
                            set position(val) {
                                this.shared.position = val
                            }
                        }
                        ,
                        FSNode: class {
                            node_ops = {};
                            stream_ops = {};
                            readMode = 292 | 73;
                            writeMode = 146;
                            mounted = null;
                            constructor(parent, name, mode, rdev) {
                                if (!parent) {
                                    parent = this
                                }
                                this.parent = parent;
                                this.mount = parent.mount;
                                this.id = FS.nextInode++;
                                this.name = name;
                                this.mode = mode;
                                this.rdev = rdev;
                                this.atime = this.mtime = this.ctime = Date.now()
                            }
                            get read() {
                                return (this.mode & this.readMode) === this.readMode
                            }
                            set read(val) {
                                val ? this.mode |= this.readMode : this.mode &= ~this.readMode
                            }
                            get write() {
                                return (this.mode & this.writeMode) === this.writeMode
                            }
                            set write(val) {
                                val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode
                            }
                            get isFolder() {
                                return FS.isDir(this.mode)
                            }
                            get isDevice() {
                                return FS.isChrdev(this.mode)
                            }
                        }
                        ,
                        lookupPath(path, opts={}) {
                            if (!path) {
                                throw new FS.ErrnoError(44)
                            }
                            opts.follow_mount ??= true;
                            if (!PATH.isAbs(path)) {
                                path = FS.cwd() + "/" + path
                            }
                            linkloop: for (var nlinks = 0; nlinks < 40; nlinks++) {
                                var parts = path.split("/").filter(p=>!!p);
                                var current = FS.root;
                                var current_path = "/";
                                for (var i = 0; i < parts.length; i++) {
                                    var islast = i === parts.length - 1;
                                    if (islast && opts.parent) {
                                        break
                                    }
                                    if (parts[i] === ".") {
                                        continue
                                    }
                                    if (parts[i] === "..") {
                                        current_path = PATH.dirname(current_path);
                                        if (FS.isRoot(current)) {
                                            path = current_path + "/" + parts.slice(i + 1).join("/");
                                            continue linkloop
                                        } else {
                                            current = current.parent
                                        }
                                        continue
                                    }
                                    current_path = PATH.join2(current_path, parts[i]);
                                    try {
                                        current = FS.lookupNode(current, parts[i])
                                    } catch (e) {
                                        if (e?.errno === 44 && islast && opts.noent_okay) {
                                            return {
                                                path: current_path
                                            }
                                        }
                                        throw e
                                    }
                                    if (FS.isMountpoint(current) && (!islast || opts.follow_mount)) {
                                        current = current.mounted.root
                                    }
                                    if (FS.isLink(current.mode) && (!islast || opts.follow)) {
                                        if (!current.node_ops.readlink) {
                                            throw new FS.ErrnoError(52)
                                        }
                                        var link = current.node_ops.readlink(current);
                                        if (!PATH.isAbs(link)) {
                                            link = PATH.dirname(current_path) + "/" + link
                                        }
                                        path = link + "/" + parts.slice(i + 1).join("/");
                                        continue linkloop
                                    }
                                }
                                return {
                                    path: current_path,
                                    node: current
                                }
                            }
                            throw new FS.ErrnoError(32)
                        },
                        getPath(node) {
                            var path;
                            while (true) {
                                if (FS.isRoot(node)) {
                                    var mount = node.mount.mountpoint;
                                    if (!path)
                                        return mount;
                                    return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path
                                }
                                path = path ? `${node.name}/${path}` : node.name;
                                node = node.parent
                            }
                        },
                        hashName(parentid, name) {
                            var hash = 0;
                            for (var i = 0; i < name.length; i++) {
                                hash = (hash << 5) - hash + name.charCodeAt(i) | 0
                            }
                            return (parentid + hash >>> 0) % FS.nameTable.length
                        },
                        hashAddNode(node) {
                            var hash = FS.hashName(node.parent.id, node.name);
                            node.name_next = FS.nameTable[hash];
                            FS.nameTable[hash] = node
                        },
                        hashRemoveNode(node) {
                            var hash = FS.hashName(node.parent.id, node.name);
                            if (FS.nameTable[hash] === node) {
                                FS.nameTable[hash] = node.name_next
                            } else {
                                var current = FS.nameTable[hash];
                                while (current) {
                                    if (current.name_next === node) {
                                        current.name_next = node.name_next;
                                        break
                                    }
                                    current = current.name_next
                                }
                            }
                        },
                        lookupNode(parent, name) {
                            var errCode = FS.mayLookup(parent);
                            if (errCode) {
                                throw new FS.ErrnoError(errCode)
                            }
                            var hash = FS.hashName(parent.id, name);
                            for (var node = FS.nameTable[hash]; node; node = node.name_next) {
                                var nodeName = node.name;
                                if (node.parent.id === parent.id && nodeName === name) {
                                    return node
                                }
                            }
                            return FS.lookup(parent, name)
                        },
                        createNode(parent, name, mode, rdev) {
                            var node = new FS.FSNode(parent,name,mode,rdev);
                            FS.hashAddNode(node);
                            return node
                        },
                        destroyNode(node) {
                            FS.hashRemoveNode(node)
                        },
                        isRoot(node) {
                            return node === node.parent
                        },
                        isMountpoint(node) {
                            return !!node.mounted
                        },
                        isFile(mode) {
                            return (mode & 61440) === 32768
                        },
                        isDir(mode) {
                            return (mode & 61440) === 16384
                        },
                        isLink(mode) {
                            return (mode & 61440) === 40960
                        },
                        isChrdev(mode) {
                            return (mode & 61440) === 8192
                        },
                        isBlkdev(mode) {
                            return (mode & 61440) === 24576
                        },
                        isFIFO(mode) {
                            return (mode & 61440) === 4096
                        },
                        isSocket(mode) {
                            return (mode & 49152) === 49152
                        },
                        flagsToPermissionString(flag) {
                            var perms = ["r", "w", "rw"][flag & 3];
                            if (flag & 512) {
                                perms += "w"
                            }
                            return perms
                        },
                        nodePermissions(node, perms) {
                            if (FS.ignorePermissions) {
                                return 0
                            }
                            if (perms.includes("r") && !(node.mode & 292)) {
                                return 2
                            } else if (perms.includes("w") && !(node.mode & 146)) {
                                return 2
                            } else if (perms.includes("x") && !(node.mode & 73)) {
                                return 2
                            }
                            return 0
                        },
                        mayLookup(dir) {
                            if (!FS.isDir(dir.mode))
                                return 54;
                            var errCode = FS.nodePermissions(dir, "x");
                            if (errCode)
                                return errCode;
                            if (!dir.node_ops.lookup)
                                return 2;
                            return 0
                        },
                        mayCreate(dir, name) {
                            if (!FS.isDir(dir.mode)) {
                                return 54
                            }
                            try {
                                var node = FS.lookupNode(dir, name);
                                return 20
                            } catch (e) {}
                            return FS.nodePermissions(dir, "wx")
                        },
                        mayDelete(dir, name, isdir) {
                            var node;
                            try {
                                node = FS.lookupNode(dir, name)
                            } catch (e) {
                                return e.errno
                            }
                            var errCode = FS.nodePermissions(dir, "wx");
                            if (errCode) {
                                return errCode
                            }
                            if (isdir) {
                                if (!FS.isDir(node.mode)) {
                                    return 54
                                }
                                if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                                    return 10
                                }
                            } else {
                                if (FS.isDir(node.mode)) {
                                    return 31
                                }
                            }
                            return 0
                        },
                        mayOpen(node, flags) {
                            if (!node) {
                                return 44
                            }
                            if (FS.isLink(node.mode)) {
                                return 32
                            } else if (FS.isDir(node.mode)) {
                                if (FS.flagsToPermissionString(flags) !== "r" || flags & (512 | 64)) {
                                    return 31
                                }
                            }
                            return FS.nodePermissions(node, FS.flagsToPermissionString(flags))
                        },
                        checkOpExists(op, err) {
                            if (!op) {
                                throw new FS.ErrnoError(err)
                            }
                            return op
                        },
                        MAX_OPEN_FDS: 4096,
                        nextfd() {
                            for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
                                if (!FS.streams[fd]) {
                                    return fd
                                }
                            }
                            throw new FS.ErrnoError(33)
                        },
                        getStreamChecked(fd) {
                            var stream = FS.getStream(fd);
                            if (!stream) {
                                throw new FS.ErrnoError(8)
                            }
                            return stream
                        },
                        getStream: fd=>FS.streams[fd],
                        createStream(stream, fd=-1) {
                            stream = Object.assign(new FS.FSStream, stream);
                            if (fd == -1) {
                                fd = FS.nextfd()
                            }
                            stream.fd = fd;
                            FS.streams[fd] = stream;
                            return stream
                        },
                        closeStream(fd) {
                            FS.streams[fd] = null
                        },
                        dupStream(origStream, fd=-1) {
                            var stream = FS.createStream(origStream, fd);
                            stream.stream_ops?.dup?.(stream);
                            return stream
                        },
                        doSetAttr(stream, node, attr) {
                            var setattr = stream?.stream_ops.setattr;
                            var arg = setattr ? stream : node;
                            setattr ??= node.node_ops.setattr;
                            FS.checkOpExists(setattr, 63);
                            setattr(arg, attr)
                        },
                        chrdev_stream_ops: {
                            open(stream) {
                                var device = FS.getDevice(stream.node.rdev);
                                stream.stream_ops = device.stream_ops;
                                stream.stream_ops.open?.(stream)
                            },
                            llseek() {
                                throw new FS.ErrnoError(70)
                            }
                        },
                        major: dev=>dev >> 8,
                        minor: dev=>dev & 255,
                        makedev: (ma,mi)=>ma << 8 | mi,
                        registerDevice(dev, ops) {
                            FS.devices[dev] = {
                                stream_ops: ops
                            }
                        },
                        getDevice: dev=>FS.devices[dev],
                        getMounts(mount) {
                            var mounts = [];
                            var check = [mount];
                            while (check.length) {
                                var m = check.pop();
                                mounts.push(m);
                                check.push(...m.mounts)
                            }
                            return mounts
                        },
                        syncfs(populate, callback) {
                            if (typeof populate == "function") {
                                callback = populate;
                                populate = false
                            }
                            FS.syncFSRequests++;
                            if (FS.syncFSRequests > 1) {
                                err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`)
                            }
                            var mounts = FS.getMounts(FS.root.mount);
                            var completed = 0;
                            function doCallback(errCode) {
                                FS.syncFSRequests--;
                                return callback(errCode)
                            }
                            function done(errCode) {
                                if (errCode) {
                                    if (!done.errored) {
                                        done.errored = true;
                                        return doCallback(errCode)
                                    }
                                    return
                                }
                                if (++completed >= mounts.length) {
                                    doCallback(null)
                                }
                            }
                            mounts.forEach(mount=>{
                                if (!mount.type.syncfs) {
                                    return done(null)
                                }
                                mount.type.syncfs(mount, populate, done)
                            }
                            )
                        },
                        mount(type, opts, mountpoint) {
                            var root = mountpoint === "/";
                            var pseudo = !mountpoint;
                            var node;
                            if (root && FS.root) {
                                throw new FS.ErrnoError(10)
                            } else if (!root && !pseudo) {
                                var lookup = FS.lookupPath(mountpoint, {
                                    follow_mount: false
                                });
                                mountpoint = lookup.path;
                                node = lookup.node;
                                if (FS.isMountpoint(node)) {
                                    throw new FS.ErrnoError(10)
                                }
                                if (!FS.isDir(node.mode)) {
                                    throw new FS.ErrnoError(54)
                                }
                            }
                            var mount = {
                                type,
                                opts,
                                mountpoint,
                                mounts: []
                            };
                            var mountRoot = type.mount(mount);
                            mountRoot.mount = mount;
                            mount.root = mountRoot;
                            if (root) {
                                FS.root = mountRoot
                            } else if (node) {
                                node.mounted = mount;
                                if (node.mount) {
                                    node.mount.mounts.push(mount)
                                }
                            }
                            return mountRoot
                        },
                        unmount(mountpoint) {
                            var lookup = FS.lookupPath(mountpoint, {
                                follow_mount: false
                            });
                            if (!FS.isMountpoint(lookup.node)) {
                                throw new FS.ErrnoError(28)
                            }
                            var node = lookup.node;
                            var mount = node.mounted;
                            var mounts = FS.getMounts(mount);
                            Object.keys(FS.nameTable).forEach(hash=>{
                                var current = FS.nameTable[hash];
                                while (current) {
                                    var next = current.name_next;
                                    if (mounts.includes(current.mount)) {
                                        FS.destroyNode(current)
                                    }
                                    current = next
                                }
                            }
                            );
                            node.mounted = null;
                            var idx = node.mount.mounts.indexOf(mount);
                            node.mount.mounts.splice(idx, 1)
                        },
                        lookup(parent, name) {
                            return parent.node_ops.lookup(parent, name)
                        },
                        mknod(path, mode, dev) {
                            var lookup = FS.lookupPath(path, {
                                parent: true
                            });
                            var parent = lookup.node;
                            var name = PATH.basename(path);
                            if (!name) {
                                throw new FS.ErrnoError(28)
                            }
                            if (name === "." || name === "..") {
                                throw new FS.ErrnoError(20)
                            }
                            var errCode = FS.mayCreate(parent, name);
                            if (errCode) {
                                throw new FS.ErrnoError(errCode)
                            }
                            if (!parent.node_ops.mknod) {
                                throw new FS.ErrnoError(63)
                            }
                            return parent.node_ops.mknod(parent, name, mode, dev)
                        },
                        statfs(path) {
                            return FS.statfsNode(FS.lookupPath(path, {
                                follow: true
                            }).node)
                        },
                        statfsStream(stream) {
                            return FS.statfsNode(stream.node)
                        },
                        statfsNode(node) {
                            var rtn = {
                                bsize: 4096,
                                frsize: 4096,
                                blocks: 1e6,
                                bfree: 5e5,
                                bavail: 5e5,
                                files: FS.nextInode,
                                ffree: FS.nextInode - 1,
                                fsid: 42,
                                flags: 2,
                                namelen: 255
                            };
                            if (node.node_ops.statfs) {
                                Object.assign(rtn, node.node_ops.statfs(node.mount.opts.root))
                            }
                            return rtn
                        },
                        create(path, mode=438) {
                            mode &= 4095;
                            mode |= 32768;
                            return FS.mknod(path, mode, 0)
                        },
                        mkdir(path, mode=511) {
                            mode &= 511 | 512;
                            mode |= 16384;
                            return FS.mknod(path, mode, 0)
                        },
                        mkdirTree(path, mode) {
                            var dirs = path.split("/");
                            var d = "";
                            for (var dir of dirs) {
                                if (!dir)
                                    continue;
                                if (d || PATH.isAbs(path))
                                    d += "/";
                                d += dir;
                                try {
                                    FS.mkdir(d, mode)
                                } catch (e) {
                                    if (e.errno != 20)
                                        throw e
                                }
                            }
                        },
                        mkdev(path, mode, dev) {
                            if (typeof dev == "undefined") {
                                dev = mode;
                                mode = 438
                            }
                            mode |= 8192;
                            return FS.mknod(path, mode, dev)
                        },
                        symlink(oldpath, newpath) {
                            if (!PATH_FS.resolve(oldpath)) {
                                throw new FS.ErrnoError(44)
                            }
                            var lookup = FS.lookupPath(newpath, {
                                parent: true
                            });
                            var parent = lookup.node;
                            if (!parent) {
                                throw new FS.ErrnoError(44)
                            }
                            var newname = PATH.basename(newpath);
                            var errCode = FS.mayCreate(parent, newname);
                            if (errCode) {
                                throw new FS.ErrnoError(errCode)
                            }
                            if (!parent.node_ops.symlink) {
                                throw new FS.ErrnoError(63)
                            }
                            return parent.node_ops.symlink(parent, newname, oldpath)
                        },
                        rename(old_path, new_path) {
                            var old_dirname = PATH.dirname(old_path);
                            var new_dirname = PATH.dirname(new_path);
                            var old_name = PATH.basename(old_path);
                            var new_name = PATH.basename(new_path);
                            var lookup, old_dir, new_dir;
                            lookup = FS.lookupPath(old_path, {
                                parent: true
                            });
                            old_dir = lookup.node;
                            lookup = FS.lookupPath(new_path, {
                                parent: true
                            });
                            new_dir = lookup.node;
                            if (!old_dir || !new_dir)
                                throw new FS.ErrnoError(44);
                            if (old_dir.mount !== new_dir.mount) {
                                throw new FS.ErrnoError(75)
                            }
                            var old_node = FS.lookupNode(old_dir, old_name);
                            var relative = PATH_FS.relative(old_path, new_dirname);
                            if (relative.charAt(0) !== ".") {
                                throw new FS.ErrnoError(28)
                            }
                            relative = PATH_FS.relative(new_path, old_dirname);
                            if (relative.charAt(0) !== ".") {
                                throw new FS.ErrnoError(55)
                            }
                            var new_node;
                            try {
                                new_node = FS.lookupNode(new_dir, new_name)
                            } catch (e) {}
                            if (old_node === new_node) {
                                return
                            }
                            var isdir = FS.isDir(old_node.mode);
                            var errCode = FS.mayDelete(old_dir, old_name, isdir);
                            if (errCode) {
                                throw new FS.ErrnoError(errCode)
                            }
                            errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
                            if (errCode) {
                                throw new FS.ErrnoError(errCode)
                            }
                            if (!old_dir.node_ops.rename) {
                                throw new FS.ErrnoError(63)
                            }
                            if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
                                throw new FS.ErrnoError(10)
                            }
                            if (new_dir !== old_dir) {
                                errCode = FS.nodePermissions(old_dir, "w");
                                if (errCode) {
                                    throw new FS.ErrnoError(errCode)
                                }
                            }
                            FS.hashRemoveNode(old_node);
                            try {
                                old_dir.node_ops.rename(old_node, new_dir, new_name);
                                old_node.parent = new_dir
                            } catch (e) {
                                throw e
                            } finally {
                                FS.hashAddNode(old_node)
                            }
                        },
                        rmdir(path) {
                            var lookup = FS.lookupPath(path, {
                                parent: true
                            });
                            var parent = lookup.node;
                            var name = PATH.basename(path);
                            var node = FS.lookupNode(parent, name);
                            var errCode = FS.mayDelete(parent, name, true);
                            if (errCode) {
                                throw new FS.ErrnoError(errCode)
                            }
                            if (!parent.node_ops.rmdir) {
                                throw new FS.ErrnoError(63)
                            }
                            if (FS.isMountpoint(node)) {
                                throw new FS.ErrnoError(10)
                            }
                            parent.node_ops.rmdir(parent, name);
                            FS.destroyNode(node)
                        },
                        readdir(path) {
                            var lookup = FS.lookupPath(path, {
                                follow: true
                            });
                            var node = lookup.node;
                            var readdir = FS.checkOpExists(node.node_ops.readdir, 54);
                            return readdir(node)
                        },
                        unlink(path) {
                            var lookup = FS.lookupPath(path, {
                                parent: true
                            });
                            var parent = lookup.node;
                            if (!parent) {
                                throw new FS.ErrnoError(44)
                            }
                            var name = PATH.basename(path);
                            var node = FS.lookupNode(parent, name);
                            var errCode = FS.mayDelete(parent, name, false);
                            if (errCode) {
                                throw new FS.ErrnoError(errCode)
                            }
                            if (!parent.node_ops.unlink) {
                                throw new FS.ErrnoError(63)
                            }
                            if (FS.isMountpoint(node)) {
                                throw new FS.ErrnoError(10)
                            }
                            parent.node_ops.unlink(parent, name);
                            FS.destroyNode(node)
                        },
                        readlink(path) {
                            var lookup = FS.lookupPath(path);
                            var link = lookup.node;
                            if (!link) {
                                throw new FS.ErrnoError(44)
                            }
                            if (!link.node_ops.readlink) {
                                throw new FS.ErrnoError(28)
                            }
                            return link.node_ops.readlink(link)
                        },
                        stat(path, dontFollow) {
                            var lookup = FS.lookupPath(path, {
                                follow: !dontFollow
                            });
                            var node = lookup.node;
                            var getattr = FS.checkOpExists(node.node_ops.getattr, 63);
                            return getattr(node)
                        },
                        fstat(fd) {
                            var stream = FS.getStreamChecked(fd);
                            var node = stream.node;
                            var getattr = stream.stream_ops.getattr;
                            var arg = getattr ? stream : node;
                            getattr ??= node.node_ops.getattr;
                            FS.checkOpExists(getattr, 63);
                            return getattr(arg)
                        },
                        lstat(path) {
                            return FS.stat(path, true)
                        },
                        doChmod(stream, node, mode, dontFollow) {
                            FS.doSetAttr(stream, node, {
                                mode: mode & 4095 | node.mode & ~4095,
                                ctime: Date.now(),
                                dontFollow
                            })
                        },
                        chmod(path, mode, dontFollow) {
                            var node;
                            if (typeof path == "string") {
                                var lookup = FS.lookupPath(path, {
                                    follow: !dontFollow
                                });
                                node = lookup.node
                            } else {
                                node = path
                            }
                            FS.doChmod(null, node, mode, dontFollow)
                        },
                        lchmod(path, mode) {
                            FS.chmod(path, mode, true)
                        },
                        fchmod(fd, mode) {
                            var stream = FS.getStreamChecked(fd);
                            FS.doChmod(stream, stream.node, mode, false)
                        },
                        doChown(stream, node, dontFollow) {
                            FS.doSetAttr(stream, node, {
                                timestamp: Date.now(),
                                dontFollow
                            })
                        },
                        chown(path, uid, gid, dontFollow) {
                            var node;
                            if (typeof path == "string") {
                                var lookup = FS.lookupPath(path, {
                                    follow: !dontFollow
                                });
                                node = lookup.node
                            } else {
                                node = path
                            }
                            FS.doChown(null, node, dontFollow)
                        },
                        lchown(path, uid, gid) {
                            FS.chown(path, uid, gid, true)
                        },
                        fchown(fd, uid, gid) {
                            var stream = FS.getStreamChecked(fd);
                            FS.doChown(stream, stream.node, false)
                        },
                        doTruncate(stream, node, len) {
                            if (FS.isDir(node.mode)) {
                                throw new FS.ErrnoError(31)
                            }
                            if (!FS.isFile(node.mode)) {
                                throw new FS.ErrnoError(28)
                            }
                            var errCode = FS.nodePermissions(node, "w");
                            if (errCode) {
                                throw new FS.ErrnoError(errCode)
                            }
                            FS.doSetAttr(stream, node, {
                                size: len,
                                timestamp: Date.now()
                            })
                        },
                        truncate(path, len) {
                            if (len < 0) {
                                throw new FS.ErrnoError(28)
                            }
                            var node;
                            if (typeof path == "string") {
                                var lookup = FS.lookupPath(path, {
                                    follow: true
                                });
                                node = lookup.node
                            } else {
                                node = path
                            }
                            FS.doTruncate(null, node, len)
                        },
                        ftruncate(fd, len) {
                            var stream = FS.getStreamChecked(fd);
                            if (len < 0 || (stream.flags & 2097155) === 0) {
                                throw new FS.ErrnoError(28)
                            }
                            FS.doTruncate(stream, stream.node, len)
                        },
                        utime(path, atime, mtime) {
                            var lookup = FS.lookupPath(path, {
                                follow: true
                            });
                            var node = lookup.node;
                            var setattr = FS.checkOpExists(node.node_ops.setattr, 63);
                            setattr(node, {
                                atime,
                                mtime
                            })
                        },
                        open(path, flags, mode=438) {
                            if (path === "") {
                                throw new FS.ErrnoError(44)
                            }
                            flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
                            if (flags & 64) {
                                mode = mode & 4095 | 32768
                            } else {
                                mode = 0
                            }
                            var node;
                            var isDirPath;
                            if (typeof path == "object") {
                                node = path
                            } else {
                                isDirPath = path.endsWith("/");
                                var lookup = FS.lookupPath(path, {
                                    follow: !(flags & 131072),
                                    noent_okay: true
                                });
                                node = lookup.node;
                                path = lookup.path
                            }
                            var created = false;
                            if (flags & 64) {
                                if (node) {
                                    if (flags & 128) {
                                        throw new FS.ErrnoError(20)
                                    }
                                } else if (isDirPath) {
                                    throw new FS.ErrnoError(31)
                                } else {
                                    node = FS.mknod(path, mode | 511, 0);
                                    created = true
                                }
                            }
                            if (!node) {
                                throw new FS.ErrnoError(44)
                            }
                            if (FS.isChrdev(node.mode)) {
                                flags &= ~512
                            }
                            if (flags & 65536 && !FS.isDir(node.mode)) {
                                throw new FS.ErrnoError(54)
                            }
                            if (!created) {
                                var errCode = FS.mayOpen(node, flags);
                                if (errCode) {
                                    throw new FS.ErrnoError(errCode)
                                }
                            }
                            if (flags & 512 && !created) {
                                FS.truncate(node, 0)
                            }
                            flags &= ~(128 | 512 | 131072);
                            var stream = FS.createStream({
                                node,
                                path: FS.getPath(node),
                                flags,
                                seekable: true,
                                position: 0,
                                stream_ops: node.stream_ops,
                                ungotten: [],
                                error: false
                            });
                            if (stream.stream_ops.open) {
                                stream.stream_ops.open(stream)
                            }
                            if (created) {
                                FS.chmod(node, mode & 511)
                            }
                            if (Module["logReadFiles"] && !(flags & 1)) {
                                if (!(path in FS.readFiles)) {
                                    FS.readFiles[path] = 1
                                }
                            }
                            return stream
                        },
                        close(stream) {
                            if (FS.isClosed(stream)) {
                                throw new FS.ErrnoError(8)
                            }
                            if (stream.getdents)
                                stream.getdents = null;
                            try {
                                if (stream.stream_ops.close) {
                                    stream.stream_ops.close(stream)
                                }
                            } catch (e) {
                                throw e
                            } finally {
                                FS.closeStream(stream.fd)
                            }
                            stream.fd = null
                        },
                        isClosed(stream) {
                            return stream.fd === null
                        },
                        llseek(stream, offset, whence) {
                            if (FS.isClosed(stream)) {
                                throw new FS.ErrnoError(8)
                            }
                            if (!stream.seekable || !stream.stream_ops.llseek) {
                                throw new FS.ErrnoError(70)
                            }
                            if (whence != 0 && whence != 1 && whence != 2) {
                                throw new FS.ErrnoError(28)
                            }
                            stream.position = stream.stream_ops.llseek(stream, offset, whence);
                            stream.ungotten = [];
                            return stream.position
                        },
                        read(stream, buffer, offset, length, position) {
                            if (length < 0 || position < 0) {
                                throw new FS.ErrnoError(28)
                            }
                            if (FS.isClosed(stream)) {
                                throw new FS.ErrnoError(8)
                            }
                            if ((stream.flags & 2097155) === 1) {
                                throw new FS.ErrnoError(8)
                            }
                            if (FS.isDir(stream.node.mode)) {
                                throw new FS.ErrnoError(31)
                            }
                            if (!stream.stream_ops.read) {
                                throw new FS.ErrnoError(28)
                            }
                            var seeking = typeof position != "undefined";
                            if (!seeking) {
                                position = stream.position
                            } else if (!stream.seekable) {
                                throw new FS.ErrnoError(70)
                            }
                            var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
                            if (!seeking)
                                stream.position += bytesRead;
                            return bytesRead
                        },
                        write(stream, buffer, offset, length, position, canOwn) {
                            if (length < 0 || position < 0) {
                                throw new FS.ErrnoError(28)
                            }
                            if (FS.isClosed(stream)) {
                                throw new FS.ErrnoError(8)
                            }
                            if ((stream.flags & 2097155) === 0) {
                                throw new FS.ErrnoError(8)
                            }
                            if (FS.isDir(stream.node.mode)) {
                                throw new FS.ErrnoError(31)
                            }
                            if (!stream.stream_ops.write) {
                                throw new FS.ErrnoError(28)
                            }
                            if (stream.seekable && stream.flags & 1024) {
                                FS.llseek(stream, 0, 2)
                            }
                            var seeking = typeof position != "undefined";
                            if (!seeking) {
                                position = stream.position
                            } else if (!stream.seekable) {
                                throw new FS.ErrnoError(70)
                            }
                            var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
                            if (!seeking)
                                stream.position += bytesWritten;
                            return bytesWritten
                        },
                        mmap(stream, length, position, prot, flags) {
                            if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
                                throw new FS.ErrnoError(2)
                            }
                            if ((stream.flags & 2097155) === 1) {
                                throw new FS.ErrnoError(2)
                            }
                            if (!stream.stream_ops.mmap) {
                                throw new FS.ErrnoError(43)
                            }
                            if (!length) {
                                throw new FS.ErrnoError(28)
                            }
                            return stream.stream_ops.mmap(stream, length, position, prot, flags)
                        },
                        msync(stream, buffer, offset, length, mmapFlags) {
                            if (!stream.stream_ops.msync) {
                                return 0
                            }
                            return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags)
                        },
                        ioctl(stream, cmd, arg) {
                            if (!stream.stream_ops.ioctl) {
                                throw new FS.ErrnoError(59)
                            }
                            return stream.stream_ops.ioctl(stream, cmd, arg)
                        },
                        readFile(path, opts={}) {
                            opts.flags = opts.flags || 0;
                            opts.encoding = opts.encoding || "binary";
                            if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
                                throw new Error(`Invalid encoding type "${opts.encoding}"`)
                            }
                            var ret;
                            var stream = FS.open(path, opts.flags);
                            var stat = FS.stat(path);
                            var length = stat.size;
                            var buf = new Uint8Array(length);
                            FS.read(stream, buf, 0, length, 0);
                            if (opts.encoding === "utf8") {
                                ret = UTF8ArrayToString(buf)
                            } else if (opts.encoding === "binary") {
                                ret = buf
                            }
                            FS.close(stream);
                            return ret
                        },
                        writeFile(path, data, opts={}) {
                            opts.flags = opts.flags || 577;
                            var stream = FS.open(path, opts.flags, opts.mode);
                            if (typeof data == "string") {
                                var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
                                var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
                                FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn)
                            } else if (ArrayBuffer.isView(data)) {
                                FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn)
                            } else {
                                throw new Error("Unsupported data type")
                            }
                            FS.close(stream)
                        },
                        cwd: ()=>FS.currentPath,
                        chdir(path) {
                            var lookup = FS.lookupPath(path, {
                                follow: true
                            });
                            if (lookup.node === null) {
                                throw new FS.ErrnoError(44)
                            }
                            if (!FS.isDir(lookup.node.mode)) {
                                throw new FS.ErrnoError(54)
                            }
                            var errCode = FS.nodePermissions(lookup.node, "x");
                            if (errCode) {
                                throw new FS.ErrnoError(errCode)
                            }
                            FS.currentPath = lookup.path
                        },
                        createDefaultDirectories() {
                            FS.mkdir("/tmp");
                            FS.mkdir("/home");
                            FS.mkdir("/home/web_user")
                        },
                        createDefaultDevices() {
                            FS.mkdir("/dev");
                            FS.registerDevice(FS.makedev(1, 3), {
                                read: ()=>0,
                                write: (stream,buffer,offset,length,pos)=>length,
                                llseek: ()=>0
                            });
                            FS.mkdev("/dev/null", FS.makedev(1, 3));
                            TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
                            TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
                            FS.mkdev("/dev/tty", FS.makedev(5, 0));
                            FS.mkdev("/dev/tty1", FS.makedev(6, 0));
                            var randomBuffer = new Uint8Array(1024)
                              , randomLeft = 0;
                            var randomByte = ()=>{
                                if (randomLeft === 0) {
                                    randomFill(randomBuffer);
                                    randomLeft = randomBuffer.byteLength
                                }
                                return randomBuffer[--randomLeft]
                            }
                            ;
                            FS.createDevice("/dev", "random", randomByte);
                            FS.createDevice("/dev", "urandom", randomByte);
                            FS.mkdir("/dev/shm");
                            FS.mkdir("/dev/shm/tmp")
                        },
                        createSpecialDirectories() {
                            FS.mkdir("/proc");
                            var proc_self = FS.mkdir("/proc/self");
                            FS.mkdir("/proc/self/fd");
                            FS.mount({
                                mount() {
                                    var node = FS.createNode(proc_self, "fd", 16895, 73);
                                    node.stream_ops = {
                                        llseek: MEMFS.stream_ops.llseek
                                    };
                                    node.node_ops = {
                                        lookup(parent, name) {
                                            var fd = +name;
                                            var stream = FS.getStreamChecked(fd);
                                            var ret = {
                                                parent: null,
                                                mount: {
                                                    mountpoint: "fake"
                                                },
                                                node_ops: {
                                                    readlink: ()=>stream.path
                                                },
                                                id: fd + 1
                                            };
                                            ret.parent = ret;
                                            return ret
                                        },
                                        readdir() {
                                            return Array.from(FS.streams.entries()).filter(([k,v])=>v).map(([k,v])=>k.toString())
                                        }
                                    };
                                    return node
                                }
                            }, {}, "/proc/self/fd")
                        },
                        createStandardStreams(input, output, error) {
                            if (input) {
                                FS.createDevice("/dev", "stdin", input)
                            } else {
                                FS.symlink("/dev/tty", "/dev/stdin")
                            }
                            if (output) {
                                FS.createDevice("/dev", "stdout", null, output)
                            } else {
                                FS.symlink("/dev/tty", "/dev/stdout")
                            }
                            if (error) {
                                FS.createDevice("/dev", "stderr", null, error)
                            } else {
                                FS.symlink("/dev/tty1", "/dev/stderr")
                            }
                            var stdin = FS.open("/dev/stdin", 0);
                            var stdout = FS.open("/dev/stdout", 1);
                            var stderr = FS.open("/dev/stderr", 1)
                        },
                        staticInit() {
                            FS.nameTable = new Array(4096);
                            FS.mount(MEMFS, {}, "/");
                            FS.createDefaultDirectories();
                            FS.createDefaultDevices();
                            FS.createSpecialDirectories();
                            FS.filesystems = {
                                MEMFS,
                                IDBFS
                            }
                        },
                        init(input, output, error) {
                            FS.initialized = true;
                            input ??= Module["stdin"];
                            output ??= Module["stdout"];
                            error ??= Module["stderr"];
                            FS.createStandardStreams(input, output, error)
                        },
                        quit() {
                            FS.initialized = false;
                            for (var stream of FS.streams) {
                                if (stream) {
                                    FS.close(stream)
                                }
                            }
                        },
                        findObject(path, dontResolveLastLink) {
                            var ret = FS.analyzePath(path, dontResolveLastLink);
                            if (!ret.exists) {
                                return null
                            }
                            return ret.object
                        },
                        analyzePath(path, dontResolveLastLink) {
                            try {
                                var lookup = FS.lookupPath(path, {
                                    follow: !dontResolveLastLink
                                });
                                path = lookup.path
                            } catch (e) {}
                            var ret = {
                                isRoot: false,
                                exists: false,
                                error: 0,
                                name: null,
                                path: null,
                                object: null,
                                parentExists: false,
                                parentPath: null,
                                parentObject: null
                            };
                            try {
                                var lookup = FS.lookupPath(path, {
                                    parent: true
                                });
                                ret.parentExists = true;
                                ret.parentPath = lookup.path;
                                ret.parentObject = lookup.node;
                                ret.name = PATH.basename(path);
                                lookup = FS.lookupPath(path, {
                                    follow: !dontResolveLastLink
                                });
                                ret.exists = true;
                                ret.path = lookup.path;
                                ret.object = lookup.node;
                                ret.name = lookup.node.name;
                                ret.isRoot = lookup.path === "/"
                            } catch (e) {
                                ret.error = e.errno
                            }
                            return ret
                        },
                        createPath(parent, path, canRead, canWrite) {
                            parent = typeof parent == "string" ? parent : FS.getPath(parent);
                            var parts = path.split("/").reverse();
                            while (parts.length) {
                                var part = parts.pop();
                                if (!part)
                                    continue;
                                var current = PATH.join2(parent, part);
                                try {
                                    FS.mkdir(current)
                                } catch (e) {
                                    if (e.errno != 20)
                                        throw e
                                }
                                parent = current
                            }
                            return current
                        },
                        createFile(parent, name, properties, canRead, canWrite) {
                            var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
                            var mode = FS_getMode(canRead, canWrite);
                            return FS.create(path, mode)
                        },
                        createDataFile(parent, name, data, canRead, canWrite, canOwn) {
                            var path = name;
                            if (parent) {
                                parent = typeof parent == "string" ? parent : FS.getPath(parent);
                                path = name ? PATH.join2(parent, name) : parent
                            }
                            var mode = FS_getMode(canRead, canWrite);
                            var node = FS.create(path, mode);
                            if (data) {
                                if (typeof data == "string") {
                                    var arr = new Array(data.length);
                                    for (var i = 0, len = data.length; i < len; ++i)
                                        arr[i] = data.charCodeAt(i);
                                    data = arr
                                }
                                FS.chmod(node, mode | 146);
                                var stream = FS.open(node, 577);
                                FS.write(stream, data, 0, data.length, 0, canOwn);
                                FS.close(stream);
                                FS.chmod(node, mode)
                            }
                        },
                        createDevice(parent, name, input, output) {
                            var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
                            var mode = FS_getMode(!!input, !!output);
                            FS.createDevice.major ??= 64;
                            var dev = FS.makedev(FS.createDevice.major++, 0);
                            FS.registerDevice(dev, {
                                open(stream) {
                                    stream.seekable = false
                                },
                                close(stream) {
                                    if (output?.buffer?.length) {
                                        output(10)
                                    }
                                },
                                read(stream, buffer, offset, length, pos) {
                                    var bytesRead = 0;
                                    for (var i = 0; i < length; i++) {
                                        var result;
                                        try {
                                            result = input()
                                        } catch (e) {
                                            throw new FS.ErrnoError(29)
                                        }
                                        if (result === undefined && bytesRead === 0) {
                                            throw new FS.ErrnoError(6)
                                        }
                                        if (result === null || result === undefined)
                                            break;
                                        bytesRead++;
                                        buffer[offset + i] = result
                                    }
                                    if (bytesRead) {
                                        stream.node.atime = Date.now()
                                    }
                                    return bytesRead
                                },
                                write(stream, buffer, offset, length, pos) {
                                    for (var i = 0; i < length; i++) {
                                        try {
                                            output(buffer[offset + i])
                                        } catch (e) {
                                            throw new FS.ErrnoError(29)
                                        }
                                    }
                                    if (length) {
                                        stream.node.mtime = stream.node.ctime = Date.now()
                                    }
                                    return i
                                }
                            });
                            return FS.mkdev(path, mode, dev)
                        },
                        forceLoadFile(obj) {
                            if (obj.isDevice || obj.isFolder || obj.link || obj.contents)
                                return true;
                            if (typeof XMLHttpRequest != "undefined") {
                                throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")
                            } else {
                                try {
                                    obj.contents = readBinary(obj.url);
                                    obj.usedBytes = obj.contents.length
                                } catch (e) {
                                    throw new FS.ErrnoError(29)
                                }
                            }
                        },
                        createLazyFile(parent, name, url, canRead, canWrite) {
                            class LazyUint8Array {
                                lengthKnown = false;
                                chunks = [];
                                get(idx) {
                                    if (idx > this.length - 1 || idx < 0) {
                                        return undefined
                                    }
                                    var chunkOffset = idx % this.chunkSize;
                                    var chunkNum = idx / this.chunkSize | 0;
                                    return this.getter(chunkNum)[chunkOffset]
                                }
                                setDataGetter(getter) {
                                    this.getter = getter
                                }
                                cacheLength() {
                                    var xhr = new XMLHttpRequest;
                                    xhr.open("HEAD", url, false);
                                    xhr.send(null);
                                    if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
                                        throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                                    var datalength = Number(xhr.getResponseHeader("Content-length"));
                                    var header;
                                    var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
                                    var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
                                    var chunkSize = 1024 * 1024;
                                    if (!hasByteServing)
                                        chunkSize = datalength;
                                    var doXHR = (from,to)=>{
                                        if (from > to)
                                            throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                                        if (to > datalength - 1)
                                            throw new Error("only " + datalength + " bytes available! programmer error!");
                                        var xhr = new XMLHttpRequest;
                                        xhr.open("GET", url, false);
                                        if (datalength !== chunkSize)
                                            xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                                        xhr.responseType = "arraybuffer";
                                        if (xhr.overrideMimeType) {
                                            xhr.overrideMimeType("text/plain; charset=x-user-defined")
                                        }
                                        xhr.send(null);
                                        if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
                                            throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                                        if (xhr.response !== undefined) {
                                            return new Uint8Array(xhr.response || [])
                                        }
                                        return intArrayFromString(xhr.responseText || "", true)
                                    }
                                    ;
                                    var lazyArray = this;
                                    lazyArray.setDataGetter(chunkNum=>{
                                        var start = chunkNum * chunkSize;
                                        var end = (chunkNum + 1) * chunkSize - 1;
                                        end = Math.min(end, datalength - 1);
                                        if (typeof lazyArray.chunks[chunkNum] == "undefined") {
                                            lazyArray.chunks[chunkNum] = doXHR(start, end)
                                        }
                                        if (typeof lazyArray.chunks[chunkNum] == "undefined")
                                            throw new Error("doXHR failed!");
                                        return lazyArray.chunks[chunkNum]
                                    }
                                    );
                                    if (usesGzip || !datalength) {
                                        chunkSize = datalength = 1;
                                        datalength = this.getter(0).length;
                                        chunkSize = datalength;
                                        out("LazyFiles on gzip forces download of the whole file when length is accessed")
                                    }
                                    this._length = datalength;
                                    this._chunkSize = chunkSize;
                                    this.lengthKnown = true
                                }
                                get length() {
                                    if (!this.lengthKnown) {
                                        this.cacheLength()
                                    }
                                    return this._length
                                }
                                get chunkSize() {
                                    if (!this.lengthKnown) {
                                        this.cacheLength()
                                    }
                                    return this._chunkSize
                                }
                            }
                            if (typeof XMLHttpRequest != "undefined") {
                                if (!ENVIRONMENT_IS_WORKER)
                                    throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                                var lazyArray = new LazyUint8Array;
                                var properties = {
                                    isDevice: false,
                                    contents: lazyArray
                                }
                            } else {
                                var properties = {
                                    isDevice: false,
                                    url
                                }
                            }
                            var node = FS.createFile(parent, name, properties, canRead, canWrite);
                            if (properties.contents) {
                                node.contents = properties.contents
                            } else if (properties.url) {
                                node.contents = null;
                                node.url = properties.url
                            }
                            Object.defineProperties(node, {
                                usedBytes: {
                                    get: function() {
                                        return this.contents.length
                                    }
                                }
                            });
                            var stream_ops = {};
                            var keys = Object.keys(node.stream_ops);
                            keys.forEach(key=>{
                                var fn = node.stream_ops[key];
                                stream_ops[key] = (...args)=>{
                                    FS.forceLoadFile(node);
                                    return fn(...args)
                                }
                            }
                            );
                            function writeChunks(stream, buffer, offset, length, position) {
                                var contents = stream.node.contents;
                                if (position >= contents.length)
                                    return 0;
                                var size = Math.min(contents.length - position, length);
                                if (contents.slice) {
                                    for (var i = 0; i < size; i++) {
                                        buffer[offset + i] = contents[position + i]
                                    }
                                } else {
                                    for (var i = 0; i < size; i++) {
                                        buffer[offset + i] = contents.get(position + i)
                                    }
                                }
                                return size
                            }
                            stream_ops.read = (stream,buffer,offset,length,position)=>{
                                FS.forceLoadFile(node);
                                return writeChunks(stream, buffer, offset, length, position)
                            }
                            ;
                            stream_ops.mmap = (stream,length,position,prot,flags)=>{
                                FS.forceLoadFile(node);
                                var ptr = mmapAlloc(length);
                                if (!ptr) {
                                    throw new FS.ErrnoError(48)
                                }
                                writeChunks(stream, HEAP8, ptr, length, position);
                                return {
                                    ptr,
                                    allocated: true
                                }
                            }
                            ;
                            node.stream_ops = stream_ops;
                            return node
                        }
                    };
                    var SOCKFS = {
                        websocketArgs: {},
                        callbacks: {},
                        on(event, callback) {
                            SOCKFS.callbacks[event] = callback
                        },
                        emit(event, param) {
                            SOCKFS.callbacks[event]?.(param)
                        },
                        mount(mount) {
                            SOCKFS.websocketArgs = Module["websocket"] || {};
                            (Module["websocket"] ??= {})["on"] = SOCKFS.on;
                            return FS.createNode(null, "/", 16895, 0)
                        },
                        createSocket(family, type, protocol) {
                            type &= ~526336;
                            var streaming = type == 1;
                            if (streaming && protocol && protocol != 6) {
                                throw new FS.ErrnoError(66)
                            }
                            var sock = {
                                family,
                                type,
                                protocol,
                                server: null,
                                error: null,
                                peers: {},
                                pending: [],
                                recv_queue: [],
                                sock_ops: SOCKFS.websocket_sock_ops
                            };
                            var name = SOCKFS.nextname();
                            var node = FS.createNode(SOCKFS.root, name, 49152, 0);
                            node.sock = sock;
                            var stream = FS.createStream({
                                path: name,
                                node,
                                flags: 2,
                                seekable: false,
                                stream_ops: SOCKFS.stream_ops
                            });
                            sock.stream = stream;
                            return sock
                        },
                        getSocket(fd) {
                            var stream = FS.getStream(fd);
                            if (!stream || !FS.isSocket(stream.node.mode)) {
                                return null
                            }
                            return stream.node.sock
                        },
                        stream_ops: {
                            poll(stream) {
                                var sock = stream.node.sock;
                                return sock.sock_ops.poll(sock)
                            },
                            ioctl(stream, request, varargs) {
                                var sock = stream.node.sock;
                                return sock.sock_ops.ioctl(sock, request, varargs)
                            },
                            read(stream, buffer, offset, length, position) {
                                var sock = stream.node.sock;
                                var msg = sock.sock_ops.recvmsg(sock, length);
                                if (!msg) {
                                    return 0
                                }
                                buffer.set(msg.buffer, offset);
                                return msg.buffer.length
                            },
                            write(stream, buffer, offset, length, position) {
                                var sock = stream.node.sock;
                                return sock.sock_ops.sendmsg(sock, buffer, offset, length)
                            },
                            close(stream) {
                                var sock = stream.node.sock;
                                sock.sock_ops.close(sock)
                            }
                        },
                        nextname() {
                            if (!SOCKFS.nextname.current) {
                                SOCKFS.nextname.current = 0
                            }
                            return `socket[${SOCKFS.nextname.current++}]`
                        },
                        websocket_sock_ops: {
                            createPeer(sock, addr, port) {
                                var ws;
                                if (typeof addr == "object") {
                                    ws = addr;
                                    addr = null;
                                    port = null
                                }
                                if (ws) {
                                    if (ws._socket) {
                                        addr = ws._socket.remoteAddress;
                                        port = ws._socket.remotePort
                                    } else {
                                        var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
                                        if (!result) {
                                            throw new Error("WebSocket URL must be in the format ws(s)://address:port")
                                        }
                                        addr = result[1];
                                        port = parseInt(result[2], 10)
                                    }
                                } else {
                                    try {
                                        var url = "ws://".replace("#", "//");
                                        var subProtocols = "binary";
                                        var opts = undefined;
                                        if (SOCKFS.websocketArgs["url"]) {
                                            url = SOCKFS.websocketArgs["url"]
                                        }
                                        if (SOCKFS.websocketArgs["subprotocol"]) {
                                            subProtocols = SOCKFS.websocketArgs["subprotocol"]
                                        } else if (SOCKFS.websocketArgs["subprotocol"] === null) {
                                            subProtocols = "null"
                                        }
                                        if (url === "ws://" || url === "wss://") {
                                            var parts = addr.split("/");
                                            url = url + parts[0] + ":" + port + "/" + parts.slice(1).join("/")
                                        }
                                        if (subProtocols !== "null") {
                                            subProtocols = subProtocols.replace(/^ +| +$/g, "").split(/ *, */);
                                            opts = subProtocols
                                        }
                                        var WebSocketConstructor;
                                        {
                                            WebSocketConstructor = WebSocket
                                        }
                                        ws = new WebSocketConstructor(url,opts);
                                        ws.binaryType = "arraybuffer"
                                    } catch (e) {
                                        throw new FS.ErrnoError(23)
                                    }
                                }
                                var peer = {
                                    addr,
                                    port,
                                    socket: ws,
                                    msg_send_queue: []
                                };
                                SOCKFS.websocket_sock_ops.addPeer(sock, peer);
                                SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
                                if (sock.type === 2 && typeof sock.sport != "undefined") {
                                    peer.msg_send_queue.push(new Uint8Array([255, 255, 255, 255, "p".charCodeAt(0), "o".charCodeAt(0), "r".charCodeAt(0), "t".charCodeAt(0), (sock.sport & 65280) >> 8, sock.sport & 255]))
                                }
                                return peer
                            },
                            getPeer(sock, addr, port) {
                                return sock.peers[addr + ":" + port]
                            },
                            addPeer(sock, peer) {
                                sock.peers[peer.addr + ":" + peer.port] = peer
                            },
                            removePeer(sock, peer) {
                                delete sock.peers[peer.addr + ":" + peer.port]
                            },
                            handlePeerEvents(sock, peer) {
                                var first = true;
                                var handleOpen = function() {
                                    sock.connecting = false;
                                    SOCKFS.emit("open", sock.stream.fd);
                                    try {
                                        var queued = peer.msg_send_queue.shift();
                                        while (queued) {
                                            peer.socket.send(queued);
                                            queued = peer.msg_send_queue.shift()
                                        }
                                    } catch (e) {
                                        peer.socket.close()
                                    }
                                };
                                function handleMessage(data) {
                                    if (typeof data == "string") {
                                        var encoder = new TextEncoder;
                                        data = encoder.encode(data)
                                    } else {
                                        assert(data.byteLength !== undefined);
                                        if (data.byteLength == 0) {
                                            return
                                        }
                                        data = new Uint8Array(data)
                                    }
                                    var wasfirst = first;
                                    first = false;
                                    if (wasfirst && data.length === 10 && data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 && data[4] === "p".charCodeAt(0) && data[5] === "o".charCodeAt(0) && data[6] === "r".charCodeAt(0) && data[7] === "t".charCodeAt(0)) {
                                        var newport = data[8] << 8 | data[9];
                                        SOCKFS.websocket_sock_ops.removePeer(sock, peer);
                                        peer.port = newport;
                                        SOCKFS.websocket_sock_ops.addPeer(sock, peer);
                                        return
                                    }
                                    sock.recv_queue.push({
                                        addr: peer.addr,
                                        port: peer.port,
                                        data
                                    });
                                    SOCKFS.emit("message", sock.stream.fd)
                                }
                                if (ENVIRONMENT_IS_NODE) {
                                    peer.socket.on("open", handleOpen);
                                    peer.socket.on("message", function(data, isBinary) {
                                        if (!isBinary) {
                                            return
                                        }
                                        handleMessage(new Uint8Array(data).buffer)
                                    });
                                    peer.socket.on("close", function() {
                                        SOCKFS.emit("close", sock.stream.fd)
                                    });
                                    peer.socket.on("error", function(error) {
                                        sock.error = 14;
                                        SOCKFS.emit("error", [sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused"])
                                    })
                                } else {
                                    peer.socket.onopen = handleOpen;
                                    peer.socket.onclose = function() {
                                        SOCKFS.emit("close", sock.stream.fd)
                                    }
                                    ;
                                    peer.socket.onmessage = function peer_socket_onmessage(event) {
                                        handleMessage(event.data)
                                    }
                                    ;
                                    peer.socket.onerror = function(error) {
                                        sock.error = 14;
                                        SOCKFS.emit("error", [sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused"])
                                    }
                                }
                            },
                            poll(sock) {
                                if (sock.type === 1 && sock.server) {
                                    return sock.pending.length ? 64 | 1 : 0
                                }
                                var mask = 0;
                                var dest = sock.type === 1 ? SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) : null;
                                if (sock.recv_queue.length || !dest || dest && dest.socket.readyState === dest.socket.CLOSING || dest && dest.socket.readyState === dest.socket.CLOSED) {
                                    mask |= 64 | 1
                                }
                                if (!dest || dest && dest.socket.readyState === dest.socket.OPEN) {
                                    mask |= 4
                                }
                                if (dest && dest.socket.readyState === dest.socket.CLOSING || dest && dest.socket.readyState === dest.socket.CLOSED) {
                                    if (sock.connecting) {
                                        mask |= 4
                                    } else {
                                        mask |= 16
                                    }
                                }
                                return mask
                            },
                            ioctl(sock, request, arg) {
                                switch (request) {
                                case 21531:
                                    var bytes = 0;
                                    if (sock.recv_queue.length) {
                                        bytes = sock.recv_queue[0].data.length
                                    }
                                    HEAP32[arg >> 2] = bytes;
                                    return 0;
                                default:
                                    return 28
                                }
                            },
                            close(sock) {
                                if (sock.server) {
                                    try {
                                        sock.server.close()
                                    } catch (e) {}
                                    sock.server = null
                                }
                                for (var peer of Object.values(sock.peers)) {
                                    try {
                                        peer.socket.close()
                                    } catch (e) {}
                                    SOCKFS.websocket_sock_ops.removePeer(sock, peer)
                                }
                                return 0
                            },
                            bind(sock, addr, port) {
                                if (typeof sock.saddr != "undefined" || typeof sock.sport != "undefined") {
                                    throw new FS.ErrnoError(28)
                                }
                                sock.saddr = addr;
                                sock.sport = port;
                                if (sock.type === 2) {
                                    if (sock.server) {
                                        sock.server.close();
                                        sock.server = null
                                    }
                                    try {
                                        sock.sock_ops.listen(sock, 0)
                                    } catch (e) {
                                        if (!(e.name === "ErrnoError"))
                                            throw e;
                                        if (e.errno !== 138)
                                            throw e
                                    }
                                }
                            },
                            connect(sock, addr, port) {
                                if (sock.server) {
                                    throw new FS.ErrnoError(138)
                                }
                                if (typeof sock.daddr != "undefined" && typeof sock.dport != "undefined") {
                                    var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
                                    if (dest) {
                                        if (dest.socket.readyState === dest.socket.CONNECTING) {
                                            throw new FS.ErrnoError(7)
                                        } else {
                                            throw new FS.ErrnoError(30)
                                        }
                                    }
                                }
                                var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
                                sock.daddr = peer.addr;
                                sock.dport = peer.port;
                                sock.connecting = true
                            },
                            listen(sock, backlog) {
                                if (!ENVIRONMENT_IS_NODE) {
                                    throw new FS.ErrnoError(138)
                                }
                            },
                            accept(listensock) {
                                if (!listensock.server || !listensock.pending.length) {
                                    throw new FS.ErrnoError(28)
                                }
                                var newsock = listensock.pending.shift();
                                newsock.stream.flags = listensock.stream.flags;
                                return newsock
                            },
                            getname(sock, peer) {
                                var addr, port;
                                if (peer) {
                                    if (sock.daddr === undefined || sock.dport === undefined) {
                                        throw new FS.ErrnoError(53)
                                    }
                                    addr = sock.daddr;
                                    port = sock.dport
                                } else {
                                    addr = sock.saddr || 0;
                                    port = sock.sport || 0
                                }
                                return {
                                    addr,
                                    port
                                }
                            },
                            sendmsg(sock, buffer, offset, length, addr, port) {
                                if (sock.type === 2) {
                                    if (addr === undefined || port === undefined) {
                                        addr = sock.daddr;
                                        port = sock.dport
                                    }
                                    if (addr === undefined || port === undefined) {
                                        throw new FS.ErrnoError(17)
                                    }
                                } else {
                                    addr = sock.daddr;
                                    port = sock.dport
                                }
                                var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
                                if (sock.type === 1) {
                                    if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                                        throw new FS.ErrnoError(53)
                                    }
                                }
                                if (ArrayBuffer.isView(buffer)) {
                                    offset += buffer.byteOffset;
                                    buffer = buffer.buffer
                                }
                                var data = buffer.slice(offset, offset + length);
                                if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
                                    if (sock.type === 2) {
                                        if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                                            dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port)
                                        }
                                    }
                                    dest.msg_send_queue.push(data);
                                    return length
                                }
                                try {
                                    dest.socket.send(data);
                                    return length
                                } catch (e) {
                                    throw new FS.ErrnoError(28)
                                }
                            },
                            recvmsg(sock, length) {
                                if (sock.type === 1 && sock.server) {
                                    throw new FS.ErrnoError(53)
                                }
                                var queued = sock.recv_queue.shift();
                                if (!queued) {
                                    if (sock.type === 1) {
                                        var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
                                        if (!dest) {
                                            throw new FS.ErrnoError(53)
                                        }
                                        if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                                            return null
                                        }
                                        throw new FS.ErrnoError(6)
                                    }
                                    throw new FS.ErrnoError(6)
                                }
                                var queuedLength = queued.data.byteLength || queued.data.length;
                                var queuedOffset = queued.data.byteOffset || 0;
                                var queuedBuffer = queued.data.buffer || queued.data;
                                var bytesRead = Math.min(length, queuedLength);
                                var res = {
                                    buffer: new Uint8Array(queuedBuffer,queuedOffset,bytesRead),
                                    addr: queued.addr,
                                    port: queued.port
                                };
                                if (sock.type === 1 && bytesRead < queuedLength) {
                                    var bytesRemaining = queuedLength - bytesRead;
                                    queued.data = new Uint8Array(queuedBuffer,queuedOffset + bytesRead,bytesRemaining);
                                    sock.recv_queue.unshift(queued)
                                }
                                return res
                            }
                        }
                    };
                    var getSocketFromFD = fd=>{
                        var socket = SOCKFS.getSocket(fd);
                        if (!socket)
                            throw new FS.ErrnoError(8);
                        return socket
                    }
                    ;
                    var inetPton4 = str=>{
                        var b = str.split(".");
                        for (var i = 0; i < 4; i++) {
                            var tmp = Number(b[i]);
                            if (isNaN(tmp))
                                return null;
                            b[i] = tmp
                        }
                        return (b[0] | b[1] << 8 | b[2] << 16 | b[3] << 24) >>> 0
                    }
                    ;
                    var inetPton6 = str=>{
                        var words;
                        var w, offset, z;
                        var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
                        var parts = [];
                        if (!valid6regx.test(str)) {
                            return null
                        }
                        if (str === "::") {
                            return [0, 0, 0, 0, 0, 0, 0, 0]
                        }
                        if (str.startsWith("::")) {
                            str = str.replace("::", "Z:")
                        } else {
                            str = str.replace("::", ":Z:")
                        }
                        if (str.indexOf(".") > 0) {
                            str = str.replace(new RegExp("[.]","g"), ":");
                            words = str.split(":");
                            words[words.length - 4] = Number(words[words.length - 4]) + Number(words[words.length - 3]) * 256;
                            words[words.length - 3] = Number(words[words.length - 2]) + Number(words[words.length - 1]) * 256;
                            words = words.slice(0, words.length - 2)
                        } else {
                            words = str.split(":")
                        }
                        offset = 0;
                        z = 0;
                        for (w = 0; w < words.length; w++) {
                            if (typeof words[w] == "string") {
                                if (words[w] === "Z") {
                                    for (z = 0; z < 8 - words.length + 1; z++) {
                                        parts[w + z] = 0
                                    }
                                    offset = z - 1
                                } else {
                                    parts[w + offset] = _htons(parseInt(words[w], 16))
                                }
                            } else {
                                parts[w + offset] = words[w]
                            }
                        }
                        return [parts[1] << 16 | parts[0], parts[3] << 16 | parts[2], parts[5] << 16 | parts[4], parts[7] << 16 | parts[6]]
                    }
                    ;
                    var zeroMemory = (ptr,size)=>HEAPU8.fill(0, ptr, ptr + size);
                    var writeSockaddr = (sa,family,addr,port,addrlen)=>{
                        switch (family) {
                        case 2:
                            addr = inetPton4(addr);
                            zeroMemory(sa, 16);
                            if (addrlen) {
                                HEAP32[addrlen >> 2] = 16
                            }
                            HEAP16[sa >> 1] = family;
                            HEAP32[sa + 4 >> 2] = addr;
                            HEAP16[sa + 2 >> 1] = _htons(port);
                            break;
                        case 10:
                            addr = inetPton6(addr);
                            zeroMemory(sa, 28);
                            if (addrlen) {
                                HEAP32[addrlen >> 2] = 28
                            }
                            HEAP32[sa >> 2] = family;
                            HEAP32[sa + 8 >> 2] = addr[0];
                            HEAP32[sa + 12 >> 2] = addr[1];
                            HEAP32[sa + 16 >> 2] = addr[2];
                            HEAP32[sa + 20 >> 2] = addr[3];
                            HEAP16[sa + 2 >> 1] = _htons(port);
                            break;
                        default:
                            return 5
                        }
                        return 0
                    }
                    ;
                    var DNS = {
                        address_map: {
                            id: 1,
                            addrs: {},
                            names: {}
                        },
                        lookup_name(name) {
                            var res = inetPton4(name);
                            if (res !== null) {
                                return name
                            }
                            res = inetPton6(name);
                            if (res !== null) {
                                return name
                            }
                            var addr;
                            if (DNS.address_map.addrs[name]) {
                                addr = DNS.address_map.addrs[name]
                            } else {
                                var id = DNS.address_map.id++;
                                assert(id < 65535, "exceeded max address mappings of 65535");
                                addr = "172.29." + (id & 255) + "." + (id & 65280);
                                DNS.address_map.names[addr] = name;
                                DNS.address_map.addrs[name] = addr
                            }
                            return addr
                        },
                        lookup_addr(addr) {
                            if (DNS.address_map.names[addr]) {
                                return DNS.address_map.names[addr]
                            }
                            return null
                        }
                    };
                    function ___syscall_accept4(fd, addr, addrlen, flags, d1, d2) {
                        try {
                            var sock = getSocketFromFD(fd);
                            var newsock = sock.sock_ops.accept(sock);
                            if (addr) {
                                var errno = writeSockaddr(addr, newsock.family, DNS.lookup_name(newsock.daddr), newsock.dport, addrlen)
                            }
                            return newsock.stream.fd
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    var inetNtop4 = addr=>(addr & 255) + "." + (addr >> 8 & 255) + "." + (addr >> 16 & 255) + "." + (addr >> 24 & 255);
                    var inetNtop6 = ints=>{
                        var str = "";
                        var word = 0;
                        var longest = 0;
                        var lastzero = 0;
                        var zstart = 0;
                        var len = 0;
                        var i = 0;
                        var parts = [ints[0] & 65535, ints[0] >> 16, ints[1] & 65535, ints[1] >> 16, ints[2] & 65535, ints[2] >> 16, ints[3] & 65535, ints[3] >> 16];
                        var hasipv4 = true;
                        var v4part = "";
                        for (i = 0; i < 5; i++) {
                            if (parts[i] !== 0) {
                                hasipv4 = false;
                                break
                            }
                        }
                        if (hasipv4) {
                            v4part = inetNtop4(parts[6] | parts[7] << 16);
                            if (parts[5] === -1) {
                                str = "::ffff:";
                                str += v4part;
                                return str
                            }
                            if (parts[5] === 0) {
                                str = "::";
                                if (v4part === "0.0.0.0")
                                    v4part = "";
                                if (v4part === "0.0.0.1")
                                    v4part = "1";
                                str += v4part;
                                return str
                            }
                        }
                        for (word = 0; word < 8; word++) {
                            if (parts[word] === 0) {
                                if (word - lastzero > 1) {
                                    len = 0
                                }
                                lastzero = word;
                                len++
                            }
                            if (len > longest) {
                                longest = len;
                                zstart = word - longest + 1
                            }
                        }
                        for (word = 0; word < 8; word++) {
                            if (longest > 1) {
                                if (parts[word] === 0 && word >= zstart && word < zstart + longest) {
                                    if (word === zstart) {
                                        str += ":";
                                        if (zstart === 0)
                                            str += ":"
                                    }
                                    continue
                                }
                            }
                            str += Number(_ntohs(parts[word] & 65535)).toString(16);
                            str += word < 7 ? ":" : ""
                        }
                        return str
                    }
                    ;
                    var readSockaddr = (sa,salen)=>{
                        var family = HEAP16[sa >> 1];
                        var port = _ntohs(HEAPU16[sa + 2 >> 1]);
                        var addr;
                        switch (family) {
                        case 2:
                            if (salen !== 16) {
                                return {
                                    errno: 28
                                }
                            }
                            addr = HEAP32[sa + 4 >> 2];
                            addr = inetNtop4(addr);
                            break;
                        case 10:
                            if (salen !== 28) {
                                return {
                                    errno: 28
                                }
                            }
                            addr = [HEAP32[sa + 8 >> 2], HEAP32[sa + 12 >> 2], HEAP32[sa + 16 >> 2], HEAP32[sa + 20 >> 2]];
                            addr = inetNtop6(addr);
                            break;
                        default:
                            return {
                                errno: 5
                            }
                        }
                        return {
                            family,
                            addr,
                            port
                        }
                    }
                    ;
                    var getSocketAddress = (addrp,addrlen)=>{
                        var info = readSockaddr(addrp, addrlen);
                        if (info.errno)
                            throw new FS.ErrnoError(info.errno);
                        info.addr = DNS.lookup_addr(info.addr) || info.addr;
                        return info
                    }
                    ;
                    function ___syscall_bind(fd, addr, addrlen, d1, d2, d3) {
                        try {
                            var sock = getSocketFromFD(fd);
                            var info = getSocketAddress(addr, addrlen);
                            sock.sock_ops.bind(sock, info.addr, info.port);
                            return 0
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    function ___syscall_connect(fd, addr, addrlen, d1, d2, d3) {
                        try {
                            var sock = getSocketFromFD(fd);
                            var info = getSocketAddress(addr, addrlen);
                            sock.sock_ops.connect(sock, info.addr, info.port);
                            return 0
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    var syscallGetVarargI = ()=>{
                        var ret = HEAP32[+SYSCALLS.varargs >> 2];
                        SYSCALLS.varargs += 4;
                        return ret
                    }
                    ;
                    var syscallGetVarargP = syscallGetVarargI;
                    var SYSCALLS = {
                        DEFAULT_POLLMASK: 5,
                        calculateAt(dirfd, path, allowEmpty) {
                            if (PATH.isAbs(path)) {
                                return path
                            }
                            var dir;
                            if (dirfd === -100) {
                                dir = FS.cwd()
                            } else {
                                var dirstream = SYSCALLS.getStreamFromFD(dirfd);
                                dir = dirstream.path
                            }
                            if (path.length == 0) {
                                if (!allowEmpty) {
                                    throw new FS.ErrnoError(44)
                                }
                                return dir
                            }
                            return dir + "/" + path
                        },
                        writeStat(buf, stat) {
                            HEAP32[buf >> 2] = stat.dev;
                            HEAP32[buf + 4 >> 2] = stat.mode;
                            HEAPU32[buf + 8 >> 2] = stat.nlink;
                            HEAP32[buf + 12 >> 2] = stat.uid;
                            HEAP32[buf + 16 >> 2] = stat.gid;
                            HEAP32[buf + 20 >> 2] = stat.rdev;
                            HEAP64[buf + 24 >> 3] = BigInt(stat.size);
                            HEAP32[buf + 32 >> 2] = 4096;
                            HEAP32[buf + 36 >> 2] = stat.blocks;
                            var atime = stat.atime.getTime();
                            var mtime = stat.mtime.getTime();
                            var ctime = stat.ctime.getTime();
                            HEAP64[buf + 40 >> 3] = BigInt(Math.floor(atime / 1e3));
                            HEAPU32[buf + 48 >> 2] = atime % 1e3 * 1e3 * 1e3;
                            HEAP64[buf + 56 >> 3] = BigInt(Math.floor(mtime / 1e3));
                            HEAPU32[buf + 64 >> 2] = mtime % 1e3 * 1e3 * 1e3;
                            HEAP64[buf + 72 >> 3] = BigInt(Math.floor(ctime / 1e3));
                            HEAPU32[buf + 80 >> 2] = ctime % 1e3 * 1e3 * 1e3;
                            HEAP64[buf + 88 >> 3] = BigInt(stat.ino);
                            return 0
                        },
                        writeStatFs(buf, stats) {
                            HEAP32[buf + 4 >> 2] = stats.bsize;
                            HEAP32[buf + 40 >> 2] = stats.bsize;
                            HEAP32[buf + 8 >> 2] = stats.blocks;
                            HEAP32[buf + 12 >> 2] = stats.bfree;
                            HEAP32[buf + 16 >> 2] = stats.bavail;
                            HEAP32[buf + 20 >> 2] = stats.files;
                            HEAP32[buf + 24 >> 2] = stats.ffree;
                            HEAP32[buf + 28 >> 2] = stats.fsid;
                            HEAP32[buf + 44 >> 2] = stats.flags;
                            HEAP32[buf + 36 >> 2] = stats.namelen
                        },
                        doMsync(addr, stream, len, flags, offset) {
                            if (!FS.isFile(stream.node.mode)) {
                                throw new FS.ErrnoError(43)
                            }
                            if (flags & 2) {
                                return 0
                            }
                            var buffer = HEAPU8.slice(addr, addr + len);
                            FS.msync(stream, buffer, offset, len, flags)
                        },
                        getStreamFromFD(fd) {
                            var stream = FS.getStreamChecked(fd);
                            return stream
                        },
                        varargs: undefined,
                        getStr(ptr) {
                            var ret = UTF8ToString(ptr);
                            return ret
                        }
                    };
                    function ___syscall_fcntl64(fd, cmd, varargs) {
                        SYSCALLS.varargs = varargs;
                        try {
                            var stream = SYSCALLS.getStreamFromFD(fd);
                            switch (cmd) {
                            case 0:
                                {
                                    var arg = syscallGetVarargI();
                                    if (arg < 0) {
                                        return -28
                                    }
                                    while (FS.streams[arg]) {
                                        arg++
                                    }
                                    var newStream;
                                    newStream = FS.dupStream(stream, arg);
                                    return newStream.fd
                                }
                            case 1:
                            case 2:
                                return 0;
                            case 3:
                                return stream.flags;
                            case 4:
                                {
                                    var arg = syscallGetVarargI();
                                    stream.flags |= arg;
                                    return 0
                                }
                            case 12:
                                {
                                    var arg = syscallGetVarargP();
                                    var offset = 0;
                                    HEAP16[arg + offset >> 1] = 2;
                                    return 0
                                }
                            case 13:
                            case 14:
                                return 0
                            }
                            return -28
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    var INT53_MAX = 9007199254740992;
                    var INT53_MIN = -9007199254740992;
                    var bigintToI53Checked = num=>num < INT53_MIN || num > INT53_MAX ? NaN : Number(num);
                    function ___syscall_ftruncate64(fd, length) {
                        length = bigintToI53Checked(length);
                        try {
                            if (isNaN(length))
                                return 61;
                            FS.ftruncate(fd, length);
                            return 0
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    var stringToUTF8 = (str,outPtr,maxBytesToWrite)=>stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
                    function ___syscall_getcwd(buf, size) {
                        try {
                            if (size === 0)
                                return -28;
                            var cwd = FS.cwd();
                            var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
                            if (size < cwdLengthInBytes)
                                return -68;
                            stringToUTF8(cwd, buf, size);
                            return cwdLengthInBytes
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    function ___syscall_getdents64(fd, dirp, count) {
                        try {
                            var stream = SYSCALLS.getStreamFromFD(fd);
                            stream.getdents ||= FS.readdir(stream.path);
                            var struct_size = 280;
                            var pos = 0;
                            var off = FS.llseek(stream, 0, 1);
                            var startIdx = Math.floor(off / struct_size);
                            var endIdx = Math.min(stream.getdents.length, startIdx + Math.floor(count / struct_size));
                            for (var idx = startIdx; idx < endIdx; idx++) {
                                var id;
                                var type;
                                var name = stream.getdents[idx];
                                if (name === ".") {
                                    id = stream.node.id;
                                    type = 4
                                } else if (name === "..") {
                                    var lookup = FS.lookupPath(stream.path, {
                                        parent: true
                                    });
                                    id = lookup.node.id;
                                    type = 4
                                } else {
                                    var child;
                                    try {
                                        child = FS.lookupNode(stream.node, name)
                                    } catch (e) {
                                        if (e?.errno === 28) {
                                            continue
                                        }
                                        throw e
                                    }
                                    id = child.id;
                                    type = FS.isChrdev(child.mode) ? 2 : FS.isDir(child.mode) ? 4 : FS.isLink(child.mode) ? 10 : 8
                                }
                                HEAP64[dirp + pos >> 3] = BigInt(id);
                                HEAP64[dirp + pos + 8 >> 3] = BigInt((idx + 1) * struct_size);
                                HEAP16[dirp + pos + 16 >> 1] = 280;
                                HEAP8[dirp + pos + 18] = type;
                                stringToUTF8(name, dirp + pos + 19, 256);
                                pos += struct_size
                            }
                            FS.llseek(stream, idx * struct_size, 0);
                            return pos
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    function ___syscall_getsockname(fd, addr, addrlen, d1, d2, d3) {
                        try {
                            var sock = getSocketFromFD(fd);
                            var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(sock.saddr || "0.0.0.0"), sock.sport, addrlen);
                            return 0
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    function ___syscall_getsockopt(fd, level, optname, optval, optlen, d1) {
                        try {
                            var sock = getSocketFromFD(fd);
                            if (level === 1) {
                                if (optname === 4) {
                                    HEAP32[optval >> 2] = sock.error;
                                    HEAP32[optlen >> 2] = 4;
                                    sock.error = null;
                                    return 0
                                }
                            }
                            return -50
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    function ___syscall_ioctl(fd, op, varargs) {
                        SYSCALLS.varargs = varargs;
                        try {
                            var stream = SYSCALLS.getStreamFromFD(fd);
                            switch (op) {
                            case 21509:
                                {
                                    if (!stream.tty)
                                        return -59;
                                    return 0
                                }
                            case 21505:
                                {
                                    if (!stream.tty)
                                        return -59;
                                    if (stream.tty.ops.ioctl_tcgets) {
                                        var termios = stream.tty.ops.ioctl_tcgets(stream);
                                        var argp = syscallGetVarargP();
                                        HEAP32[argp >> 2] = termios.c_iflag || 0;
                                        HEAP32[argp + 4 >> 2] = termios.c_oflag || 0;
                                        HEAP32[argp + 8 >> 2] = termios.c_cflag || 0;
                                        HEAP32[argp + 12 >> 2] = termios.c_lflag || 0;
                                        for (var i = 0; i < 32; i++) {
                                            HEAP8[argp + i + 17] = termios.c_cc[i] || 0
                                        }
                                        return 0
                                    }
                                    return 0
                                }
                            case 21510:
                            case 21511:
                            case 21512:
                                {
                                    if (!stream.tty)
                                        return -59;
                                    return 0
                                }
                            case 21506:
                            case 21507:
                            case 21508:
                                {
                                    if (!stream.tty)
                                        return -59;
                                    if (stream.tty.ops.ioctl_tcsets) {
                                        var argp = syscallGetVarargP();
                                        var c_iflag = HEAP32[argp >> 2];
                                        var c_oflag = HEAP32[argp + 4 >> 2];
                                        var c_cflag = HEAP32[argp + 8 >> 2];
                                        var c_lflag = HEAP32[argp + 12 >> 2];
                                        var c_cc = [];
                                        for (var i = 0; i < 32; i++) {
                                            c_cc.push(HEAP8[argp + i + 17])
                                        }
                                        return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
                                            c_iflag,
                                            c_oflag,
                                            c_cflag,
                                            c_lflag,
                                            c_cc
                                        })
                                    }
                                    return 0
                                }
                            case 21519:
                                {
                                    if (!stream.tty)
                                        return -59;
                                    var argp = syscallGetVarargP();
                                    HEAP32[argp >> 2] = 0;
                                    return 0
                                }
                            case 21520:
                                {
                                    if (!stream.tty)
                                        return -59;
                                    return -28
                                }
                            case 21531:
                                {
                                    var argp = syscallGetVarargP();
                                    return FS.ioctl(stream, op, argp)
                                }
                            case 21523:
                                {
                                    if (!stream.tty)
                                        return -59;
                                    if (stream.tty.ops.ioctl_tiocgwinsz) {
                                        var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
                                        var argp = syscallGetVarargP();
                                        HEAP16[argp >> 1] = winsize[0];
                                        HEAP16[argp + 2 >> 1] = winsize[1]
                                    }
                                    return 0
                                }
                            case 21524:
                                {
                                    if (!stream.tty)
                                        return -59;
                                    return 0
                                }
                            case 21515:
                                {
                                    if (!stream.tty)
                                        return -59;
                                    return 0
                                }
                            default:
                                return -28
                            }
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    function ___syscall_listen(fd, backlog) {
                        try {
                            var sock = getSocketFromFD(fd);
                            sock.sock_ops.listen(sock, backlog);
                            return 0
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    function ___syscall_mkdirat(dirfd, path, mode) {
                        try {
                            path = SYSCALLS.getStr(path);
                            path = SYSCALLS.calculateAt(dirfd, path);
                            FS.mkdir(path, mode, 0);
                            return 0
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    function ___syscall_openat(dirfd, path, flags, varargs) {
                        SYSCALLS.varargs = varargs;
                        try {
                            path = SYSCALLS.getStr(path);
                            path = SYSCALLS.calculateAt(dirfd, path);
                            var mode = varargs ? syscallGetVarargI() : 0;
                            return FS.open(path, flags, mode).fd
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    function ___syscall_poll(fds, nfds, timeout) {
                        try {
                            var nonzero = 0;
                            for (var i = 0; i < nfds; i++) {
                                var pollfd = fds + 8 * i;
                                var fd = HEAP32[pollfd >> 2];
                                var events = HEAP16[pollfd + 4 >> 1];
                                var mask = 32;
                                var stream = FS.getStream(fd);
                                if (stream) {
                                    mask = SYSCALLS.DEFAULT_POLLMASK;
                                    if (stream.stream_ops.poll) {
                                        mask = stream.stream_ops.poll(stream, -1)
                                    }
                                }
                                mask &= events | 8 | 16;
                                if (mask)
                                    nonzero++;
                                HEAP16[pollfd + 6 >> 1] = mask
                            }
                            return nonzero
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
                        try {
                            path = SYSCALLS.getStr(path);
                            path = SYSCALLS.calculateAt(dirfd, path);
                            if (bufsize <= 0)
                                return -28;
                            var ret = FS.readlink(path);
                            var len = Math.min(bufsize, lengthBytesUTF8(ret));
                            var endChar = HEAP8[buf + len];
                            stringToUTF8(ret, buf, bufsize + 1);
                            HEAP8[buf + len] = endChar;
                            return len
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    function ___syscall_recvfrom(fd, buf, len, flags, addr, addrlen) {
                        try {
                            var sock = getSocketFromFD(fd);
                            var msg = sock.sock_ops.recvmsg(sock, len);
                            if (!msg)
                                return 0;
                            if (addr) {
                                var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(msg.addr), msg.port, addrlen)
                            }
                            HEAPU8.set(msg.buffer, buf);
                            return msg.buffer.byteLength
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
                        try {
                            oldpath = SYSCALLS.getStr(oldpath);
                            newpath = SYSCALLS.getStr(newpath);
                            oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
                            newpath = SYSCALLS.calculateAt(newdirfd, newpath);
                            FS.rename(oldpath, newpath);
                            return 0
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    function ___syscall_rmdir(path) {
                        try {
                            path = SYSCALLS.getStr(path);
                            FS.rmdir(path);
                            return 0
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    function ___syscall_sendto(fd, message, length, flags, addr, addr_len) {
                        try {
                            var sock = getSocketFromFD(fd);
                            if (!addr) {
                                return FS.write(sock.stream, HEAP8, message, length)
                            }
                            var dest = getSocketAddress(addr, addr_len);
                            return sock.sock_ops.sendmsg(sock, HEAP8, message, length, dest.addr, dest.port)
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    function ___syscall_socket(domain, type, protocol) {
                        try {
                            var sock = SOCKFS.createSocket(domain, type, protocol);
                            return sock.stream.fd
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    function ___syscall_stat64(path, buf) {
                        try {
                            path = SYSCALLS.getStr(path);
                            return SYSCALLS.writeStat(buf, FS.stat(path))
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    function ___syscall_unlinkat(dirfd, path, flags) {
                        try {
                            path = SYSCALLS.getStr(path);
                            path = SYSCALLS.calculateAt(dirfd, path);
                            if (flags === 0) {
                                FS.unlink(path)
                            } else if (flags === 512) {
                                FS.rmdir(path)
                            } else {
                                abort("Invalid flags passed to unlinkat")
                            }
                            return 0
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return -e.errno
                        }
                    }
                    var __abort_js = ()=>abort("");
                    var __emscripten_throw_longjmp = ()=>{
                        throw Infinity
                    }
                    ;
                    var isLeapYear = year=>year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
                    var MONTH_DAYS_LEAP_CUMULATIVE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
                    var MONTH_DAYS_REGULAR_CUMULATIVE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
                    var ydayFromDate = date=>{
                        var leap = isLeapYear(date.getFullYear());
                        var monthDaysCumulative = leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE;
                        var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
                        return yday
                    }
                    ;
                    function __localtime_js(time, tmPtr) {
                        time = bigintToI53Checked(time);
                        var date = new Date(time * 1e3);
                        HEAP32[tmPtr >> 2] = date.getSeconds();
                        HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
                        HEAP32[tmPtr + 8 >> 2] = date.getHours();
                        HEAP32[tmPtr + 12 >> 2] = date.getDate();
                        HEAP32[tmPtr + 16 >> 2] = date.getMonth();
                        HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
                        HEAP32[tmPtr + 24 >> 2] = date.getDay();
                        var yday = ydayFromDate(date) | 0;
                        HEAP32[tmPtr + 28 >> 2] = yday;
                        HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
                        var start = new Date(date.getFullYear(),0,1);
                        var summerOffset = new Date(date.getFullYear(),6,1).getTimezoneOffset();
                        var winterOffset = start.getTimezoneOffset();
                        var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
                        HEAP32[tmPtr + 32 >> 2] = dst
                    }
                    var __mktime_js = function(tmPtr) {
                        var ret = (()=>{
                            var date = new Date(HEAP32[tmPtr + 20 >> 2] + 1900,HEAP32[tmPtr + 16 >> 2],HEAP32[tmPtr + 12 >> 2],HEAP32[tmPtr + 8 >> 2],HEAP32[tmPtr + 4 >> 2],HEAP32[tmPtr >> 2],0);
                            var dst = HEAP32[tmPtr + 32 >> 2];
                            var guessedOffset = date.getTimezoneOffset();
                            var start = new Date(date.getFullYear(),0,1);
                            var summerOffset = new Date(date.getFullYear(),6,1).getTimezoneOffset();
                            var winterOffset = start.getTimezoneOffset();
                            var dstOffset = Math.min(winterOffset, summerOffset);
                            if (dst < 0) {
                                HEAP32[tmPtr + 32 >> 2] = Number(summerOffset != winterOffset && dstOffset == guessedOffset)
                            } else if (dst > 0 != (dstOffset == guessedOffset)) {
                                var nonDstOffset = Math.max(winterOffset, summerOffset);
                                var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
                                date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4)
                            }
                            HEAP32[tmPtr + 24 >> 2] = date.getDay();
                            var yday = ydayFromDate(date) | 0;
                            HEAP32[tmPtr + 28 >> 2] = yday;
                            HEAP32[tmPtr >> 2] = date.getSeconds();
                            HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
                            HEAP32[tmPtr + 8 >> 2] = date.getHours();
                            HEAP32[tmPtr + 12 >> 2] = date.getDate();
                            HEAP32[tmPtr + 16 >> 2] = date.getMonth();
                            HEAP32[tmPtr + 20 >> 2] = date.getYear();
                            var timeMs = date.getTime();
                            if (isNaN(timeMs)) {
                                return -1
                            }
                            return timeMs / 1e3
                        }
                        )();
                        return BigInt(ret)
                    };
                    var __tzset_js = (timezone,daylight,std_name,dst_name)=>{
                        var currentYear = (new Date).getFullYear();
                        var winter = new Date(currentYear,0,1);
                        var summer = new Date(currentYear,6,1);
                        var winterOffset = winter.getTimezoneOffset();
                        var summerOffset = summer.getTimezoneOffset();
                        var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
                        HEAPU32[timezone >> 2] = stdTimezoneOffset * 60;
                        HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
                        var extractZone = timezoneOffset=>{
                            var sign = timezoneOffset >= 0 ? "-" : "+";
                            var absOffset = Math.abs(timezoneOffset);
                            var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
                            var minutes = String(absOffset % 60).padStart(2, "0");
                            return `UTC${sign}${hours}${minutes}`
                        }
                        ;
                        var winterName = extractZone(winterOffset);
                        var summerName = extractZone(summerOffset);
                        if (summerOffset < winterOffset) {
                            stringToUTF8(winterName, std_name, 17);
                            stringToUTF8(summerName, dst_name, 17)
                        } else {
                            stringToUTF8(winterName, dst_name, 17);
                            stringToUTF8(summerName, std_name, 17)
                        }
                    }
                    ;
                    var _emscripten_set_main_loop_timing = (mode,value)=>{
                        MainLoop.timingMode = mode;
                        MainLoop.timingValue = value;
                        if (!MainLoop.func) {
                            return 1
                        }
                        if (!MainLoop.running) {
                            MainLoop.running = true
                        }
                        if (mode == 0) {
                            MainLoop.scheduler = function MainLoop_scheduler_setTimeout() {
                                var timeUntilNextTick = Math.max(0, MainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
                                setTimeout(MainLoop.runner, timeUntilNextTick)
                            }
                            ;
                            MainLoop.method = "timeout"
                        } else if (mode == 1) {
                            MainLoop.scheduler = function MainLoop_scheduler_rAF() {
                                MainLoop.requestAnimationFrame(MainLoop.runner)
                            }
                            ;
                            MainLoop.method = "rAF"
                        } else if (mode == 2) {
                            if (typeof MainLoop.setImmediate == "undefined") {
                                if (typeof setImmediate == "undefined") {
                                    var setImmediates = [];
                                    var emscriptenMainLoopMessageId = "setimmediate";
                                    var MainLoop_setImmediate_messageHandler = event=>{
                                        if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
                                            event.stopPropagation();
                                            setImmediates.shift()()
                                        }
                                    }
                                    ;
                                    addEventListener("message", MainLoop_setImmediate_messageHandler, true);
                                    MainLoop.setImmediate = func=>{
                                        setImmediates.push(func);
                                        if (ENVIRONMENT_IS_WORKER) {
                                            Module["setImmediates"] ??= [];
                                            Module["setImmediates"].push(func);
                                            postMessage({
                                                target: emscriptenMainLoopMessageId
                                            })
                                        } else
                                            postMessage(emscriptenMainLoopMessageId, "*")
                                    }
                                } else {
                                    MainLoop.setImmediate = setImmediate
                                }
                            }
                            MainLoop.scheduler = function MainLoop_scheduler_setImmediate() {
                                MainLoop.setImmediate(MainLoop.runner)
                            }
                            ;
                            MainLoop.method = "immediate"
                        }
                        return 0
                    }
                    ;
                    var _emscripten_get_now = ()=>performance.now();
                    var runtimeKeepaliveCounter = 0;
                    var keepRuntimeAlive = ()=>noExitRuntime || runtimeKeepaliveCounter > 0;
                    var _proc_exit = code=>{
                        EXITSTATUS = code;
                        if (!keepRuntimeAlive()) {
                            Module["onExit"]?.(code);
                            ABORT = true
                        }
                        quit_(code, new ExitStatus(code))
                    }
                    ;
                    var exitJS = (status,implicit)=>{
                        EXITSTATUS = status;
                        _proc_exit(status)
                    }
                    ;
                    var _exit = exitJS;
                    var handleException = e=>{
                        if (e instanceof ExitStatus || e == "unwind") {
                            return EXITSTATUS
                        }
                        quit_(1, e)
                    }
                    ;
                    var maybeExit = ()=>{
                        if (!keepRuntimeAlive()) {
                            try {
                                _exit(EXITSTATUS)
                            } catch (e) {
                                handleException(e)
                            }
                        }
                    }
                    ;
                    var setMainLoop = (iterFunc,fps,simulateInfiniteLoop,arg,noSetTiming)=>{
                        MainLoop.func = iterFunc;
                        MainLoop.arg = arg;
                        var thisMainLoopId = MainLoop.currentlyRunningMainloop;
                        function checkIsRunning() {
                            if (thisMainLoopId < MainLoop.currentlyRunningMainloop) {
                                maybeExit();
                                return false
                            }
                            return true
                        }
                        MainLoop.running = false;
                        MainLoop.runner = function MainLoop_runner() {
                            if (ABORT)
                                return;
                            if (MainLoop.queue.length > 0) {
                                var start = Date.now();
                                var blocker = MainLoop.queue.shift();
                                blocker.func(blocker.arg);
                                if (MainLoop.remainingBlockers) {
                                    var remaining = MainLoop.remainingBlockers;
                                    var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
                                    if (blocker.counted) {
                                        MainLoop.remainingBlockers = next
                                    } else {
                                        next = next + .5;
                                        MainLoop.remainingBlockers = (8 * remaining + next) / 9
                                    }
                                }
                                MainLoop.updateStatus();
                                if (!checkIsRunning())
                                    return;
                                setTimeout(MainLoop.runner, 0);
                                return
                            }
                            if (!checkIsRunning())
                                return;
                            MainLoop.currentFrameNumber = MainLoop.currentFrameNumber + 1 | 0;
                            if (MainLoop.timingMode == 1 && MainLoop.timingValue > 1 && MainLoop.currentFrameNumber % MainLoop.timingValue != 0) {
                                MainLoop.scheduler();
                                return
                            } else if (MainLoop.timingMode == 0) {
                                MainLoop.tickStartTime = _emscripten_get_now()
                            }
                            MainLoop.runIter(iterFunc);
                            if (!checkIsRunning())
                                return;
                            MainLoop.scheduler()
                        }
                        ;
                        if (!noSetTiming) {
                            if (fps > 0) {
                                _emscripten_set_main_loop_timing(0, 1e3 / fps)
                            } else {
                                _emscripten_set_main_loop_timing(1, 1)
                            }
                            MainLoop.scheduler()
                        }
                        if (simulateInfiniteLoop) {
                            throw "unwind"
                        }
                    }
                    ;
                    var callUserCallback = func=>{
                        if (ABORT) {
                            return
                        }
                        try {
                            func();
                            maybeExit()
                        } catch (e) {
                            handleException(e)
                        }
                    }
                    ;
                    var MainLoop = {
                        running: false,
                        scheduler: null,
                        method: "",
                        currentlyRunningMainloop: 0,
                        func: null,
                        arg: 0,
                        timingMode: 0,
                        timingValue: 0,
                        currentFrameNumber: 0,
                        queue: [],
                        preMainLoop: [],
                        postMainLoop: [],
                        pause() {
                            MainLoop.scheduler = null;
                            MainLoop.currentlyRunningMainloop++
                        },
                        resume() {
                            MainLoop.currentlyRunningMainloop++;
                            var timingMode = MainLoop.timingMode;
                            var timingValue = MainLoop.timingValue;
                            var func = MainLoop.func;
                            MainLoop.func = null;
                            setMainLoop(func, 0, false, MainLoop.arg, true);
                            _emscripten_set_main_loop_timing(timingMode, timingValue);
                            MainLoop.scheduler()
                        },
                        updateStatus() {
                            if (Module["setStatus"]) {
                                var message = Module["statusMessage"] || "Please wait...";
                                var remaining = MainLoop.remainingBlockers ?? 0;
                                var expected = MainLoop.expectedBlockers ?? 0;
                                if (remaining) {
                                    if (remaining < expected) {
                                        Module["setStatus"](`{message} ({expected - remaining}/{expected})`)
                                    } else {
                                        Module["setStatus"](message)
                                    }
                                } else {
                                    Module["setStatus"]("")
                                }
                            }
                        },
                        init() {
                            Module["preMainLoop"] && MainLoop.preMainLoop.push(Module["preMainLoop"]);
                            Module["postMainLoop"] && MainLoop.postMainLoop.push(Module["postMainLoop"])
                        },
                        runIter(func) {
                            if (ABORT)
                                return;
                            for (var pre of MainLoop.preMainLoop) {
                                if (pre() === false) {
                                    return
                                }
                            }
                            callUserCallback(func);
                            for (var post of MainLoop.postMainLoop) {
                                post()
                            }
                        },
                        nextRAF: 0,
                        fakeRequestAnimationFrame(func) {
                            var now = Date.now();
                            if (MainLoop.nextRAF === 0) {
                                MainLoop.nextRAF = now + 1e3 / 60
                            } else {
                                while (now + 2 >= MainLoop.nextRAF) {
                                    MainLoop.nextRAF += 1e3 / 60
                                }
                            }
                            var delay = Math.max(MainLoop.nextRAF - now, 0);
                            setTimeout(func, delay)
                        },
                        requestAnimationFrame(func) {
                            if (typeof requestAnimationFrame == "function") {
                                requestAnimationFrame(func);
                                return
                            }
                            var RAF = MainLoop.fakeRequestAnimationFrame;
                            RAF(func)
                        }
                    };
                    var AL = {
                        QUEUE_INTERVAL: 25,
                        QUEUE_LOOKAHEAD: .1,
                        DEVICE_NAME: "Emscripten OpenAL",
                        CAPTURE_DEVICE_NAME: "Emscripten OpenAL capture",
                        ALC_EXTENSIONS: {
                            ALC_SOFT_pause_device: true,
                            ALC_SOFT_HRTF: true
                        },
                        AL_EXTENSIONS: {
                            AL_EXT_float32: true,
                            AL_SOFT_loop_points: true,
                            AL_SOFT_source_length: true,
                            AL_EXT_source_distance_model: true,
                            AL_SOFT_source_spatialize: true
                        },
                        _alcErr: 0,
                        alcErr: 0,
                        deviceRefCounts: {},
                        alcStringCache: {},
                        paused: false,
                        stringCache: {},
                        contexts: {},
                        currentCtx: null,
                        buffers: {
                            0: {
                                id: 0,
                                refCount: 0,
                                audioBuf: null,
                                frequency: 0,
                                bytesPerSample: 2,
                                channels: 1,
                                length: 0
                            }
                        },
                        paramArray: [],
                        _nextId: 1,
                        newId: ()=>AL.freeIds.length > 0 ? AL.freeIds.pop() : AL._nextId++,
                        freeIds: [],
                        scheduleContextAudio: ctx=>{
                            if (MainLoop.timingMode === 1 && document["visibilityState"] != "visible") {
                                return
                            }
                            for (var i in ctx.sources) {
                                AL.scheduleSourceAudio(ctx.sources[i])
                            }
                        }
                        ,
                        scheduleSourceAudio: (src,lookahead)=>{
                            if (MainLoop.timingMode === 1 && document["visibilityState"] != "visible") {
                                return
                            }
                            if (src.state !== 4114) {
                                return
                            }
                            var currentTime = AL.updateSourceTime(src);
                            var startTime = src.bufStartTime;
                            var startOffset = src.bufOffset;
                            var bufCursor = src.bufsProcessed;
                            for (var i = 0; i < src.audioQueue.length; i++) {
                                var audioSrc = src.audioQueue[i];
                                startTime = audioSrc._startTime + audioSrc._duration;
                                startOffset = 0;
                                bufCursor += audioSrc._skipCount + 1
                            }
                            if (!lookahead) {
                                lookahead = AL.QUEUE_LOOKAHEAD
                            }
                            var lookaheadTime = currentTime + lookahead;
                            var skipCount = 0;
                            while (startTime < lookaheadTime) {
                                if (bufCursor >= src.bufQueue.length) {
                                    if (src.looping) {
                                        bufCursor %= src.bufQueue.length
                                    } else {
                                        break
                                    }
                                }
                                var buf = src.bufQueue[bufCursor % src.bufQueue.length];
                                if (buf.length === 0) {
                                    skipCount++;
                                    if (skipCount === src.bufQueue.length) {
                                        break
                                    }
                                } else {
                                    var audioSrc = src.context.audioCtx.createBufferSource();
                                    audioSrc.buffer = buf.audioBuf;
                                    audioSrc.playbackRate.value = src.playbackRate;
                                    if (buf.audioBuf._loopStart || buf.audioBuf._loopEnd) {
                                        audioSrc.loopStart = buf.audioBuf._loopStart;
                                        audioSrc.loopEnd = buf.audioBuf._loopEnd
                                    }
                                    var duration = 0;
                                    if (src.type === 4136 && src.looping) {
                                        duration = Number.POSITIVE_INFINITY;
                                        audioSrc.loop = true;
                                        if (buf.audioBuf._loopStart) {
                                            audioSrc.loopStart = buf.audioBuf._loopStart
                                        }
                                        if (buf.audioBuf._loopEnd) {
                                            audioSrc.loopEnd = buf.audioBuf._loopEnd
                                        }
                                    } else {
                                        duration = (buf.audioBuf.duration - startOffset) / src.playbackRate
                                    }
                                    audioSrc._startOffset = startOffset;
                                    audioSrc._duration = duration;
                                    audioSrc._skipCount = skipCount;
                                    skipCount = 0;
                                    audioSrc.connect(src.gain);
                                    if (typeof audioSrc.start != "undefined") {
                                        startTime = Math.max(startTime, src.context.audioCtx.currentTime);
                                        audioSrc.start(startTime, startOffset)
                                    } else if (typeof audioSrc.noteOn != "undefined") {
                                        startTime = Math.max(startTime, src.context.audioCtx.currentTime);
                                        audioSrc.noteOn(startTime)
                                    }
                                    audioSrc._startTime = startTime;
                                    src.audioQueue.push(audioSrc);
                                    startTime += duration
                                }
                                startOffset = 0;
                                bufCursor++
                            }
                        }
                        ,
                        updateSourceTime: src=>{
                            var currentTime = src.context.audioCtx.currentTime;
                            if (src.state !== 4114) {
                                return currentTime
                            }
                            if (!isFinite(src.bufStartTime)) {
                                src.bufStartTime = currentTime - src.bufOffset / src.playbackRate;
                                src.bufOffset = 0
                            }
                            var nextStartTime = 0;
                            while (src.audioQueue.length) {
                                var audioSrc = src.audioQueue[0];
                                src.bufsProcessed += audioSrc._skipCount;
                                nextStartTime = audioSrc._startTime + audioSrc._duration;
                                if (currentTime < nextStartTime) {
                                    break
                                }
                                src.audioQueue.shift();
                                src.bufStartTime = nextStartTime;
                                src.bufOffset = 0;
                                src.bufsProcessed++
                            }
                            if (src.bufsProcessed >= src.bufQueue.length && !src.looping) {
                                AL.setSourceState(src, 4116)
                            } else if (src.type === 4136 && src.looping) {
                                var buf = src.bufQueue[0];
                                if (buf.length === 0) {
                                    src.bufOffset = 0
                                } else {
                                    var delta = (currentTime - src.bufStartTime) * src.playbackRate;
                                    var loopStart = buf.audioBuf._loopStart || 0;
                                    var loopEnd = buf.audioBuf._loopEnd || buf.audioBuf.duration;
                                    if (loopEnd <= loopStart) {
                                        loopEnd = buf.audioBuf.duration
                                    }
                                    if (delta < loopEnd) {
                                        src.bufOffset = delta
                                    } else {
                                        src.bufOffset = loopStart + (delta - loopStart) % (loopEnd - loopStart)
                                    }
                                }
                            } else if (src.audioQueue[0]) {
                                src.bufOffset = (currentTime - src.audioQueue[0]._startTime) * src.playbackRate
                            } else {
                                if (src.type !== 4136 && src.looping) {
                                    var srcDuration = AL.sourceDuration(src) / src.playbackRate;
                                    if (srcDuration > 0) {
                                        src.bufStartTime += Math.floor((currentTime - src.bufStartTime) / srcDuration) * srcDuration
                                    }
                                }
                                for (var i = 0; i < src.bufQueue.length; i++) {
                                    if (src.bufsProcessed >= src.bufQueue.length) {
                                        if (src.looping) {
                                            src.bufsProcessed %= src.bufQueue.length
                                        } else {
                                            AL.setSourceState(src, 4116);
                                            break
                                        }
                                    }
                                    var buf = src.bufQueue[src.bufsProcessed];
                                    if (buf.length > 0) {
                                        nextStartTime = src.bufStartTime + buf.audioBuf.duration / src.playbackRate;
                                        if (currentTime < nextStartTime) {
                                            src.bufOffset = (currentTime - src.bufStartTime) * src.playbackRate;
                                            break
                                        }
                                        src.bufStartTime = nextStartTime
                                    }
                                    src.bufOffset = 0;
                                    src.bufsProcessed++
                                }
                            }
                            return currentTime
                        }
                        ,
                        cancelPendingSourceAudio: src=>{
                            AL.updateSourceTime(src);
                            for (var i = 1; i < src.audioQueue.length; i++) {
                                var audioSrc = src.audioQueue[i];
                                audioSrc.stop()
                            }
                            if (src.audioQueue.length > 1) {
                                src.audioQueue.length = 1
                            }
                        }
                        ,
                        stopSourceAudio: src=>{
                            for (var i = 0; i < src.audioQueue.length; i++) {
                                src.audioQueue[i].stop()
                            }
                            src.audioQueue.length = 0
                        }
                        ,
                        setSourceState: (src,state)=>{
                            if (state === 4114) {
                                if (src.state === 4114 || src.state == 4116) {
                                    src.bufsProcessed = 0;
                                    src.bufOffset = 0
                                } else {}
                                AL.stopSourceAudio(src);
                                src.state = 4114;
                                src.bufStartTime = Number.NEGATIVE_INFINITY;
                                AL.scheduleSourceAudio(src)
                            } else if (state === 4115) {
                                if (src.state === 4114) {
                                    AL.updateSourceTime(src);
                                    AL.stopSourceAudio(src);
                                    src.state = 4115
                                }
                            } else if (state === 4116) {
                                if (src.state !== 4113) {
                                    src.state = 4116;
                                    src.bufsProcessed = src.bufQueue.length;
                                    src.bufStartTime = Number.NEGATIVE_INFINITY;
                                    src.bufOffset = 0;
                                    AL.stopSourceAudio(src)
                                }
                            } else if (state === 4113) {
                                if (src.state !== 4113) {
                                    src.state = 4113;
                                    src.bufsProcessed = 0;
                                    src.bufStartTime = Number.NEGATIVE_INFINITY;
                                    src.bufOffset = 0;
                                    AL.stopSourceAudio(src)
                                }
                            }
                        }
                        ,
                        initSourcePanner: src=>{
                            if (src.type === 4144) {
                                return
                            }
                            var templateBuf = AL.buffers[0];
                            for (var i = 0; i < src.bufQueue.length; i++) {
                                if (src.bufQueue[i].id !== 0) {
                                    templateBuf = src.bufQueue[i];
                                    break
                                }
                            }
                            if (src.spatialize === 1 || src.spatialize === 2 && templateBuf.channels === 1) {
                                if (src.panner) {
                                    return
                                }
                                src.panner = src.context.audioCtx.createPanner();
                                AL.updateSourceGlobal(src);
                                AL.updateSourceSpace(src);
                                src.panner.connect(src.context.gain);
                                src.gain.disconnect();
                                src.gain.connect(src.panner)
                            } else {
                                if (!src.panner) {
                                    return
                                }
                                src.panner.disconnect();
                                src.gain.disconnect();
                                src.gain.connect(src.context.gain);
                                src.panner = null
                            }
                        }
                        ,
                        updateContextGlobal: ctx=>{
                            for (var i in ctx.sources) {
                                AL.updateSourceGlobal(ctx.sources[i])
                            }
                        }
                        ,
                        updateSourceGlobal: src=>{
                            var panner = src.panner;
                            if (!panner) {
                                return
                            }
                            panner.refDistance = src.refDistance;
                            panner.maxDistance = src.maxDistance;
                            panner.rolloffFactor = src.rolloffFactor;
                            panner.panningModel = src.context.hrtf ? "HRTF" : "equalpower";
                            var distanceModel = src.context.sourceDistanceModel ? src.distanceModel : src.context.distanceModel;
                            switch (distanceModel) {
                            case 0:
                                panner.distanceModel = "inverse";
                                panner.refDistance = 340282e33;
                                break;
                            case 53249:
                            case 53250:
                                panner.distanceModel = "inverse";
                                break;
                            case 53251:
                            case 53252:
                                panner.distanceModel = "linear";
                                break;
                            case 53253:
                            case 53254:
                                panner.distanceModel = "exponential";
                                break
                            }
                        }
                        ,
                        updateListenerSpace: ctx=>{
                            var listener = ctx.audioCtx.listener;
                            if (listener.positionX) {
                                listener.positionX.value = ctx.listener.position[0];
                                listener.positionY.value = ctx.listener.position[1];
                                listener.positionZ.value = ctx.listener.position[2]
                            } else {
                                listener.setPosition(ctx.listener.position[0], ctx.listener.position[1], ctx.listener.position[2])
                            }
                            if (listener.forwardX) {
                                listener.forwardX.value = ctx.listener.direction[0];
                                listener.forwardY.value = ctx.listener.direction[1];
                                listener.forwardZ.value = ctx.listener.direction[2];
                                listener.upX.value = ctx.listener.up[0];
                                listener.upY.value = ctx.listener.up[1];
                                listener.upZ.value = ctx.listener.up[2]
                            } else {
                                listener.setOrientation(ctx.listener.direction[0], ctx.listener.direction[1], ctx.listener.direction[2], ctx.listener.up[0], ctx.listener.up[1], ctx.listener.up[2])
                            }
                            for (var i in ctx.sources) {
                                AL.updateSourceSpace(ctx.sources[i])
                            }
                        }
                        ,
                        updateSourceSpace: src=>{
                            if (!src.panner) {
                                return
                            }
                            var panner = src.panner;
                            var posX = src.position[0];
                            var posY = src.position[1];
                            var posZ = src.position[2];
                            var dirX = src.direction[0];
                            var dirY = src.direction[1];
                            var dirZ = src.direction[2];
                            var listener = src.context.listener;
                            var lPosX = listener.position[0];
                            var lPosY = listener.position[1];
                            var lPosZ = listener.position[2];
                            if (src.relative) {
                                var lBackX = -listener.direction[0];
                                var lBackY = -listener.direction[1];
                                var lBackZ = -listener.direction[2];
                                var lUpX = listener.up[0];
                                var lUpY = listener.up[1];
                                var lUpZ = listener.up[2];
                                var inverseMagnitude = (x,y,z)=>{
                                    var length = Math.sqrt(x * x + y * y + z * z);
                                    if (length < Number.EPSILON) {
                                        return 0
                                    }
                                    return 1 / length
                                }
                                ;
                                var invMag = inverseMagnitude(lBackX, lBackY, lBackZ);
                                lBackX *= invMag;
                                lBackY *= invMag;
                                lBackZ *= invMag;
                                invMag = inverseMagnitude(lUpX, lUpY, lUpZ);
                                lUpX *= invMag;
                                lUpY *= invMag;
                                lUpZ *= invMag;
                                var lRightX = lUpY * lBackZ - lUpZ * lBackY;
                                var lRightY = lUpZ * lBackX - lUpX * lBackZ;
                                var lRightZ = lUpX * lBackY - lUpY * lBackX;
                                invMag = inverseMagnitude(lRightX, lRightY, lRightZ);
                                lRightX *= invMag;
                                lRightY *= invMag;
                                lRightZ *= invMag;
                                lUpX = lBackY * lRightZ - lBackZ * lRightY;
                                lUpY = lBackZ * lRightX - lBackX * lRightZ;
                                lUpZ = lBackX * lRightY - lBackY * lRightX;
                                var oldX = dirX;
                                var oldY = dirY;
                                var oldZ = dirZ;
                                dirX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
                                dirY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
                                dirZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
                                oldX = posX;
                                oldY = posY;
                                oldZ = posZ;
                                posX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
                                posY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
                                posZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
                                posX += lPosX;
                                posY += lPosY;
                                posZ += lPosZ
                            }
                            if (panner.positionX) {
                                if (posX != panner.positionX.value)
                                    panner.positionX.value = posX;
                                if (posY != panner.positionY.value)
                                    panner.positionY.value = posY;
                                if (posZ != panner.positionZ.value)
                                    panner.positionZ.value = posZ
                            } else {
                                panner.setPosition(posX, posY, posZ)
                            }
                            if (panner.orientationX) {
                                if (dirX != panner.orientationX.value)
                                    panner.orientationX.value = dirX;
                                if (dirY != panner.orientationY.value)
                                    panner.orientationY.value = dirY;
                                if (dirZ != panner.orientationZ.value)
                                    panner.orientationZ.value = dirZ
                            } else {
                                panner.setOrientation(dirX, dirY, dirZ)
                            }
                            var oldShift = src.dopplerShift;
                            var velX = src.velocity[0];
                            var velY = src.velocity[1];
                            var velZ = src.velocity[2];
                            var lVelX = listener.velocity[0];
                            var lVelY = listener.velocity[1];
                            var lVelZ = listener.velocity[2];
                            if (posX === lPosX && posY === lPosY && posZ === lPosZ || velX === lVelX && velY === lVelY && velZ === lVelZ) {
                                src.dopplerShift = 1
                            } else {
                                var speedOfSound = src.context.speedOfSound;
                                var dopplerFactor = src.context.dopplerFactor;
                                var slX = lPosX - posX;
                                var slY = lPosY - posY;
                                var slZ = lPosZ - posZ;
                                var magSl = Math.sqrt(slX * slX + slY * slY + slZ * slZ);
                                var vls = (slX * lVelX + slY * lVelY + slZ * lVelZ) / magSl;
                                var vss = (slX * velX + slY * velY + slZ * velZ) / magSl;
                                vls = Math.min(vls, speedOfSound / dopplerFactor);
                                vss = Math.min(vss, speedOfSound / dopplerFactor);
                                src.dopplerShift = (speedOfSound - dopplerFactor * vls) / (speedOfSound - dopplerFactor * vss)
                            }
                            if (src.dopplerShift !== oldShift) {
                                AL.updateSourceRate(src)
                            }
                        }
                        ,
                        updateSourceRate: src=>{
                            if (src.state === 4114) {
                                AL.cancelPendingSourceAudio(src);
                                var audioSrc = src.audioQueue[0];
                                if (!audioSrc) {
                                    return
                                }
                                var duration;
                                if (src.type === 4136 && src.looping) {
                                    duration = Number.POSITIVE_INFINITY
                                } else {
                                    duration = (audioSrc.buffer.duration - audioSrc._startOffset) / src.playbackRate
                                }
                                audioSrc._duration = duration;
                                audioSrc.playbackRate.value = src.playbackRate;
                                AL.scheduleSourceAudio(src)
                            }
                        }
                        ,
                        sourceDuration: src=>{
                            var length = 0;
                            for (var i = 0; i < src.bufQueue.length; i++) {
                                var audioBuf = src.bufQueue[i].audioBuf;
                                length += audioBuf ? audioBuf.duration : 0
                            }
                            return length
                        }
                        ,
                        sourceTell: src=>{
                            AL.updateSourceTime(src);
                            var offset = 0;
                            for (var i = 0; i < src.bufsProcessed; i++) {
                                if (src.bufQueue[i].audioBuf) {
                                    offset += src.bufQueue[i].audioBuf.duration
                                }
                            }
                            offset += src.bufOffset;
                            return offset
                        }
                        ,
                        sourceSeek: (src,offset)=>{
                            var playing = src.state == 4114;
                            if (playing) {
                                AL.setSourceState(src, 4113)
                            }
                            if (src.bufQueue[src.bufsProcessed].audioBuf !== null) {
                                src.bufsProcessed = 0;
                                while (offset > src.bufQueue[src.bufsProcessed].audioBuf.duration) {
                                    offset -= src.bufQueue[src.bufsProcessed].audioBuf.duration;
                                    src.bufsProcessed++
                                }
                                src.bufOffset = offset
                            }
                            if (playing) {
                                AL.setSourceState(src, 4114)
                            }
                        }
                        ,
                        getGlobalParam: (funcname,param)=>{
                            if (!AL.currentCtx) {
                                return null
                            }
                            switch (param) {
                            case 49152:
                                return AL.currentCtx.dopplerFactor;
                            case 49155:
                                return AL.currentCtx.speedOfSound;
                            case 53248:
                                return AL.currentCtx.distanceModel;
                            default:
                                AL.currentCtx.err = 40962;
                                return null
                            }
                        }
                        ,
                        setGlobalParam: (funcname,param,value)=>{
                            if (!AL.currentCtx) {
                                return
                            }
                            switch (param) {
                            case 49152:
                                if (!Number.isFinite(value) || value < 0) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                AL.currentCtx.dopplerFactor = value;
                                AL.updateListenerSpace(AL.currentCtx);
                                break;
                            case 49155:
                                if (!Number.isFinite(value) || value <= 0) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                AL.currentCtx.speedOfSound = value;
                                AL.updateListenerSpace(AL.currentCtx);
                                break;
                            case 53248:
                                switch (value) {
                                case 0:
                                case 53249:
                                case 53250:
                                case 53251:
                                case 53252:
                                case 53253:
                                case 53254:
                                    AL.currentCtx.distanceModel = value;
                                    AL.updateContextGlobal(AL.currentCtx);
                                    break;
                                default:
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                break;
                            default:
                                AL.currentCtx.err = 40962;
                                return
                            }
                        }
                        ,
                        getListenerParam: (funcname,param)=>{
                            if (!AL.currentCtx) {
                                return null
                            }
                            switch (param) {
                            case 4100:
                                return AL.currentCtx.listener.position;
                            case 4102:
                                return AL.currentCtx.listener.velocity;
                            case 4111:
                                return AL.currentCtx.listener.direction.concat(AL.currentCtx.listener.up);
                            case 4106:
                                return AL.currentCtx.gain.gain.value;
                            default:
                                AL.currentCtx.err = 40962;
                                return null
                            }
                        }
                        ,
                        setListenerParam: (funcname,param,value)=>{
                            if (!AL.currentCtx) {
                                return
                            }
                            if (value === null) {
                                AL.currentCtx.err = 40962;
                                return
                            }
                            var listener = AL.currentCtx.listener;
                            switch (param) {
                            case 4100:
                                if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                listener.position[0] = value[0];
                                listener.position[1] = value[1];
                                listener.position[2] = value[2];
                                AL.updateListenerSpace(AL.currentCtx);
                                break;
                            case 4102:
                                if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                listener.velocity[0] = value[0];
                                listener.velocity[1] = value[1];
                                listener.velocity[2] = value[2];
                                AL.updateListenerSpace(AL.currentCtx);
                                break;
                            case 4106:
                                if (!Number.isFinite(value) || value < 0) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                AL.currentCtx.gain.gain.value = value;
                                break;
                            case 4111:
                                if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2]) || !Number.isFinite(value[3]) || !Number.isFinite(value[4]) || !Number.isFinite(value[5])) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                listener.direction[0] = value[0];
                                listener.direction[1] = value[1];
                                listener.direction[2] = value[2];
                                listener.up[0] = value[3];
                                listener.up[1] = value[4];
                                listener.up[2] = value[5];
                                AL.updateListenerSpace(AL.currentCtx);
                                break;
                            default:
                                AL.currentCtx.err = 40962;
                                return
                            }
                        }
                        ,
                        getBufferParam: (funcname,bufferId,param)=>{
                            if (!AL.currentCtx) {
                                return
                            }
                            var buf = AL.buffers[bufferId];
                            if (!buf || bufferId === 0) {
                                AL.currentCtx.err = 40961;
                                return
                            }
                            switch (param) {
                            case 8193:
                                return buf.frequency;
                            case 8194:
                                return buf.bytesPerSample * 8;
                            case 8195:
                                return buf.channels;
                            case 8196:
                                return buf.length * buf.bytesPerSample * buf.channels;
                            case 8213:
                                if (buf.length === 0) {
                                    return [0, 0]
                                }
                                return [(buf.audioBuf._loopStart || 0) * buf.frequency, (buf.audioBuf._loopEnd || buf.length) * buf.frequency];
                            default:
                                AL.currentCtx.err = 40962;
                                return null
                            }
                        }
                        ,
                        setBufferParam: (funcname,bufferId,param,value)=>{
                            if (!AL.currentCtx) {
                                return
                            }
                            var buf = AL.buffers[bufferId];
                            if (!buf || bufferId === 0) {
                                AL.currentCtx.err = 40961;
                                return
                            }
                            if (value === null) {
                                AL.currentCtx.err = 40962;
                                return
                            }
                            switch (param) {
                            case 8196:
                                if (value !== 0) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                break;
                            case 8213:
                                if (value[0] < 0 || value[0] > buf.length || value[1] < 0 || value[1] > buf.Length || value[0] >= value[1]) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                if (buf.refCount > 0) {
                                    AL.currentCtx.err = 40964;
                                    return
                                }
                                if (buf.audioBuf) {
                                    buf.audioBuf._loopStart = value[0] / buf.frequency;
                                    buf.audioBuf._loopEnd = value[1] / buf.frequency
                                }
                                break;
                            default:
                                AL.currentCtx.err = 40962;
                                return
                            }
                        }
                        ,
                        getSourceParam: (funcname,sourceId,param)=>{
                            if (!AL.currentCtx) {
                                return null
                            }
                            var src = AL.currentCtx.sources[sourceId];
                            if (!src) {
                                AL.currentCtx.err = 40961;
                                return null
                            }
                            switch (param) {
                            case 514:
                                return src.relative;
                            case 4097:
                                return src.coneInnerAngle;
                            case 4098:
                                return src.coneOuterAngle;
                            case 4099:
                                return src.pitch;
                            case 4100:
                                return src.position;
                            case 4101:
                                return src.direction;
                            case 4102:
                                return src.velocity;
                            case 4103:
                                return src.looping;
                            case 4105:
                                if (src.type === 4136) {
                                    return src.bufQueue[0].id
                                }
                                return 0;
                            case 4106:
                                return src.gain.gain.value;
                            case 4109:
                                return src.minGain;
                            case 4110:
                                return src.maxGain;
                            case 4112:
                                return src.state;
                            case 4117:
                                if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0) {
                                    return 0
                                }
                                return src.bufQueue.length;
                            case 4118:
                                if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0 || src.looping) {
                                    return 0
                                }
                                return src.bufsProcessed;
                            case 4128:
                                return src.refDistance;
                            case 4129:
                                return src.rolloffFactor;
                            case 4130:
                                return src.coneOuterGain;
                            case 4131:
                                return src.maxDistance;
                            case 4132:
                                return AL.sourceTell(src);
                            case 4133:
                                var offset = AL.sourceTell(src);
                                if (offset > 0) {
                                    offset *= src.bufQueue[0].frequency
                                }
                                return offset;
                            case 4134:
                                var offset = AL.sourceTell(src);
                                if (offset > 0) {
                                    offset *= src.bufQueue[0].frequency * src.bufQueue[0].bytesPerSample
                                }
                                return offset;
                            case 4135:
                                return src.type;
                            case 4628:
                                return src.spatialize;
                            case 8201:
                                var length = 0;
                                var bytesPerFrame = 0;
                                for (var i = 0; i < src.bufQueue.length; i++) {
                                    length += src.bufQueue[i].length;
                                    if (src.bufQueue[i].id !== 0) {
                                        bytesPerFrame = src.bufQueue[i].bytesPerSample * src.bufQueue[i].channels
                                    }
                                }
                                return length * bytesPerFrame;
                            case 8202:
                                var length = 0;
                                for (var i = 0; i < src.bufQueue.length; i++) {
                                    length += src.bufQueue[i].length
                                }
                                return length;
                            case 8203:
                                return AL.sourceDuration(src);
                            case 53248:
                                return src.distanceModel;
                            default:
                                AL.currentCtx.err = 40962;
                                return null
                            }
                        }
                        ,
                        setSourceParam: (funcname,sourceId,param,value)=>{
                            if (!AL.currentCtx) {
                                return
                            }
                            var src = AL.currentCtx.sources[sourceId];
                            if (!src) {
                                AL.currentCtx.err = 40961;
                                return
                            }
                            if (value === null) {
                                AL.currentCtx.err = 40962;
                                return
                            }
                            switch (param) {
                            case 514:
                                if (value === 1) {
                                    src.relative = true;
                                    AL.updateSourceSpace(src)
                                } else if (value === 0) {
                                    src.relative = false;
                                    AL.updateSourceSpace(src)
                                } else {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                break;
                            case 4097:
                                if (!Number.isFinite(value)) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                src.coneInnerAngle = value;
                                if (src.panner) {
                                    src.panner.coneInnerAngle = value % 360
                                }
                                break;
                            case 4098:
                                if (!Number.isFinite(value)) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                src.coneOuterAngle = value;
                                if (src.panner) {
                                    src.panner.coneOuterAngle = value % 360
                                }
                                break;
                            case 4099:
                                if (!Number.isFinite(value) || value <= 0) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                if (src.pitch === value) {
                                    break
                                }
                                src.pitch = value;
                                AL.updateSourceRate(src);
                                break;
                            case 4100:
                                if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                src.position[0] = value[0];
                                src.position[1] = value[1];
                                src.position[2] = value[2];
                                AL.updateSourceSpace(src);
                                break;
                            case 4101:
                                if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                src.direction[0] = value[0];
                                src.direction[1] = value[1];
                                src.direction[2] = value[2];
                                AL.updateSourceSpace(src);
                                break;
                            case 4102:
                                if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                src.velocity[0] = value[0];
                                src.velocity[1] = value[1];
                                src.velocity[2] = value[2];
                                AL.updateSourceSpace(src);
                                break;
                            case 4103:
                                if (value === 1) {
                                    src.looping = true;
                                    AL.updateSourceTime(src);
                                    if (src.type === 4136 && src.audioQueue.length > 0) {
                                        var audioSrc = src.audioQueue[0];
                                        audioSrc.loop = true;
                                        audioSrc._duration = Number.POSITIVE_INFINITY
                                    }
                                } else if (value === 0) {
                                    src.looping = false;
                                    var currentTime = AL.updateSourceTime(src);
                                    if (src.type === 4136 && src.audioQueue.length > 0) {
                                        var audioSrc = src.audioQueue[0];
                                        audioSrc.loop = false;
                                        audioSrc._duration = src.bufQueue[0].audioBuf.duration / src.playbackRate;
                                        audioSrc._startTime = currentTime - src.bufOffset / src.playbackRate
                                    }
                                } else {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                break;
                            case 4105:
                                if (src.state === 4114 || src.state === 4115) {
                                    AL.currentCtx.err = 40964;
                                    return
                                }
                                if (value === 0) {
                                    for (var i in src.bufQueue) {
                                        src.bufQueue[i].refCount--
                                    }
                                    src.bufQueue.length = 1;
                                    src.bufQueue[0] = AL.buffers[0];
                                    src.bufsProcessed = 0;
                                    src.type = 4144
                                } else {
                                    var buf = AL.buffers[value];
                                    if (!buf) {
                                        AL.currentCtx.err = 40963;
                                        return
                                    }
                                    for (var i in src.bufQueue) {
                                        src.bufQueue[i].refCount--
                                    }
                                    src.bufQueue.length = 0;
                                    buf.refCount++;
                                    src.bufQueue = [buf];
                                    src.bufsProcessed = 0;
                                    src.type = 4136
                                }
                                AL.initSourcePanner(src);
                                AL.scheduleSourceAudio(src);
                                break;
                            case 4106:
                                if (!Number.isFinite(value) || value < 0) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                src.gain.gain.value = value;
                                break;
                            case 4109:
                                if (!Number.isFinite(value) || value < 0 || value > Math.min(src.maxGain, 1)) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                src.minGain = value;
                                break;
                            case 4110:
                                if (!Number.isFinite(value) || value < Math.max(0, src.minGain) || value > 1) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                src.maxGain = value;
                                break;
                            case 4128:
                                if (!Number.isFinite(value) || value < 0) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                src.refDistance = value;
                                if (src.panner) {
                                    src.panner.refDistance = value
                                }
                                break;
                            case 4129:
                                if (!Number.isFinite(value) || value < 0) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                src.rolloffFactor = value;
                                if (src.panner) {
                                    src.panner.rolloffFactor = value
                                }
                                break;
                            case 4130:
                                if (!Number.isFinite(value) || value < 0 || value > 1) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                src.coneOuterGain = value;
                                if (src.panner) {
                                    src.panner.coneOuterGain = value
                                }
                                break;
                            case 4131:
                                if (!Number.isFinite(value) || value < 0) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                src.maxDistance = value;
                                if (src.panner) {
                                    src.panner.maxDistance = value
                                }
                                break;
                            case 4132:
                                if (value < 0 || value > AL.sourceDuration(src)) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                AL.sourceSeek(src, value);
                                break;
                            case 4133:
                                var srcLen = AL.sourceDuration(src);
                                if (srcLen > 0) {
                                    var frequency;
                                    for (var bufId in src.bufQueue) {
                                        if (bufId) {
                                            frequency = src.bufQueue[bufId].frequency;
                                            break
                                        }
                                    }
                                    value /= frequency
                                }
                                if (value < 0 || value > srcLen) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                AL.sourceSeek(src, value);
                                break;
                            case 4134:
                                var srcLen = AL.sourceDuration(src);
                                if (srcLen > 0) {
                                    var bytesPerSec;
                                    for (var bufId in src.bufQueue) {
                                        if (bufId) {
                                            var buf = src.bufQueue[bufId];
                                            bytesPerSec = buf.frequency * buf.bytesPerSample * buf.channels;
                                            break
                                        }
                                    }
                                    value /= bytesPerSec
                                }
                                if (value < 0 || value > srcLen) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                AL.sourceSeek(src, value);
                                break;
                            case 4628:
                                if (value !== 0 && value !== 1 && value !== 2) {
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                src.spatialize = value;
                                AL.initSourcePanner(src);
                                break;
                            case 8201:
                            case 8202:
                            case 8203:
                                AL.currentCtx.err = 40964;
                                break;
                            case 53248:
                                switch (value) {
                                case 0:
                                case 53249:
                                case 53250:
                                case 53251:
                                case 53252:
                                case 53253:
                                case 53254:
                                    src.distanceModel = value;
                                    if (AL.currentCtx.sourceDistanceModel) {
                                        AL.updateContextGlobal(AL.currentCtx)
                                    }
                                    break;
                                default:
                                    AL.currentCtx.err = 40963;
                                    return
                                }
                                break;
                            default:
                                AL.currentCtx.err = 40962;
                                return
                            }
                        }
                        ,
                        captures: {},
                        sharedCaptureAudioCtx: null,
                        requireValidCaptureDevice: (deviceId,funcname)=>{
                            if (deviceId === 0) {
                                AL.alcErr = 40961;
                                return null
                            }
                            var c = AL.captures[deviceId];
                            if (!c) {
                                AL.alcErr = 40961;
                                return null
                            }
                            var err = c.mediaStreamError;
                            if (err) {
                                AL.alcErr = 40961;
                                return null
                            }
                            return c
                        }
                    };
                    var _alBufferData = (bufferId,format,pData,size,freq)=>{
                        if (!AL.currentCtx) {
                            return
                        }
                        var buf = AL.buffers[bufferId];
                        if (!buf) {
                            AL.currentCtx.err = 40963;
                            return
                        }
                        if (freq <= 0) {
                            AL.currentCtx.err = 40963;
                            return
                        }
                        var audioBuf = null;
                        try {
                            switch (format) {
                            case 4352:
                                if (size > 0) {
                                    audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size, freq);
                                    var channel0 = audioBuf.getChannelData(0);
                                    for (var i = 0; i < size; ++i) {
                                        channel0[i] = HEAPU8[pData++] * .0078125 - 1
                                    }
                                }
                                buf.bytesPerSample = 1;
                                buf.channels = 1;
                                buf.length = size;
                                break;
                            case 4353:
                                if (size > 0) {
                                    audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size >> 1, freq);
                                    var channel0 = audioBuf.getChannelData(0);
                                    pData >>= 1;
                                    for (var i = 0; i < size >> 1; ++i) {
                                        channel0[i] = HEAP16[pData++] * 30517578125e-15
                                    }
                                }
                                buf.bytesPerSample = 2;
                                buf.channels = 1;
                                buf.length = size >> 1;
                                break;
                            case 4354:
                                if (size > 0) {
                                    audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 1, freq);
                                    var channel0 = audioBuf.getChannelData(0);
                                    var channel1 = audioBuf.getChannelData(1);
                                    for (var i = 0; i < size >> 1; ++i) {
                                        channel0[i] = HEAPU8[pData++] * .0078125 - 1;
                                        channel1[i] = HEAPU8[pData++] * .0078125 - 1
                                    }
                                }
                                buf.bytesPerSample = 1;
                                buf.channels = 2;
                                buf.length = size >> 1;
                                break;
                            case 4355:
                                if (size > 0) {
                                    audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 2, freq);
                                    var channel0 = audioBuf.getChannelData(0);
                                    var channel1 = audioBuf.getChannelData(1);
                                    pData >>= 1;
                                    for (var i = 0; i < size >> 2; ++i) {
                                        channel0[i] = HEAP16[pData++] * 30517578125e-15;
                                        channel1[i] = HEAP16[pData++] * 30517578125e-15
                                    }
                                }
                                buf.bytesPerSample = 2;
                                buf.channels = 2;
                                buf.length = size >> 2;
                                break;
                            case 65552:
                                if (size > 0) {
                                    audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size >> 2, freq);
                                    var channel0 = audioBuf.getChannelData(0);
                                    pData >>= 2;
                                    for (var i = 0; i < size >> 2; ++i) {
                                        channel0[i] = HEAPF32[pData++]
                                    }
                                }
                                buf.bytesPerSample = 4;
                                buf.channels = 1;
                                buf.length = size >> 2;
                                break;
                            case 65553:
                                if (size > 0) {
                                    audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 3, freq);
                                    var channel0 = audioBuf.getChannelData(0);
                                    var channel1 = audioBuf.getChannelData(1);
                                    pData >>= 2;
                                    for (var i = 0; i < size >> 3; ++i) {
                                        channel0[i] = HEAPF32[pData++];
                                        channel1[i] = HEAPF32[pData++]
                                    }
                                }
                                buf.bytesPerSample = 4;
                                buf.channels = 2;
                                buf.length = size >> 3;
                                break;
                            default:
                                AL.currentCtx.err = 40963;
                                return
                            }
                            buf.frequency = freq;
                            buf.audioBuf = audioBuf
                        } catch (e) {
                            AL.currentCtx.err = 40963;
                            return
                        }
                    }
                    ;
                    var _alDeleteBuffers = (count,pBufferIds)=>{
                        if (!AL.currentCtx) {
                            return
                        }
                        for (var i = 0; i < count; ++i) {
                            var bufId = HEAP32[pBufferIds + i * 4 >> 2];
                            if (bufId === 0) {
                                continue
                            }
                            if (!AL.buffers[bufId]) {
                                AL.currentCtx.err = 40961;
                                return
                            }
                            if (AL.buffers[bufId].refCount) {
                                AL.currentCtx.err = 40964;
                                return
                            }
                        }
                        for (var i = 0; i < count; ++i) {
                            var bufId = HEAP32[pBufferIds + i * 4 >> 2];
                            if (bufId === 0) {
                                continue
                            }
                            AL.deviceRefCounts[AL.buffers[bufId].deviceId]--;
                            delete AL.buffers[bufId];
                            AL.freeIds.push(bufId)
                        }
                    }
                    ;
                    var _alSourcei = (sourceId,param,value)=>{
                        switch (param) {
                        case 514:
                        case 4097:
                        case 4098:
                        case 4103:
                        case 4105:
                        case 4128:
                        case 4129:
                        case 4131:
                        case 4132:
                        case 4133:
                        case 4134:
                        case 4628:
                        case 8201:
                        case 8202:
                        case 53248:
                            AL.setSourceParam("alSourcei", sourceId, param, value);
                            break;
                        default:
                            AL.setSourceParam("alSourcei", sourceId, param, null);
                            break
                        }
                    }
                    ;
                    var _alDeleteSources = (count,pSourceIds)=>{
                        if (!AL.currentCtx) {
                            return
                        }
                        for (var i = 0; i < count; ++i) {
                            var srcId = HEAP32[pSourceIds + i * 4 >> 2];
                            if (!AL.currentCtx.sources[srcId]) {
                                AL.currentCtx.err = 40961;
                                return
                            }
                        }
                        for (var i = 0; i < count; ++i) {
                            var srcId = HEAP32[pSourceIds + i * 4 >> 2];
                            AL.setSourceState(AL.currentCtx.sources[srcId], 4116);
                            _alSourcei(srcId, 4105, 0);
                            delete AL.currentCtx.sources[srcId];
                            AL.freeIds.push(srcId)
                        }
                    }
                    ;
                    var _alGenBuffers = (count,pBufferIds)=>{
                        if (!AL.currentCtx) {
                            return
                        }
                        for (var i = 0; i < count; ++i) {
                            var buf = {
                                deviceId: AL.currentCtx.deviceId,
                                id: AL.newId(),
                                refCount: 0,
                                audioBuf: null,
                                frequency: 0,
                                bytesPerSample: 2,
                                channels: 1,
                                length: 0
                            };
                            AL.deviceRefCounts[buf.deviceId]++;
                            AL.buffers[buf.id] = buf;
                            HEAP32[pBufferIds + i * 4 >> 2] = buf.id
                        }
                    }
                    ;
                    var _alGenSources = (count,pSourceIds)=>{
                        if (!AL.currentCtx) {
                            return
                        }
                        for (var i = 0; i < count; ++i) {
                            var gain = AL.currentCtx.audioCtx.createGain();
                            gain.connect(AL.currentCtx.gain);
                            var src = {
                                context: AL.currentCtx,
                                id: AL.newId(),
                                type: 4144,
                                state: 4113,
                                bufQueue: [AL.buffers[0]],
                                audioQueue: [],
                                looping: false,
                                pitch: 1,
                                dopplerShift: 1,
                                gain,
                                minGain: 0,
                                maxGain: 1,
                                panner: null,
                                bufsProcessed: 0,
                                bufStartTime: Number.NEGATIVE_INFINITY,
                                bufOffset: 0,
                                relative: false,
                                refDistance: 1,
                                maxDistance: 340282e33,
                                rolloffFactor: 1,
                                position: [0, 0, 0],
                                velocity: [0, 0, 0],
                                direction: [0, 0, 0],
                                coneOuterGain: 0,
                                coneInnerAngle: 360,
                                coneOuterAngle: 360,
                                distanceModel: 53250,
                                spatialize: 2,
                                get playbackRate() {
                                    return this.pitch * this.dopplerShift
                                }
                            };
                            AL.currentCtx.sources[src.id] = src;
                            HEAP32[pSourceIds + i * 4 >> 2] = src.id
                        }
                    }
                    ;
                    var _alGetError = ()=>{
                        if (!AL.currentCtx) {
                            return 40964
                        }
                        var err = AL.currentCtx.err;
                        AL.currentCtx.err = 0;
                        return err
                    }
                    ;
                    var _alGetSourcei = (sourceId,param,pValue)=>{
                        var val = AL.getSourceParam("alGetSourcei", sourceId, param);
                        if (val === null) {
                            return
                        }
                        if (!pValue) {
                            AL.currentCtx.err = 40963;
                            return
                        }
                        switch (param) {
                        case 514:
                        case 4097:
                        case 4098:
                        case 4103:
                        case 4105:
                        case 4112:
                        case 4117:
                        case 4118:
                        case 4128:
                        case 4129:
                        case 4131:
                        case 4132:
                        case 4133:
                        case 4134:
                        case 4135:
                        case 4628:
                        case 8201:
                        case 8202:
                        case 53248:
                            HEAP32[pValue >> 2] = val;
                            break;
                        default:
                            AL.currentCtx.err = 40962;
                            return
                        }
                    }
                    ;
                    var _alSourcePlay = sourceId=>{
                        if (!AL.currentCtx) {
                            return
                        }
                        var src = AL.currentCtx.sources[sourceId];
                        if (!src) {
                            AL.currentCtx.err = 40961;
                            return
                        }
                        AL.setSourceState(src, 4114)
                    }
                    ;
                    var _alSourceQueueBuffers = (sourceId,count,pBufferIds)=>{
                        if (!AL.currentCtx) {
                            return
                        }
                        var src = AL.currentCtx.sources[sourceId];
                        if (!src) {
                            AL.currentCtx.err = 40961;
                            return
                        }
                        if (src.type === 4136) {
                            AL.currentCtx.err = 40964;
                            return
                        }
                        if (count === 0) {
                            return
                        }
                        var templateBuf = AL.buffers[0];
                        for (var buf of src.bufQueue) {
                            if (buf.id !== 0) {
                                templateBuf = buf;
                                break
                            }
                        }
                        for (var i = 0; i < count; ++i) {
                            var bufId = HEAP32[pBufferIds + i * 4 >> 2];
                            var buf = AL.buffers[bufId];
                            if (!buf) {
                                AL.currentCtx.err = 40961;
                                return
                            }
                            if (templateBuf.id !== 0 && (buf.frequency !== templateBuf.frequency || buf.bytesPerSample !== templateBuf.bytesPerSample || buf.channels !== templateBuf.channels)) {
                                AL.currentCtx.err = 40964
                            }
                        }
                        if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0) {
                            src.bufQueue.length = 0
                        }
                        src.type = 4137;
                        for (var i = 0; i < count; ++i) {
                            var bufId = HEAP32[pBufferIds + i * 4 >> 2];
                            var buf = AL.buffers[bufId];
                            buf.refCount++;
                            src.bufQueue.push(buf)
                        }
                        if (src.looping) {
                            AL.cancelPendingSourceAudio(src)
                        }
                        AL.initSourcePanner(src);
                        AL.scheduleSourceAudio(src)
                    }
                    ;
                    var _alSourceStop = sourceId=>{
                        if (!AL.currentCtx) {
                            return
                        }
                        var src = AL.currentCtx.sources[sourceId];
                        if (!src) {
                            AL.currentCtx.err = 40961;
                            return
                        }
                        AL.setSourceState(src, 4116)
                    }
                    ;
                    var _alSourceUnqueueBuffers = (sourceId,count,pBufferIds)=>{
                        if (!AL.currentCtx) {
                            return
                        }
                        var src = AL.currentCtx.sources[sourceId];
                        if (!src) {
                            AL.currentCtx.err = 40961;
                            return
                        }
                        if (count > (src.bufQueue.length === 1 && src.bufQueue[0].id === 0 ? 0 : src.bufsProcessed)) {
                            AL.currentCtx.err = 40963;
                            return
                        }
                        if (count === 0) {
                            return
                        }
                        for (var i = 0; i < count; i++) {
                            var buf = src.bufQueue.shift();
                            buf.refCount--;
                            HEAP32[pBufferIds + i * 4 >> 2] = buf.id;
                            src.bufsProcessed--
                        }
                        if (src.bufQueue.length === 0) {
                            src.bufQueue.push(AL.buffers[0])
                        }
                        AL.initSourcePanner(src);
                        AL.scheduleSourceAudio(src)
                    }
                    ;
                    var _alcCloseDevice = deviceId=>{
                        if (!(deviceId in AL.deviceRefCounts) || AL.deviceRefCounts[deviceId] > 0) {
                            return 0
                        }
                        delete AL.deviceRefCounts[deviceId];
                        AL.freeIds.push(deviceId);
                        return 1
                    }
                    ;
                    var listenOnce = (object,event,func)=>object.addEventListener(event, func, {
                        once: true
                    });
                    var autoResumeAudioContext = (ctx,elements)=>{
                        if (!elements) {
                            elements = [document, document.getElementById("canvas")]
                        }
                        ["keydown", "mousedown", "touchstart"].forEach(event=>{
                            elements.forEach(element=>{
                                if (element) {
                                    listenOnce(element, event, ()=>{
                                        if (ctx.state === "suspended")
                                            ctx.resume()
                                    }
                                    )
                                }
                            }
                            )
                        }
                        )
                    }
                    ;
                    var _alcCreateContext = (deviceId,pAttrList)=>{
                        if (!(deviceId in AL.deviceRefCounts)) {
                            AL.alcErr = 40961;
                            return 0
                        }
                        var options = null;
                        var attrs = [];
                        var hrtf = null;
                        pAttrList >>= 2;
                        if (pAttrList) {
                            var attr = 0;
                            var val = 0;
                            while (true) {
                                attr = HEAP32[pAttrList++];
                                attrs.push(attr);
                                if (attr === 0) {
                                    break
                                }
                                val = HEAP32[pAttrList++];
                                attrs.push(val);
                                switch (attr) {
                                case 4103:
                                    if (!options) {
                                        options = {}
                                    }
                                    options.sampleRate = val;
                                    break;
                                case 4112:
                                case 4113:
                                    break;
                                case 6546:
                                    switch (val) {
                                    case 0:
                                        hrtf = false;
                                        break;
                                    case 1:
                                        hrtf = true;
                                        break;
                                    case 2:
                                        break;
                                    default:
                                        AL.alcErr = 40964;
                                        return 0
                                    }
                                    break;
                                case 6550:
                                    if (val !== 0) {
                                        AL.alcErr = 40964;
                                        return 0
                                    }
                                    break;
                                default:
                                    AL.alcErr = 40964;
                                    return 0
                                }
                            }
                        }
                        var AudioContext = window.AudioContext || window.webkitAudioContext;
                        var ac = null;
                        try {
                            if (options) {
                                ac = new AudioContext(options)
                            } else {
                                ac = new AudioContext
                            }
                        } catch (e) {
                            if (e.name === "NotSupportedError") {
                                AL.alcErr = 40964
                            } else {
                                AL.alcErr = 40961
                            }
                            return 0
                        }
                        autoResumeAudioContext(ac);
                        if (typeof ac.createGain == "undefined") {
                            ac.createGain = ac.createGainNode
                        }
                        var gain = ac.createGain();
                        gain.connect(ac.destination);
                        var ctx = {
                            deviceId,
                            id: AL.newId(),
                            attrs,
                            audioCtx: ac,
                            listener: {
                                position: [0, 0, 0],
                                velocity: [0, 0, 0],
                                direction: [0, 0, 0],
                                up: [0, 0, 0]
                            },
                            sources: [],
                            interval: setInterval(()=>AL.scheduleContextAudio(ctx), AL.QUEUE_INTERVAL),
                            gain,
                            distanceModel: 53250,
                            speedOfSound: 343.3,
                            dopplerFactor: 1,
                            sourceDistanceModel: false,
                            hrtf: hrtf || false,
                            _err: 0,
                            get err() {
                                return this._err
                            },
                            set err(val) {
                                if (this._err === 0 || val === 0) {
                                    this._err = val
                                }
                            }
                        };
                        AL.deviceRefCounts[deviceId]++;
                        AL.contexts[ctx.id] = ctx;
                        if (hrtf !== null) {
                            for (var ctxId in AL.contexts) {
                                var c = AL.contexts[ctxId];
                                if (c.deviceId === deviceId) {
                                    c.hrtf = hrtf;
                                    AL.updateContextGlobal(c)
                                }
                            }
                        }
                        return ctx.id
                    }
                    ;
                    var _alcDestroyContext = contextId=>{
                        var ctx = AL.contexts[contextId];
                        if (AL.currentCtx === ctx) {
                            AL.alcErr = 40962;
                            return
                        }
                        if (AL.contexts[contextId].interval) {
                            clearInterval(AL.contexts[contextId].interval)
                        }
                        AL.deviceRefCounts[ctx.deviceId]--;
                        delete AL.contexts[contextId];
                        AL.freeIds.push(contextId)
                    }
                    ;
                    var _alcMakeContextCurrent = contextId=>{
                        if (contextId === 0) {
                            AL.currentCtx = null
                        } else {
                            AL.currentCtx = AL.contexts[contextId]
                        }
                        return 1
                    }
                    ;
                    var _alcOpenDevice = pDeviceName=>{
                        if (pDeviceName) {
                            var name = UTF8ToString(pDeviceName);
                            if (name !== AL.DEVICE_NAME) {
                                return 0
                            }
                        }
                        if (typeof AudioContext != "undefined" || typeof webkitAudioContext != "undefined") {
                            var deviceId = AL.newId();
                            AL.deviceRefCounts[deviceId] = 0;
                            return deviceId
                        }
                        return 0
                    }
                    ;
                    var _emscripten_date_now = ()=>Date.now();
                    var nowIsMonotonic = 1;
                    var checkWasiClock = clock_id=>clock_id >= 0 && clock_id <= 3;
                    function _clock_time_get(clk_id, ignored_precision, ptime) {
                        ignored_precision = bigintToI53Checked(ignored_precision);
                        if (!checkWasiClock(clk_id)) {
                            return 28
                        }
                        var now;
                        if (clk_id === 0) {
                            now = _emscripten_date_now()
                        } else if (nowIsMonotonic) {
                            now = _emscripten_get_now()
                        } else {
                            return 52
                        }
                        var nsec = Math.round(now * 1e3 * 1e3);
                        HEAP64[ptime >> 3] = BigInt(nsec);
                        return 0
                    }
                    var readEmAsmArgsArray = [];
                    var readEmAsmArgs = (sigPtr,buf)=>{
                        readEmAsmArgsArray.length = 0;
                        var ch;
                        while (ch = HEAPU8[sigPtr++]) {
                            var wide = ch != 105;
                            wide &= ch != 112;
                            buf += wide && buf % 8 ? 4 : 0;
                            readEmAsmArgsArray.push(ch == 112 ? HEAPU32[buf >> 2] : ch == 106 ? HEAP64[buf >> 3] : ch == 105 ? HEAP32[buf >> 2] : HEAPF64[buf >> 3]);
                            buf += wide ? 8 : 4
                        }
                        return readEmAsmArgsArray
                    }
                    ;
                    var runEmAsmFunction = (code,sigPtr,argbuf)=>{
                        var args = readEmAsmArgs(sigPtr, argbuf);
                        return ASM_CONSTS[code](...args)
                    }
                    ;
                    var _emscripten_asm_const_int = (code,sigPtr,argbuf)=>runEmAsmFunction(code, sigPtr, argbuf);
                    var runMainThreadEmAsm = (emAsmAddr,sigPtr,argbuf,sync)=>{
                        var args = readEmAsmArgs(sigPtr, argbuf);
                        return ASM_CONSTS[emAsmAddr](...args)
                    }
                    ;
                    var _emscripten_asm_const_int_sync_on_main_thread = (emAsmAddr,sigPtr,argbuf)=>runMainThreadEmAsm(emAsmAddr, sigPtr, argbuf, 1);
                    var _emscripten_asm_const_ptr = (code,sigPtr,argbuf)=>runEmAsmFunction(code, sigPtr, argbuf);
                    var safeSetTimeout = (func,timeout)=>setTimeout(()=>{
                        callUserCallback(func)
                    }
                    , timeout);
                    var safeRequestAnimationFrame = func=>MainLoop.requestAnimationFrame(()=>{
                        callUserCallback(func)
                    }
                    );
                    var _emscripten_async_call = (func,arg,millis)=>{
                        var wrapper = ()=>(a1=>dynCall_vi(func, a1))(arg);
                        if (millis >= 0) {
                            safeSetTimeout(wrapper, millis)
                        } else {
                            safeRequestAnimationFrame(wrapper)
                        }
                    }
                    ;
                    var wget = {
                        wgetRequests: {},
                        nextWgetRequestHandle: 0,
                        getNextWgetRequestHandle() {
                            var handle = wget.nextWgetRequestHandle;
                            wget.nextWgetRequestHandle++;
                            return handle
                        }
                    };
                    var _emscripten_async_wget2_data = (url,request,param,userdata,free,onload,onerror,onprogress)=>{
                        var _url = UTF8ToString(url);
                        var _request = UTF8ToString(request);
                        var _param = UTF8ToString(param);
                        var http = new XMLHttpRequest;
                        http.open(_request, _url, true);
                        http.responseType = "arraybuffer";
                        var handle = wget.getNextWgetRequestHandle();
                        function onerrorjs() {
                            if (onerror) {
                                var sp = stackSave();
                                var statusText = 0;
                                if (http.statusText) {
                                    statusText = stringToUTF8OnStack(http.statusText)
                                }
                                ((a1,a2,a3,a4)=>dynCall_viiii(onerror, a1, a2, a3, a4))(handle, userdata, http.status, statusText);
                                stackRestore(sp)
                            }
                        }
                        http.onload = e=>{
                            if (http.status >= 200 && http.status < 300 || http.status === 0 && _url.slice(0, 4).toLowerCase() != "http") {
                                var byteArray = new Uint8Array(http.response);
                                var buffer = _malloc(byteArray.length);
                                HEAPU8.set(byteArray, buffer);
                                if (onload)
                                    ((a1,a2,a3,a4)=>dynCall_viiii(onload, a1, a2, a3, a4))(handle, userdata, buffer, byteArray.length);
                                if (free)
                                    _free(buffer)
                            } else {
                                onerrorjs()
                            }
                            delete wget.wgetRequests[handle]
                        }
                        ;
                        http.onerror = e=>{
                            onerrorjs();
                            delete wget.wgetRequests[handle]
                        }
                        ;
                        http.onprogress = e=>{
                            if (onprogress)
                                ((a1,a2,a3,a4)=>dynCall_viiii(onprogress, a1, a2, a3, a4))(handle, userdata, e.loaded, e.lengthComputable || e.lengthComputable === undefined ? e.total : 0)
                        }
                        ;
                        http.onabort = e=>{
                            delete wget.wgetRequests[handle]
                        }
                        ;
                        if (_request == "POST") {
                            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                            http.send(_param)
                        } else {
                            http.send(null)
                        }
                        wget.wgetRequests[handle] = http;
                        return handle
                    }
                    ;
                    var JSEvents = {
                        memcpy(target, src, size) {
                            HEAP8.set(HEAP8.subarray(src, src + size), target)
                        },
                        removeAllEventListeners() {
                            while (JSEvents.eventHandlers.length) {
                                JSEvents._removeHandler(JSEvents.eventHandlers.length - 1)
                            }
                            JSEvents.deferredCalls = []
                        },
                        inEventHandler: 0,
                        deferredCalls: [],
                        deferCall(targetFunction, precedence, argsList) {
                            function arraysHaveEqualContent(arrA, arrB) {
                                if (arrA.length != arrB.length)
                                    return false;
                                for (var i in arrA) {
                                    if (arrA[i] != arrB[i])
                                        return false
                                }
                                return true
                            }
                            for (var call of JSEvents.deferredCalls) {
                                if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
                                    return
                                }
                            }
                            JSEvents.deferredCalls.push({
                                targetFunction,
                                precedence,
                                argsList
                            });
                            JSEvents.deferredCalls.sort((x,y)=>x.precedence < y.precedence)
                        },
                        removeDeferredCalls(targetFunction) {
                            JSEvents.deferredCalls = JSEvents.deferredCalls.filter(call=>call.targetFunction != targetFunction)
                        },
                        canPerformEventHandlerRequests() {
                            if (navigator.userActivation) {
                                return navigator.userActivation.isActive
                            }
                            return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls
                        },
                        runDeferredCalls() {
                            if (!JSEvents.canPerformEventHandlerRequests()) {
                                return
                            }
                            var deferredCalls = JSEvents.deferredCalls;
                            JSEvents.deferredCalls = [];
                            for (var call of deferredCalls) {
                                call.targetFunction(...call.argsList)
                            }
                        },
                        eventHandlers: [],
                        removeAllHandlersOnTarget: (target,eventTypeString)=>{
                            for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
                                if (JSEvents.eventHandlers[i].target == target && (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
                                    JSEvents._removeHandler(i--)
                                }
                            }
                        }
                        ,
                        _removeHandler(i) {
                            var h = JSEvents.eventHandlers[i];
                            h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
                            JSEvents.eventHandlers.splice(i, 1)
                        },
                        registerOrRemoveHandler(eventHandler) {
                            if (!eventHandler.target) {
                                return -4
                            }
                            if (eventHandler.callbackfunc) {
                                eventHandler.eventListenerFunc = function(event) {
                                    ++JSEvents.inEventHandler;
                                    JSEvents.currentEventHandler = eventHandler;
                                    JSEvents.runDeferredCalls();
                                    eventHandler.handlerFunc(event);
                                    JSEvents.runDeferredCalls();
                                    --JSEvents.inEventHandler
                                }
                                ;
                                eventHandler.target.addEventListener(eventHandler.eventTypeString, eventHandler.eventListenerFunc, eventHandler.useCapture);
                                JSEvents.eventHandlers.push(eventHandler)
                            } else {
                                for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
                                    if (JSEvents.eventHandlers[i].target == eventHandler.target && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
                                        JSEvents._removeHandler(i--)
                                    }
                                }
                            }
                            return 0
                        },
                        getNodeNameForTarget(target) {
                            if (!target)
                                return "";
                            if (target == window)
                                return "#window";
                            if (target == screen)
                                return "#screen";
                            return target?.nodeName || ""
                        },
                        fullscreenEnabled() {
                            return document.fullscreenEnabled || document.webkitFullscreenEnabled
                        }
                    };
                    var specialHTMLTargets = [0, typeof document != "undefined" ? document : 0, typeof window != "undefined" ? window : 0];
                    var maybeCStringToJsString = cString=>cString > 2 ? UTF8ToString(cString) : cString;
                    var findEventTarget = target=>{
                        target = maybeCStringToJsString(target);
                        var domElement = specialHTMLTargets[target] || (typeof document != "undefined" ? document.querySelector(target) : null);
                        return domElement
                    }
                    ;
                    var findCanvasEventTarget = findEventTarget;
                    var _emscripten_get_canvas_element_size = (target,width,height)=>{
                        var canvas = findCanvasEventTarget(target);
                        if (!canvas)
                            return -4;
                        HEAP32[width >> 2] = canvas.width;
                        HEAP32[height >> 2] = canvas.height
                    }
                    ;
                    var stackAlloc = sz=>__emscripten_stack_alloc(sz);
                    var stringToUTF8OnStack = str=>{
                        var size = lengthBytesUTF8(str) + 1;
                        var ret = stackAlloc(size);
                        stringToUTF8(str, ret, size);
                        return ret
                    }
                    ;
                    var getCanvasElementSize = target=>{
                        var sp = stackSave();
                        var w = stackAlloc(8);
                        var h = w + 4;
                        var targetInt = stringToUTF8OnStack(target.id);
                        var ret = _emscripten_get_canvas_element_size(targetInt, w, h);
                        var size = [HEAP32[w >> 2], HEAP32[h >> 2]];
                        stackRestore(sp);
                        return size
                    }
                    ;
                    var _emscripten_set_canvas_element_size = (target,width,height)=>{
                        var canvas = findCanvasEventTarget(target);
                        if (!canvas)
                            return -4;
                        canvas.width = width;
                        canvas.height = height;
                        return 0
                    }
                    ;
                    var setCanvasElementSize = (target,width,height)=>{
                        if (!target.controlTransferredOffscreen) {
                            target.width = width;
                            target.height = height
                        } else {
                            var sp = stackSave();
                            var targetInt = stringToUTF8OnStack(target.id);
                            _emscripten_set_canvas_element_size(targetInt, width, height);
                            stackRestore(sp)
                        }
                    }
                    ;
                    var currentFullscreenStrategy = {};
                    var registerRestoreOldStyle = canvas=>{
                        var canvasSize = getCanvasElementSize(canvas);
                        var oldWidth = canvasSize[0];
                        var oldHeight = canvasSize[1];
                        var oldCssWidth = canvas.style.width;
                        var oldCssHeight = canvas.style.height;
                        var oldBackgroundColor = canvas.style.backgroundColor;
                        var oldDocumentBackgroundColor = document.body.style.backgroundColor;
                        var oldPaddingLeft = canvas.style.paddingLeft;
                        var oldPaddingRight = canvas.style.paddingRight;
                        var oldPaddingTop = canvas.style.paddingTop;
                        var oldPaddingBottom = canvas.style.paddingBottom;
                        var oldMarginLeft = canvas.style.marginLeft;
                        var oldMarginRight = canvas.style.marginRight;
                        var oldMarginTop = canvas.style.marginTop;
                        var oldMarginBottom = canvas.style.marginBottom;
                        var oldDocumentBodyMargin = document.body.style.margin;
                        var oldDocumentOverflow = document.documentElement.style.overflow;
                        var oldDocumentScroll = document.body.scroll;
                        var oldImageRendering = canvas.style.imageRendering;
                        function restoreOldStyle() {
                            var fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
                            if (!fullscreenElement) {
                                document.removeEventListener("fullscreenchange", restoreOldStyle);
                                document.removeEventListener("webkitfullscreenchange", restoreOldStyle);
                                setCanvasElementSize(canvas, oldWidth, oldHeight);
                                canvas.style.width = oldCssWidth;
                                canvas.style.height = oldCssHeight;
                                canvas.style.backgroundColor = oldBackgroundColor;
                                if (!oldDocumentBackgroundColor)
                                    document.body.style.backgroundColor = "white";
                                document.body.style.backgroundColor = oldDocumentBackgroundColor;
                                canvas.style.paddingLeft = oldPaddingLeft;
                                canvas.style.paddingRight = oldPaddingRight;
                                canvas.style.paddingTop = oldPaddingTop;
                                canvas.style.paddingBottom = oldPaddingBottom;
                                canvas.style.marginLeft = oldMarginLeft;
                                canvas.style.marginRight = oldMarginRight;
                                canvas.style.marginTop = oldMarginTop;
                                canvas.style.marginBottom = oldMarginBottom;
                                document.body.style.margin = oldDocumentBodyMargin;
                                document.documentElement.style.overflow = oldDocumentOverflow;
                                document.body.scroll = oldDocumentScroll;
                                canvas.style.imageRendering = oldImageRendering;
                                if (canvas.GLctxObject)
                                    canvas.GLctxObject.GLctx.viewport(0, 0, oldWidth, oldHeight);
                                if (currentFullscreenStrategy.canvasResizedCallback) {
                                    ((a1,a2,a3)=>dynCall_iiii(currentFullscreenStrategy.canvasResizedCallback, a1, a2, a3))(37, 0, currentFullscreenStrategy.canvasResizedCallbackUserData)
                                }
                            }
                        }
                        document.addEventListener("fullscreenchange", restoreOldStyle);
                        document.addEventListener("webkitfullscreenchange", restoreOldStyle);
                        return restoreOldStyle
                    }
                    ;
                    var setLetterbox = (element,topBottom,leftRight)=>{
                        element.style.paddingLeft = element.style.paddingRight = leftRight + "px";
                        element.style.paddingTop = element.style.paddingBottom = topBottom + "px"
                    }
                    ;
                    var getBoundingClientRect = e=>specialHTMLTargets.indexOf(e) < 0 ? e.getBoundingClientRect() : {
                        left: 0,
                        top: 0
                    };
                    var JSEvents_resizeCanvasForFullscreen = (target,strategy)=>{
                        var restoreOldStyle = registerRestoreOldStyle(target);
                        var cssWidth = strategy.softFullscreen ? innerWidth : screen.width;
                        var cssHeight = strategy.softFullscreen ? innerHeight : screen.height;
                        var rect = getBoundingClientRect(target);
                        var windowedCssWidth = rect.width;
                        var windowedCssHeight = rect.height;
                        var canvasSize = getCanvasElementSize(target);
                        var windowedRttWidth = canvasSize[0];
                        var windowedRttHeight = canvasSize[1];
                        if (strategy.scaleMode == 3) {
                            setLetterbox(target, (cssHeight - windowedCssHeight) / 2, (cssWidth - windowedCssWidth) / 2);
                            cssWidth = windowedCssWidth;
                            cssHeight = windowedCssHeight
                        } else if (strategy.scaleMode == 2) {
                            if (cssWidth * windowedRttHeight < windowedRttWidth * cssHeight) {
                                var desiredCssHeight = windowedRttHeight * cssWidth / windowedRttWidth;
                                setLetterbox(target, (cssHeight - desiredCssHeight) / 2, 0);
                                cssHeight = desiredCssHeight
                            } else {
                                var desiredCssWidth = windowedRttWidth * cssHeight / windowedRttHeight;
                                setLetterbox(target, 0, (cssWidth - desiredCssWidth) / 2);
                                cssWidth = desiredCssWidth
                            }
                        }
                        target.style.backgroundColor ||= "black";
                        document.body.style.backgroundColor ||= "black";
                        target.style.width = cssWidth + "px";
                        target.style.height = cssHeight + "px";
                        if (strategy.filteringMode == 1) {
                            target.style.imageRendering = "optimizeSpeed";
                            target.style.imageRendering = "-moz-crisp-edges";
                            target.style.imageRendering = "-o-crisp-edges";
                            target.style.imageRendering = "-webkit-optimize-contrast";
                            target.style.imageRendering = "optimize-contrast";
                            target.style.imageRendering = "crisp-edges";
                            target.style.imageRendering = "pixelated"
                        }
                        var dpiScale = strategy.canvasResolutionScaleMode == 2 ? devicePixelRatio : 1;
                        if (strategy.canvasResolutionScaleMode != 0) {
                            var newWidth = cssWidth * dpiScale | 0;
                            var newHeight = cssHeight * dpiScale | 0;
                            setCanvasElementSize(target, newWidth, newHeight);
                            if (target.GLctxObject)
                                target.GLctxObject.GLctx.viewport(0, 0, newWidth, newHeight)
                        }
                        return restoreOldStyle
                    }
                    ;
                    var JSEvents_requestFullscreen = (target,strategy)=>{
                        if (strategy.scaleMode != 0 || strategy.canvasResolutionScaleMode != 0) {
                            JSEvents_resizeCanvasForFullscreen(target, strategy)
                        }
                        if (target.requestFullscreen) {
                            target.requestFullscreen()
                        } else if (target.webkitRequestFullscreen) {
                            target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
                        } else {
                            return JSEvents.fullscreenEnabled() ? -3 : -1
                        }
                        currentFullscreenStrategy = strategy;
                        if (strategy.canvasResizedCallback) {
                            ((a1,a2,a3)=>dynCall_iiii(strategy.canvasResizedCallback, a1, a2, a3))(37, 0, strategy.canvasResizedCallbackUserData)
                        }
                        return 0
                    }
                    ;
                    var _emscripten_exit_fullscreen = ()=>{
                        if (!JSEvents.fullscreenEnabled())
                            return -1;
                        JSEvents.removeDeferredCalls(JSEvents_requestFullscreen);
                        var d = specialHTMLTargets[1];
                        if (d.exitFullscreen) {
                            d.fullscreenElement && d.exitFullscreen()
                        } else if (d.webkitExitFullscreen) {
                            d.webkitFullscreenElement && d.webkitExitFullscreen()
                        } else {
                            return -1
                        }
                        return 0
                    }
                    ;
                    var requestPointerLock = target=>{
                        if (target.requestPointerLock) {
                            target.requestPointerLock()
                        } else {
                            if (document.body.requestPointerLock) {
                                return -3
                            }
                            return -1
                        }
                        return 0
                    }
                    ;
                    var _emscripten_exit_pointerlock = ()=>{
                        JSEvents.removeDeferredCalls(requestPointerLock);
                        if (document.exitPointerLock) {
                            document.exitPointerLock()
                        } else {
                            return -1
                        }
                        return 0
                    }
                    ;
                    var __emscripten_runtime_keepalive_clear = ()=>{
                        noExitRuntime = false;
                        runtimeKeepaliveCounter = 0
                    }
                    ;
                    var _emscripten_force_exit = status=>{
                        __emscripten_runtime_keepalive_clear();
                        _exit(status)
                    }
                    ;
                    var getHeapMax = ()=>2147483648;
                    var _emscripten_get_heap_max = ()=>getHeapMax();
                    var GLctx;
                    var webgl_enable_ANGLE_instanced_arrays = ctx=>{
                        var ext = ctx.getExtension("ANGLE_instanced_arrays");
                        if (ext) {
                            ctx["vertexAttribDivisor"] = (index,divisor)=>ext["vertexAttribDivisorANGLE"](index, divisor);
                            ctx["drawArraysInstanced"] = (mode,first,count,primcount)=>ext["drawArraysInstancedANGLE"](mode, first, count, primcount);
                            ctx["drawElementsInstanced"] = (mode,count,type,indices,primcount)=>ext["drawElementsInstancedANGLE"](mode, count, type, indices, primcount);
                            return 1
                        }
                    }
                    ;
                    var webgl_enable_OES_vertex_array_object = ctx=>{
                        var ext = ctx.getExtension("OES_vertex_array_object");
                        if (ext) {
                            ctx["createVertexArray"] = ()=>ext["createVertexArrayOES"]();
                            ctx["deleteVertexArray"] = vao=>ext["deleteVertexArrayOES"](vao);
                            ctx["bindVertexArray"] = vao=>ext["bindVertexArrayOES"](vao);
                            ctx["isVertexArray"] = vao=>ext["isVertexArrayOES"](vao);
                            return 1
                        }
                    }
                    ;
                    var webgl_enable_WEBGL_draw_buffers = ctx=>{
                        var ext = ctx.getExtension("WEBGL_draw_buffers");
                        if (ext) {
                            ctx["drawBuffers"] = (n,bufs)=>ext["drawBuffersWEBGL"](n, bufs);
                            return 1
                        }
                    }
                    ;
                    var webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance = ctx=>!!(ctx.dibvbi = ctx.getExtension("WEBGL_draw_instanced_base_vertex_base_instance"));
                    var webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance = ctx=>!!(ctx.mdibvbi = ctx.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance"));
                    var webgl_enable_EXT_polygon_offset_clamp = ctx=>!!(ctx.extPolygonOffsetClamp = ctx.getExtension("EXT_polygon_offset_clamp"));
                    var webgl_enable_EXT_clip_control = ctx=>!!(ctx.extClipControl = ctx.getExtension("EXT_clip_control"));
                    var webgl_enable_WEBGL_polygon_mode = ctx=>!!(ctx.webglPolygonMode = ctx.getExtension("WEBGL_polygon_mode"));
                    var webgl_enable_WEBGL_multi_draw = ctx=>!!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"));
                    var getEmscriptenSupportedExtensions = ctx=>{
                        var supportedExtensions = ["ANGLE_instanced_arrays", "EXT_blend_minmax", "EXT_disjoint_timer_query", "EXT_frag_depth", "EXT_shader_texture_lod", "EXT_sRGB", "OES_element_index_uint", "OES_fbo_render_mipmap", "OES_standard_derivatives", "OES_texture_float", "OES_texture_half_float", "OES_texture_half_float_linear", "OES_vertex_array_object", "WEBGL_color_buffer_float", "WEBGL_depth_texture", "WEBGL_draw_buffers", "EXT_color_buffer_float", "EXT_conservative_depth", "EXT_disjoint_timer_query_webgl2", "EXT_texture_norm16", "NV_shader_noperspective_interpolation", "WEBGL_clip_cull_distance", "EXT_clip_control", "EXT_color_buffer_half_float", "EXT_depth_clamp", "EXT_float_blend", "EXT_polygon_offset_clamp", "EXT_texture_compression_bptc", "EXT_texture_compression_rgtc", "EXT_texture_filter_anisotropic", "KHR_parallel_shader_compile", "OES_texture_float_linear", "WEBGL_blend_func_extended", "WEBGL_compressed_texture_astc", "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_etc1", "WEBGL_compressed_texture_s3tc", "WEBGL_compressed_texture_s3tc_srgb", "WEBGL_debug_renderer_info", "WEBGL_debug_shaders", "WEBGL_lose_context", "WEBGL_multi_draw", "WEBGL_polygon_mode"];
                        return (ctx.getSupportedExtensions() || []).filter(ext=>supportedExtensions.includes(ext))
                    }
                    ;
                    var registerPreMainLoop = f=>{
                        typeof MainLoop != "undefined" && MainLoop.preMainLoop.push(f)
                    }
                    ;
                    var GL = {
                        counter: 1,
                        buffers: [],
                        programs: [],
                        framebuffers: [],
                        renderbuffers: [],
                        textures: [],
                        shaders: [],
                        vaos: [],
                        contexts: [],
                        offscreenCanvases: {},
                        queries: [],
                        samplers: [],
                        transformFeedbacks: [],
                        syncs: [],
                        byteSizeByTypeRoot: 5120,
                        byteSizeByType: [1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8],
                        stringCache: {},
                        stringiCache: {},
                        unpackAlignment: 4,
                        unpackRowLength: 0,
                        recordError: errorCode=>{
                            if (!GL.lastError) {
                                GL.lastError = errorCode
                            }
                        }
                        ,
                        getNewId: table=>{
                            var ret = GL.counter++;
                            for (var i = table.length; i < ret; i++) {
                                table[i] = null
                            }
                            while (table[ret]) {
                                ret = GL.counter++
                            }
                            return ret
                        }
                        ,
                        genObject: (n,buffers,createFunction,objectTable)=>{
                            for (var i = 0; i < n; i++) {
                                var buffer = GLctx[createFunction]();
                                var id = buffer && GL.getNewId(objectTable);
                                if (buffer) {
                                    buffer.name = id;
                                    objectTable[id] = buffer
                                } else {
                                    GL.recordError(1282)
                                }
                                HEAP32[buffers + i * 4 >> 2] = id
                            }
                        }
                        ,
                        MAX_TEMP_BUFFER_SIZE: 2097152,
                        numTempVertexBuffersPerSize: 64,
                        log2ceilLookup: i=>32 - Math.clz32(i === 0 ? 0 : i - 1),
                        generateTempBuffers: (quads,context)=>{
                            var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
                            context.tempVertexBufferCounters1 = [];
                            context.tempVertexBufferCounters2 = [];
                            context.tempVertexBufferCounters1.length = context.tempVertexBufferCounters2.length = largestIndex + 1;
                            context.tempVertexBuffers1 = [];
                            context.tempVertexBuffers2 = [];
                            context.tempVertexBuffers1.length = context.tempVertexBuffers2.length = largestIndex + 1;
                            context.tempIndexBuffers = [];
                            context.tempIndexBuffers.length = largestIndex + 1;
                            for (var i = 0; i <= largestIndex; ++i) {
                                context.tempIndexBuffers[i] = null;
                                context.tempVertexBufferCounters1[i] = context.tempVertexBufferCounters2[i] = 0;
                                var ringbufferLength = GL.numTempVertexBuffersPerSize;
                                context.tempVertexBuffers1[i] = [];
                                context.tempVertexBuffers2[i] = [];
                                var ringbuffer1 = context.tempVertexBuffers1[i];
                                var ringbuffer2 = context.tempVertexBuffers2[i];
                                ringbuffer1.length = ringbuffer2.length = ringbufferLength;
                                for (var j = 0; j < ringbufferLength; ++j) {
                                    ringbuffer1[j] = ringbuffer2[j] = null
                                }
                            }
                            if (quads) {
                                context.tempQuadIndexBuffer = GLctx.createBuffer();
                                context.GLctx.bindBuffer(34963, context.tempQuadIndexBuffer);
                                var numIndexes = GL.MAX_TEMP_BUFFER_SIZE >> 1;
                                var quadIndexes = new Uint16Array(numIndexes);
                                var i = 0
                                  , v = 0;
                                while (1) {
                                    quadIndexes[i++] = v;
                                    if (i >= numIndexes)
                                        break;
                                    quadIndexes[i++] = v + 1;
                                    if (i >= numIndexes)
                                        break;
                                    quadIndexes[i++] = v + 2;
                                    if (i >= numIndexes)
                                        break;
                                    quadIndexes[i++] = v;
                                    if (i >= numIndexes)
                                        break;
                                    quadIndexes[i++] = v + 2;
                                    if (i >= numIndexes)
                                        break;
                                    quadIndexes[i++] = v + 3;
                                    if (i >= numIndexes)
                                        break;
                                    v += 4
                                }
                                context.GLctx.bufferData(34963, quadIndexes, 35044);
                                context.GLctx.bindBuffer(34963, null)
                            }
                        }
                        ,
                        getTempVertexBuffer: sizeBytes=>{
                            var idx = GL.log2ceilLookup(sizeBytes);
                            var ringbuffer = GL.currentContext.tempVertexBuffers1[idx];
                            var nextFreeBufferIndex = GL.currentContext.tempVertexBufferCounters1[idx];
                            GL.currentContext.tempVertexBufferCounters1[idx] = GL.currentContext.tempVertexBufferCounters1[idx] + 1 & GL.numTempVertexBuffersPerSize - 1;
                            var vbo = ringbuffer[nextFreeBufferIndex];
                            if (vbo) {
                                return vbo
                            }
                            var prevVBO = GLctx.getParameter(34964);
                            ringbuffer[nextFreeBufferIndex] = GLctx.createBuffer();
                            GLctx.bindBuffer(34962, ringbuffer[nextFreeBufferIndex]);
                            GLctx.bufferData(34962, 1 << idx, 35048);
                            GLctx.bindBuffer(34962, prevVBO);
                            return ringbuffer[nextFreeBufferIndex]
                        }
                        ,
                        getTempIndexBuffer: sizeBytes=>{
                            var idx = GL.log2ceilLookup(sizeBytes);
                            var ibo = GL.currentContext.tempIndexBuffers[idx];
                            if (ibo) {
                                return ibo
                            }
                            var prevIBO = GLctx.getParameter(34965);
                            GL.currentContext.tempIndexBuffers[idx] = GLctx.createBuffer();
                            GLctx.bindBuffer(34963, GL.currentContext.tempIndexBuffers[idx]);
                            GLctx.bufferData(34963, 1 << idx, 35048);
                            GLctx.bindBuffer(34963, prevIBO);
                            return GL.currentContext.tempIndexBuffers[idx]
                        }
                        ,
                        newRenderingFrameStarted: ()=>{
                            if (!GL.currentContext) {
                                return
                            }
                            var vb = GL.currentContext.tempVertexBuffers1;
                            GL.currentContext.tempVertexBuffers1 = GL.currentContext.tempVertexBuffers2;
                            GL.currentContext.tempVertexBuffers2 = vb;
                            vb = GL.currentContext.tempVertexBufferCounters1;
                            GL.currentContext.tempVertexBufferCounters1 = GL.currentContext.tempVertexBufferCounters2;
                            GL.currentContext.tempVertexBufferCounters2 = vb;
                            var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
                            for (var i = 0; i <= largestIndex; ++i) {
                                GL.currentContext.tempVertexBufferCounters1[i] = 0
                            }
                        }
                        ,
                        getSource: (shader,count,string,length)=>{
                            var source = "";
                            for (var i = 0; i < count; ++i) {
                                var len = length ? HEAPU32[length + i * 4 >> 2] : undefined;
                                source += UTF8ToString(HEAPU32[string + i * 4 >> 2], len)
                            }
                            return source
                        }
                        ,
                        calcBufLength: (size,type,stride,count)=>{
                            if (stride > 0) {
                                return count * stride
                            }
                            var typeSize = GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
                            return size * typeSize * count
                        }
                        ,
                        usedTempBuffers: [],
                        preDrawHandleClientVertexAttribBindings: count=>{
                            GL.resetBufferBinding = false;
                            for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
                                var cb = GL.currentContext.clientBuffers[i];
                                if (!cb.clientside || !cb.enabled)
                                    continue;
                                GL.resetBufferBinding = true;
                                var size = GL.calcBufLength(cb.size, cb.type, cb.stride, count);
                                var buf = GL.getTempVertexBuffer(size);
                                GLctx.bindBuffer(34962, buf);
                                GLctx.bufferSubData(34962, 0, HEAPU8.subarray(cb.ptr, cb.ptr + size));
                                cb.vertexAttribPointerAdaptor.call(GLctx, i, cb.size, cb.type, cb.normalized, cb.stride, 0)
                            }
                        }
                        ,
                        postDrawHandleClientVertexAttribBindings: ()=>{
                            if (GL.resetBufferBinding) {
                                GLctx.bindBuffer(34962, GL.buffers[GLctx.currentArrayBufferBinding])
                            }
                        }
                        ,
                        createContext: (canvas,webGLContextAttributes)=>{
                            if (!canvas.getContextSafariWebGL2Fixed) {
                                canvas.getContextSafariWebGL2Fixed = canvas.getContext;
                                function fixedGetContext(ver, attrs) {
                                    var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
                                    return ver == "webgl" == gl instanceof WebGLRenderingContext ? gl : null
                                }
                                canvas.getContext = fixedGetContext
                            }
                            var ctx = webGLContextAttributes.majorVersion > 1 ? canvas.getContext("webgl2", webGLContextAttributes) : canvas.getContext("webgl", webGLContextAttributes);
                            if (!ctx)
                                return 0;
                            var handle = GL.registerContext(ctx, webGLContextAttributes);
                            return handle
                        }
                        ,
                        registerContext: (ctx,webGLContextAttributes)=>{
                            var handle = GL.getNewId(GL.contexts);
                            var context = {
                                handle,
                                attributes: webGLContextAttributes,
                                version: webGLContextAttributes.majorVersion,
                                GLctx: ctx
                            };
                            if (ctx.canvas)
                                ctx.canvas.GLctxObject = context;
                            GL.contexts[handle] = context;
                            if (typeof webGLContextAttributes.enableExtensionsByDefault == "undefined" || webGLContextAttributes.enableExtensionsByDefault) {
                                GL.initExtensions(context)
                            }
                            context.maxVertexAttribs = context.GLctx.getParameter(34921);
                            context.clientBuffers = [];
                            for (var i = 0; i < context.maxVertexAttribs; i++) {
                                context.clientBuffers[i] = {
                                    enabled: false,
                                    clientside: false,
                                    size: 0,
                                    type: 0,
                                    normalized: 0,
                                    stride: 0,
                                    ptr: 0,
                                    vertexAttribPointerAdaptor: null
                                }
                            }
                            GL.generateTempBuffers(false, context);
                            return handle
                        }
                        ,
                        makeContextCurrent: contextHandle=>{
                            GL.currentContext = GL.contexts[contextHandle];
                            Module["ctx"] = GLctx = GL.currentContext?.GLctx;
                            return !(contextHandle && !GLctx)
                        }
                        ,
                        getContext: contextHandle=>GL.contexts[contextHandle],
                        deleteContext: contextHandle=>{
                            if (GL.currentContext === GL.contexts[contextHandle]) {
                                GL.currentContext = null
                            }
                            if (typeof JSEvents == "object") {
                                JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas)
                            }
                            if (GL.contexts[contextHandle]?.GLctx.canvas) {
                                GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined
                            }
                            GL.contexts[contextHandle] = null
                        }
                        ,
                        initExtensions: context=>{
                            context ||= GL.currentContext;
                            if (context.initExtensionsDone)
                                return;
                            context.initExtensionsDone = true;
                            var GLctx = context.GLctx;
                            webgl_enable_WEBGL_multi_draw(GLctx);
                            webgl_enable_EXT_polygon_offset_clamp(GLctx);
                            webgl_enable_EXT_clip_control(GLctx);
                            webgl_enable_WEBGL_polygon_mode(GLctx);
                            webgl_enable_ANGLE_instanced_arrays(GLctx);
                            webgl_enable_OES_vertex_array_object(GLctx);
                            webgl_enable_WEBGL_draw_buffers(GLctx);
                            webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
                            webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);
                            if (context.version >= 2) {
                                GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query_webgl2")
                            }
                            if (context.version < 2 || !GLctx.disjointTimerQueryExt) {
                                GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query")
                            }
                            getEmscriptenSupportedExtensions(GLctx).forEach(ext=>{
                                if (!ext.includes("lose_context") && !ext.includes("debug")) {
                                    GLctx.getExtension(ext)
                                }
                            }
                            )
                        }
                    };
                    var _glActiveTexture = x0=>GLctx.activeTexture(x0);
                    var _emscripten_glActiveTexture = _glActiveTexture;
                    var _glAttachShader = (program,shader)=>{
                        GLctx.attachShader(GL.programs[program], GL.shaders[shader])
                    }
                    ;
                    var _emscripten_glAttachShader = _glAttachShader;
                    var _glBeginQuery = (target,id)=>{
                        GLctx.beginQuery(target, GL.queries[id])
                    }
                    ;
                    var _emscripten_glBeginQuery = _glBeginQuery;
                    var _glBeginQueryEXT = (target,id)=>{
                        GLctx.disjointTimerQueryExt["beginQueryEXT"](target, GL.queries[id])
                    }
                    ;
                    var _emscripten_glBeginQueryEXT = _glBeginQueryEXT;
                    var _glBeginTransformFeedback = x0=>GLctx.beginTransformFeedback(x0);
                    var _emscripten_glBeginTransformFeedback = _glBeginTransformFeedback;
                    var _glBindAttribLocation = (program,index,name)=>{
                        GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name))
                    }
                    ;
                    var _emscripten_glBindAttribLocation = _glBindAttribLocation;
                    var _glBindBuffer = (target,buffer)=>{
                        if (buffer && !GL.buffers[buffer]) {
                            var b = GLctx.createBuffer();
                            b.name = buffer;
                            GL.buffers[buffer] = b
                        }
                        if (target == 34962) {
                            GLctx.currentArrayBufferBinding = buffer
                        } else if (target == 34963) {
                            GLctx.currentElementArrayBufferBinding = buffer
                        }
                        if (target == 35051) {
                            GLctx.currentPixelPackBufferBinding = buffer
                        } else if (target == 35052) {
                            GLctx.currentPixelUnpackBufferBinding = buffer
                        }
                        GLctx.bindBuffer(target, GL.buffers[buffer])
                    }
                    ;
                    var _emscripten_glBindBuffer = _glBindBuffer;
                    var _glBindBufferBase = (target,index,buffer)=>{
                        GLctx.bindBufferBase(target, index, GL.buffers[buffer])
                    }
                    ;
                    var _emscripten_glBindBufferBase = _glBindBufferBase;
                    var _glBindBufferRange = (target,index,buffer,offset,ptrsize)=>{
                        GLctx.bindBufferRange(target, index, GL.buffers[buffer], offset, ptrsize)
                    }
                    ;
                    var _emscripten_glBindBufferRange = _glBindBufferRange;
                    var _glBindFramebuffer = (target,framebuffer)=>{
                        GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer])
                    }
                    ;
                    var _emscripten_glBindFramebuffer = _glBindFramebuffer;
                    var _glBindRenderbuffer = (target,renderbuffer)=>{
                        GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer])
                    }
                    ;
                    var _emscripten_glBindRenderbuffer = _glBindRenderbuffer;
                    var _glBindSampler = (unit,sampler)=>{
                        GLctx.bindSampler(unit, GL.samplers[sampler])
                    }
                    ;
                    var _emscripten_glBindSampler = _glBindSampler;
                    var _glBindTexture = (target,texture)=>{
                        GLctx.bindTexture(target, GL.textures[texture])
                    }
                    ;
                    var _emscripten_glBindTexture = _glBindTexture;
                    var _glBindTransformFeedback = (target,id)=>{
                        GLctx.bindTransformFeedback(target, GL.transformFeedbacks[id])
                    }
                    ;
                    var _emscripten_glBindTransformFeedback = _glBindTransformFeedback;
                    var _glBindVertexArray = vao=>{
                        GLctx.bindVertexArray(GL.vaos[vao]);
                        var ibo = GLctx.getParameter(34965);
                        GLctx.currentElementArrayBufferBinding = ibo ? ibo.name | 0 : 0
                    }
                    ;
                    var _emscripten_glBindVertexArray = _glBindVertexArray;
                    var _glBindVertexArrayOES = _glBindVertexArray;
                    var _emscripten_glBindVertexArrayOES = _glBindVertexArrayOES;
                    var _glBlendColor = (x0,x1,x2,x3)=>GLctx.blendColor(x0, x1, x2, x3);
                    var _emscripten_glBlendColor = _glBlendColor;
                    var _glBlendEquation = x0=>GLctx.blendEquation(x0);
                    var _emscripten_glBlendEquation = _glBlendEquation;
                    var _glBlendEquationSeparate = (x0,x1)=>GLctx.blendEquationSeparate(x0, x1);
                    var _emscripten_glBlendEquationSeparate = _glBlendEquationSeparate;
                    var _glBlendFunc = (x0,x1)=>GLctx.blendFunc(x0, x1);
                    var _emscripten_glBlendFunc = _glBlendFunc;
                    var _glBlendFuncSeparate = (x0,x1,x2,x3)=>GLctx.blendFuncSeparate(x0, x1, x2, x3);
                    var _emscripten_glBlendFuncSeparate = _glBlendFuncSeparate;
                    var _glBlitFramebuffer = (x0,x1,x2,x3,x4,x5,x6,x7,x8,x9)=>GLctx.blitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);
                    var _emscripten_glBlitFramebuffer = _glBlitFramebuffer;
                    var _glBufferData = (target,size,data,usage)=>{
                        if (GL.currentContext.version >= 2) {
                            if (data && size) {
                                GLctx.bufferData(target, HEAPU8, usage, data, size)
                            } else {
                                GLctx.bufferData(target, size, usage)
                            }
                            return
                        }
                        GLctx.bufferData(target, data ? HEAPU8.subarray(data, data + size) : size, usage)
                    }
                    ;
                    var _emscripten_glBufferData = _glBufferData;
                    var _glBufferSubData = (target,offset,size,data)=>{
                        if (GL.currentContext.version >= 2) {
                            size && GLctx.bufferSubData(target, offset, HEAPU8, data, size);
                            return
                        }
                        GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data + size))
                    }
                    ;
                    var _emscripten_glBufferSubData = _glBufferSubData;
                    var _glCheckFramebufferStatus = x0=>GLctx.checkFramebufferStatus(x0);
                    var _emscripten_glCheckFramebufferStatus = _glCheckFramebufferStatus;
                    var _glClear = x0=>GLctx.clear(x0);
                    var _emscripten_glClear = _glClear;
                    var _glClearBufferfi = (x0,x1,x2,x3)=>GLctx.clearBufferfi(x0, x1, x2, x3);
                    var _emscripten_glClearBufferfi = _glClearBufferfi;
                    var _glClearBufferfv = (buffer,drawbuffer,value)=>{
                        GLctx.clearBufferfv(buffer, drawbuffer, HEAPF32, value >> 2)
                    }
                    ;
                    var _emscripten_glClearBufferfv = _glClearBufferfv;
                    var _glClearBufferiv = (buffer,drawbuffer,value)=>{
                        GLctx.clearBufferiv(buffer, drawbuffer, HEAP32, value >> 2)
                    }
                    ;
                    var _emscripten_glClearBufferiv = _glClearBufferiv;
                    var _glClearBufferuiv = (buffer,drawbuffer,value)=>{
                        GLctx.clearBufferuiv(buffer, drawbuffer, HEAPU32, value >> 2)
                    }
                    ;
                    var _emscripten_glClearBufferuiv = _glClearBufferuiv;
                    var _glClearColor = (x0,x1,x2,x3)=>GLctx.clearColor(x0, x1, x2, x3);
                    var _emscripten_glClearColor = _glClearColor;
                    var _glClearDepthf = x0=>GLctx.clearDepth(x0);
                    var _emscripten_glClearDepthf = _glClearDepthf;
                    var _glClearStencil = x0=>GLctx.clearStencil(x0);
                    var _emscripten_glClearStencil = _glClearStencil;
                    var _glClientWaitSync = (sync,flags,timeout)=>{
                        timeout = Number(timeout);
                        return GLctx.clientWaitSync(GL.syncs[sync], flags, timeout)
                    }
                    ;
                    var _emscripten_glClientWaitSync = _glClientWaitSync;
                    var _glClipControlEXT = (origin,depth)=>{
                        GLctx.extClipControl["clipControlEXT"](origin, depth)
                    }
                    ;
                    var _emscripten_glClipControlEXT = _glClipControlEXT;
                    var _glColorMask = (red,green,blue,alpha)=>{
                        GLctx.colorMask(!!red, !!green, !!blue, !!alpha)
                    }
                    ;
                    var _emscripten_glColorMask = _glColorMask;
                    var _glCompileShader = shader=>{
                        GLctx.compileShader(GL.shaders[shader])
                    }
                    ;
                    var _emscripten_glCompileShader = _glCompileShader;
                    var _glCompressedTexImage2D = (target,level,internalFormat,width,height,border,imageSize,data)=>{
                        if (GL.currentContext.version >= 2) {
                            if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
                                GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data);
                                return
                            }
                            GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, HEAPU8, data, imageSize);
                            return
                        }
                        GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, HEAPU8.subarray(data, data + imageSize))
                    }
                    ;
                    var _emscripten_glCompressedTexImage2D = _glCompressedTexImage2D;
                    var _glCompressedTexImage3D = (target,level,internalFormat,width,height,depth,border,imageSize,data)=>{
                        if (GLctx.currentPixelUnpackBufferBinding) {
                            GLctx.compressedTexImage3D(target, level, internalFormat, width, height, depth, border, imageSize, data)
                        } else {
                            GLctx.compressedTexImage3D(target, level, internalFormat, width, height, depth, border, HEAPU8, data, imageSize)
                        }
                    }
                    ;
                    var _emscripten_glCompressedTexImage3D = _glCompressedTexImage3D;
                    var _glCompressedTexSubImage2D = (target,level,xoffset,yoffset,width,height,format,imageSize,data)=>{
                        if (GL.currentContext.version >= 2) {
                            if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
                                GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data);
                                return
                            }
                            GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, HEAPU8, data, imageSize);
                            return
                        }
                        GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, HEAPU8.subarray(data, data + imageSize))
                    }
                    ;
                    var _emscripten_glCompressedTexSubImage2D = _glCompressedTexSubImage2D;
                    var _glCompressedTexSubImage3D = (target,level,xoffset,yoffset,zoffset,width,height,depth,format,imageSize,data)=>{
                        if (GLctx.currentPixelUnpackBufferBinding) {
                            GLctx.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, data)
                        } else {
                            GLctx.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, HEAPU8, data, imageSize)
                        }
                    }
                    ;
                    var _emscripten_glCompressedTexSubImage3D = _glCompressedTexSubImage3D;
                    var _glCopyBufferSubData = (x0,x1,x2,x3,x4)=>GLctx.copyBufferSubData(x0, x1, x2, x3, x4);
                    var _emscripten_glCopyBufferSubData = _glCopyBufferSubData;
                    var _glCopyTexImage2D = (x0,x1,x2,x3,x4,x5,x6,x7)=>GLctx.copyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7);
                    var _emscripten_glCopyTexImage2D = _glCopyTexImage2D;
                    var _glCopyTexSubImage2D = (x0,x1,x2,x3,x4,x5,x6,x7)=>GLctx.copyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7);
                    var _emscripten_glCopyTexSubImage2D = _glCopyTexSubImage2D;
                    var _glCopyTexSubImage3D = (x0,x1,x2,x3,x4,x5,x6,x7,x8)=>GLctx.copyTexSubImage3D(x0, x1, x2, x3, x4, x5, x6, x7, x8);
                    var _emscripten_glCopyTexSubImage3D = _glCopyTexSubImage3D;
                    var _glCreateProgram = ()=>{
                        var id = GL.getNewId(GL.programs);
                        var program = GLctx.createProgram();
                        program.name = id;
                        program.maxUniformLength = program.maxAttributeLength = program.maxUniformBlockNameLength = 0;
                        program.uniformIdCounter = 1;
                        GL.programs[id] = program;
                        return id
                    }
                    ;
                    var _emscripten_glCreateProgram = _glCreateProgram;
                    var _glCreateShader = shaderType=>{
                        var id = GL.getNewId(GL.shaders);
                        GL.shaders[id] = GLctx.createShader(shaderType);
                        return id
                    }
                    ;
                    var _emscripten_glCreateShader = _glCreateShader;
                    var _glCullFace = x0=>GLctx.cullFace(x0);
                    var _emscripten_glCullFace = _glCullFace;
                    var _glDeleteBuffers = (n,buffers)=>{
                        for (var i = 0; i < n; i++) {
                            var id = HEAP32[buffers + i * 4 >> 2];
                            var buffer = GL.buffers[id];
                            if (!buffer)
                                continue;
                            GLctx.deleteBuffer(buffer);
                            buffer.name = 0;
                            GL.buffers[id] = null;
                            if (id == GLctx.currentArrayBufferBinding)
                                GLctx.currentArrayBufferBinding = 0;
                            if (id == GLctx.currentElementArrayBufferBinding)
                                GLctx.currentElementArrayBufferBinding = 0;
                            if (id == GLctx.currentPixelPackBufferBinding)
                                GLctx.currentPixelPackBufferBinding = 0;
                            if (id == GLctx.currentPixelUnpackBufferBinding)
                                GLctx.currentPixelUnpackBufferBinding = 0
                        }
                    }
                    ;
                    var _emscripten_glDeleteBuffers = _glDeleteBuffers;
                    var _glDeleteFramebuffers = (n,framebuffers)=>{
                        for (var i = 0; i < n; ++i) {
                            var id = HEAP32[framebuffers + i * 4 >> 2];
                            var framebuffer = GL.framebuffers[id];
                            if (!framebuffer)
                                continue;
                            GLctx.deleteFramebuffer(framebuffer);
                            framebuffer.name = 0;
                            GL.framebuffers[id] = null
                        }
                    }
                    ;
                    var _emscripten_glDeleteFramebuffers = _glDeleteFramebuffers;
                    var _glDeleteProgram = id=>{
                        if (!id)
                            return;
                        var program = GL.programs[id];
                        if (!program) {
                            GL.recordError(1281);
                            return
                        }
                        GLctx.deleteProgram(program);
                        program.name = 0;
                        GL.programs[id] = null
                    }
                    ;
                    var _emscripten_glDeleteProgram = _glDeleteProgram;
                    var _glDeleteQueries = (n,ids)=>{
                        for (var i = 0; i < n; i++) {
                            var id = HEAP32[ids + i * 4 >> 2];
                            var query = GL.queries[id];
                            if (!query)
                                continue;
                            GLctx.deleteQuery(query);
                            GL.queries[id] = null
                        }
                    }
                    ;
                    var _emscripten_glDeleteQueries = _glDeleteQueries;
                    var _glDeleteQueriesEXT = (n,ids)=>{
                        for (var i = 0; i < n; i++) {
                            var id = HEAP32[ids + i * 4 >> 2];
                            var query = GL.queries[id];
                            if (!query)
                                continue;
                            GLctx.disjointTimerQueryExt["deleteQueryEXT"](query);
                            GL.queries[id] = null
                        }
                    }
                    ;
                    var _emscripten_glDeleteQueriesEXT = _glDeleteQueriesEXT;
                    var _glDeleteRenderbuffers = (n,renderbuffers)=>{
                        for (var i = 0; i < n; i++) {
                            var id = HEAP32[renderbuffers + i * 4 >> 2];
                            var renderbuffer = GL.renderbuffers[id];
                            if (!renderbuffer)
                                continue;
                            GLctx.deleteRenderbuffer(renderbuffer);
                            renderbuffer.name = 0;
                            GL.renderbuffers[id] = null
                        }
                    }
                    ;
                    var _emscripten_glDeleteRenderbuffers = _glDeleteRenderbuffers;
                    var _glDeleteSamplers = (n,samplers)=>{
                        for (var i = 0; i < n; i++) {
                            var id = HEAP32[samplers + i * 4 >> 2];
                            var sampler = GL.samplers[id];
                            if (!sampler)
                                continue;
                            GLctx.deleteSampler(sampler);
                            sampler.name = 0;
                            GL.samplers[id] = null
                        }
                    }
                    ;
                    var _emscripten_glDeleteSamplers = _glDeleteSamplers;
                    var _glDeleteShader = id=>{
                        if (!id)
                            return;
                        var shader = GL.shaders[id];
                        if (!shader) {
                            GL.recordError(1281);
                            return
                        }
                        GLctx.deleteShader(shader);
                        GL.shaders[id] = null
                    }
                    ;
                    var _emscripten_glDeleteShader = _glDeleteShader;
                    var _glDeleteSync = id=>{
                        if (!id)
                            return;
                        var sync = GL.syncs[id];
                        if (!sync) {
                            GL.recordError(1281);
                            return
                        }
                        GLctx.deleteSync(sync);
                        sync.name = 0;
                        GL.syncs[id] = null
                    }
                    ;
                    var _emscripten_glDeleteSync = _glDeleteSync;
                    var _glDeleteTextures = (n,textures)=>{
                        for (var i = 0; i < n; i++) {
                            var id = HEAP32[textures + i * 4 >> 2];
                            var texture = GL.textures[id];
                            if (!texture)
                                continue;
                            GLctx.deleteTexture(texture);
                            texture.name = 0;
                            GL.textures[id] = null
                        }
                    }
                    ;
                    var _emscripten_glDeleteTextures = _glDeleteTextures;
                    var _glDeleteTransformFeedbacks = (n,ids)=>{
                        for (var i = 0; i < n; i++) {
                            var id = HEAP32[ids + i * 4 >> 2];
                            var transformFeedback = GL.transformFeedbacks[id];
                            if (!transformFeedback)
                                continue;
                            GLctx.deleteTransformFeedback(transformFeedback);
                            transformFeedback.name = 0;
                            GL.transformFeedbacks[id] = null
                        }
                    }
                    ;
                    var _emscripten_glDeleteTransformFeedbacks = _glDeleteTransformFeedbacks;
                    var _glDeleteVertexArrays = (n,vaos)=>{
                        for (var i = 0; i < n; i++) {
                            var id = HEAP32[vaos + i * 4 >> 2];
                            GLctx.deleteVertexArray(GL.vaos[id]);
                            GL.vaos[id] = null
                        }
                    }
                    ;
                    var _emscripten_glDeleteVertexArrays = _glDeleteVertexArrays;
                    var _glDeleteVertexArraysOES = _glDeleteVertexArrays;
                    var _emscripten_glDeleteVertexArraysOES = _glDeleteVertexArraysOES;
                    var _glDepthFunc = x0=>GLctx.depthFunc(x0);
                    var _emscripten_glDepthFunc = _glDepthFunc;
                    var _glDepthMask = flag=>{
                        GLctx.depthMask(!!flag)
                    }
                    ;
                    var _emscripten_glDepthMask = _glDepthMask;
                    var _glDepthRangef = (x0,x1)=>GLctx.depthRange(x0, x1);
                    var _emscripten_glDepthRangef = _glDepthRangef;
                    var _glDetachShader = (program,shader)=>{
                        GLctx.detachShader(GL.programs[program], GL.shaders[shader])
                    }
                    ;
                    var _emscripten_glDetachShader = _glDetachShader;
                    var _glDisable = x0=>GLctx.disable(x0);
                    var _emscripten_glDisable = _glDisable;
                    var _glDisableVertexAttribArray = index=>{
                        var cb = GL.currentContext.clientBuffers[index];
                        cb.enabled = false;
                        GLctx.disableVertexAttribArray(index)
                    }
                    ;
                    var _emscripten_glDisableVertexAttribArray = _glDisableVertexAttribArray;
                    var _glDrawArrays = (mode,first,count)=>{
                        GL.preDrawHandleClientVertexAttribBindings(first + count);
                        GLctx.drawArrays(mode, first, count);
                        GL.postDrawHandleClientVertexAttribBindings()
                    }
                    ;
                    var _emscripten_glDrawArrays = _glDrawArrays;
                    var _glDrawArraysInstanced = (mode,first,count,primcount)=>{
                        GLctx.drawArraysInstanced(mode, first, count, primcount)
                    }
                    ;
                    var _emscripten_glDrawArraysInstanced = _glDrawArraysInstanced;
                    var _glDrawArraysInstancedANGLE = _glDrawArraysInstanced;
                    var _emscripten_glDrawArraysInstancedANGLE = _glDrawArraysInstancedANGLE;
                    var _glDrawArraysInstancedARB = _glDrawArraysInstanced;
                    var _emscripten_glDrawArraysInstancedARB = _glDrawArraysInstancedARB;
                    var _glDrawArraysInstancedEXT = _glDrawArraysInstanced;
                    var _emscripten_glDrawArraysInstancedEXT = _glDrawArraysInstancedEXT;
                    var _glDrawArraysInstancedNV = _glDrawArraysInstanced;
                    var _emscripten_glDrawArraysInstancedNV = _glDrawArraysInstancedNV;
                    var tempFixedLengthArray = [];
                    var _glDrawBuffers = (n,bufs)=>{
                        var bufArray = tempFixedLengthArray[n];
                        for (var i = 0; i < n; i++) {
                            bufArray[i] = HEAP32[bufs + i * 4 >> 2]
                        }
                        GLctx.drawBuffers(bufArray)
                    }
                    ;
                    var _emscripten_glDrawBuffers = _glDrawBuffers;
                    var _glDrawBuffersEXT = _glDrawBuffers;
                    var _emscripten_glDrawBuffersEXT = _glDrawBuffersEXT;
                    var _glDrawBuffersWEBGL = _glDrawBuffers;
                    var _emscripten_glDrawBuffersWEBGL = _glDrawBuffersWEBGL;
                    var _glDrawElements = (mode,count,type,indices)=>{
                        var buf;
                        var vertexes = 0;
                        if (!GLctx.currentElementArrayBufferBinding) {
                            var size = GL.calcBufLength(1, type, 0, count);
                            buf = GL.getTempIndexBuffer(size);
                            GLctx.bindBuffer(34963, buf);
                            GLctx.bufferSubData(34963, 0, HEAPU8.subarray(indices, indices + size));
                            if (count > 0) {
                                for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
                                    var cb = GL.currentContext.clientBuffers[i];
                                    if (cb.clientside && cb.enabled) {
                                        let arrayClass;
                                        switch (type) {
                                        case 5121:
                                            arrayClass = Uint8Array;
                                            break;
                                        case 5123:
                                            arrayClass = Uint16Array;
                                            break;
                                        default:
                                            GL.recordError(1282);
                                            return
                                        }
                                        vertexes = new arrayClass(HEAPU8.buffer,indices,count).reduce((max,current)=>Math.max(max, current)) + 1;
                                        break
                                    }
                                }
                            }
                            indices = 0
                        }
                        GL.preDrawHandleClientVertexAttribBindings(vertexes);
                        GLctx.drawElements(mode, count, type, indices);
                        GL.postDrawHandleClientVertexAttribBindings(count);
                        if (!GLctx.currentElementArrayBufferBinding) {
                            GLctx.bindBuffer(34963, null)
                        }
                    }
                    ;
                    var _emscripten_glDrawElements = _glDrawElements;
                    var _glDrawElementsInstanced = (mode,count,type,indices,primcount)=>{
                        GLctx.drawElementsInstanced(mode, count, type, indices, primcount)
                    }
                    ;
                    var _emscripten_glDrawElementsInstanced = _glDrawElementsInstanced;
                    var _glDrawElementsInstancedANGLE = _glDrawElementsInstanced;
                    var _emscripten_glDrawElementsInstancedANGLE = _glDrawElementsInstancedANGLE;
                    var _glDrawElementsInstancedARB = _glDrawElementsInstanced;
                    var _emscripten_glDrawElementsInstancedARB = _glDrawElementsInstancedARB;
                    var _glDrawElementsInstancedEXT = _glDrawElementsInstanced;
                    var _emscripten_glDrawElementsInstancedEXT = _glDrawElementsInstancedEXT;
                    var _glDrawElementsInstancedNV = _glDrawElementsInstanced;
                    var _emscripten_glDrawElementsInstancedNV = _glDrawElementsInstancedNV;
                    var _glDrawRangeElements = (mode,start,end,count,type,indices)=>{
                        _glDrawElements(mode, count, type, indices)
                    }
                    ;
                    var _emscripten_glDrawRangeElements = _glDrawRangeElements;
                    var _glEnable = x0=>GLctx.enable(x0);
                    var _emscripten_glEnable = _glEnable;
                    var _glEnableVertexAttribArray = index=>{
                        var cb = GL.currentContext.clientBuffers[index];
                        cb.enabled = true;
                        GLctx.enableVertexAttribArray(index)
                    }
                    ;
                    var _emscripten_glEnableVertexAttribArray = _glEnableVertexAttribArray;
                    var _glEndQuery = x0=>GLctx.endQuery(x0);
                    var _emscripten_glEndQuery = _glEndQuery;
                    var _glEndQueryEXT = target=>{
                        GLctx.disjointTimerQueryExt["endQueryEXT"](target)
                    }
                    ;
                    var _emscripten_glEndQueryEXT = _glEndQueryEXT;
                    var _glEndTransformFeedback = ()=>GLctx.endTransformFeedback();
                    var _emscripten_glEndTransformFeedback = _glEndTransformFeedback;
                    var _glFenceSync = (condition,flags)=>{
                        var sync = GLctx.fenceSync(condition, flags);
                        if (sync) {
                            var id = GL.getNewId(GL.syncs);
                            sync.name = id;
                            GL.syncs[id] = sync;
                            return id
                        }
                        return 0
                    }
                    ;
                    var _emscripten_glFenceSync = _glFenceSync;
                    var _glFinish = ()=>GLctx.finish();
                    var _emscripten_glFinish = _glFinish;
                    var _glFlush = ()=>GLctx.flush();
                    var _emscripten_glFlush = _glFlush;
                    var _glFramebufferRenderbuffer = (target,attachment,renderbuffertarget,renderbuffer)=>{
                        GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer])
                    }
                    ;
                    var _emscripten_glFramebufferRenderbuffer = _glFramebufferRenderbuffer;
                    var _glFramebufferTexture2D = (target,attachment,textarget,texture,level)=>{
                        GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level)
                    }
                    ;
                    var _emscripten_glFramebufferTexture2D = _glFramebufferTexture2D;
                    var _glFramebufferTextureLayer = (target,attachment,texture,level,layer)=>{
                        GLctx.framebufferTextureLayer(target, attachment, GL.textures[texture], level, layer)
                    }
                    ;
                    var _emscripten_glFramebufferTextureLayer = _glFramebufferTextureLayer;
                    var _glFrontFace = x0=>GLctx.frontFace(x0);
                    var _emscripten_glFrontFace = _glFrontFace;
                    var _glGenBuffers = (n,buffers)=>{
                        GL.genObject(n, buffers, "createBuffer", GL.buffers)
                    }
                    ;
                    var _emscripten_glGenBuffers = _glGenBuffers;
                    var _glGenFramebuffers = (n,ids)=>{
                        GL.genObject(n, ids, "createFramebuffer", GL.framebuffers)
                    }
                    ;
                    var _emscripten_glGenFramebuffers = _glGenFramebuffers;
                    var _glGenQueries = (n,ids)=>{
                        GL.genObject(n, ids, "createQuery", GL.queries)
                    }
                    ;
                    var _emscripten_glGenQueries = _glGenQueries;
                    var _glGenQueriesEXT = (n,ids)=>{
                        for (var i = 0; i < n; i++) {
                            var query = GLctx.disjointTimerQueryExt["createQueryEXT"]();
                            if (!query) {
                                GL.recordError(1282);
                                while (i < n)
                                    HEAP32[ids + i++ * 4 >> 2] = 0;
                                return
                            }
                            var id = GL.getNewId(GL.queries);
                            query.name = id;
                            GL.queries[id] = query;
                            HEAP32[ids + i * 4 >> 2] = id
                        }
                    }
                    ;
                    var _emscripten_glGenQueriesEXT = _glGenQueriesEXT;
                    var _glGenRenderbuffers = (n,renderbuffers)=>{
                        GL.genObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers)
                    }
                    ;
                    var _emscripten_glGenRenderbuffers = _glGenRenderbuffers;
                    var _glGenSamplers = (n,samplers)=>{
                        GL.genObject(n, samplers, "createSampler", GL.samplers)
                    }
                    ;
                    var _emscripten_glGenSamplers = _glGenSamplers;
                    var _glGenTextures = (n,textures)=>{
                        GL.genObject(n, textures, "createTexture", GL.textures)
                    }
                    ;
                    var _emscripten_glGenTextures = _glGenTextures;
                    var _glGenTransformFeedbacks = (n,ids)=>{
                        GL.genObject(n, ids, "createTransformFeedback", GL.transformFeedbacks)
                    }
                    ;
                    var _emscripten_glGenTransformFeedbacks = _glGenTransformFeedbacks;
                    var _glGenVertexArrays = (n,arrays)=>{
                        GL.genObject(n, arrays, "createVertexArray", GL.vaos)
                    }
                    ;
                    var _emscripten_glGenVertexArrays = _glGenVertexArrays;
                    var _glGenVertexArraysOES = _glGenVertexArrays;
                    var _emscripten_glGenVertexArraysOES = _glGenVertexArraysOES;
                    var _glGenerateMipmap = x0=>GLctx.generateMipmap(x0);
                    var _emscripten_glGenerateMipmap = _glGenerateMipmap;
                    var __glGetActiveAttribOrUniform = (funcName,program,index,bufSize,length,size,type,name)=>{
                        program = GL.programs[program];
                        var info = GLctx[funcName](program, index);
                        if (info) {
                            var numBytesWrittenExclNull = name && stringToUTF8(info.name, name, bufSize);
                            if (length)
                                HEAP32[length >> 2] = numBytesWrittenExclNull;
                            if (size)
                                HEAP32[size >> 2] = info.size;
                            if (type)
                                HEAP32[type >> 2] = info.type
                        }
                    }
                    ;
                    var _glGetActiveAttrib = (program,index,bufSize,length,size,type,name)=>__glGetActiveAttribOrUniform("getActiveAttrib", program, index, bufSize, length, size, type, name);
                    var _emscripten_glGetActiveAttrib = _glGetActiveAttrib;
                    var _glGetActiveUniform = (program,index,bufSize,length,size,type,name)=>__glGetActiveAttribOrUniform("getActiveUniform", program, index, bufSize, length, size, type, name);
                    var _emscripten_glGetActiveUniform = _glGetActiveUniform;
                    var _glGetActiveUniformBlockName = (program,uniformBlockIndex,bufSize,length,uniformBlockName)=>{
                        program = GL.programs[program];
                        var result = GLctx.getActiveUniformBlockName(program, uniformBlockIndex);
                        if (!result)
                            return;
                        if (uniformBlockName && bufSize > 0) {
                            var numBytesWrittenExclNull = stringToUTF8(result, uniformBlockName, bufSize);
                            if (length)
                                HEAP32[length >> 2] = numBytesWrittenExclNull
                        } else {
                            if (length)
                                HEAP32[length >> 2] = 0
                        }
                    }
                    ;
                    var _emscripten_glGetActiveUniformBlockName = _glGetActiveUniformBlockName;
                    var _glGetActiveUniformBlockiv = (program,uniformBlockIndex,pname,params)=>{
                        if (!params) {
                            GL.recordError(1281);
                            return
                        }
                        program = GL.programs[program];
                        if (pname == 35393) {
                            var name = GLctx.getActiveUniformBlockName(program, uniformBlockIndex);
                            HEAP32[params >> 2] = name.length + 1;
                            return
                        }
                        var result = GLctx.getActiveUniformBlockParameter(program, uniformBlockIndex, pname);
                        if (result === null)
                            return;
                        if (pname == 35395) {
                            for (var i = 0; i < result.length; i++) {
                                HEAP32[params + i * 4 >> 2] = result[i]
                            }
                        } else {
                            HEAP32[params >> 2] = result
                        }
                    }
                    ;
                    var _emscripten_glGetActiveUniformBlockiv = _glGetActiveUniformBlockiv;
                    var _glGetActiveUniformsiv = (program,uniformCount,uniformIndices,pname,params)=>{
                        if (!params) {
                            GL.recordError(1281);
                            return
                        }
                        if (uniformCount > 0 && uniformIndices == 0) {
                            GL.recordError(1281);
                            return
                        }
                        program = GL.programs[program];
                        var ids = [];
                        for (var i = 0; i < uniformCount; i++) {
                            ids.push(HEAP32[uniformIndices + i * 4 >> 2])
                        }
                        var result = GLctx.getActiveUniforms(program, ids, pname);
                        if (!result)
                            return;
                        var len = result.length;
                        for (var i = 0; i < len; i++) {
                            HEAP32[params + i * 4 >> 2] = result[i]
                        }
                    }
                    ;
                    var _emscripten_glGetActiveUniformsiv = _glGetActiveUniformsiv;
                    var _glGetAttachedShaders = (program,maxCount,count,shaders)=>{
                        var result = GLctx.getAttachedShaders(GL.programs[program]);
                        var len = result.length;
                        if (len > maxCount) {
                            len = maxCount
                        }
                        HEAP32[count >> 2] = len;
                        for (var i = 0; i < len; ++i) {
                            var id = GL.shaders.indexOf(result[i]);
                            HEAP32[shaders + i * 4 >> 2] = id
                        }
                    }
                    ;
                    var _emscripten_glGetAttachedShaders = _glGetAttachedShaders;
                    var _glGetAttribLocation = (program,name)=>GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));
                    var _emscripten_glGetAttribLocation = _glGetAttribLocation;
                    var writeI53ToI64 = (ptr,num)=>{
                        HEAPU32[ptr >> 2] = num;
                        var lower = HEAPU32[ptr >> 2];
                        HEAPU32[ptr + 4 >> 2] = (num - lower) / 4294967296
                    }
                    ;
                    var webglGetExtensions = ()=>{
                        var exts = getEmscriptenSupportedExtensions(GLctx);
                        exts = exts.concat(exts.map(e=>"GL_" + e));
                        return exts
                    }
                    ;
                    var emscriptenWebGLGet = (name_,p,type)=>{
                        if (!p) {
                            GL.recordError(1281);
                            return
                        }
                        var ret = undefined;
                        switch (name_) {
                        case 36346:
                            ret = 1;
                            break;
                        case 36344:
                            if (type != 0 && type != 1) {
                                GL.recordError(1280)
                            }
                            return;
                        case 34814:
                        case 36345:
                            ret = 0;
                            break;
                        case 34466:
                            var formats = GLctx.getParameter(34467);
                            ret = formats ? formats.length : 0;
                            break;
                        case 33309:
                            if (GL.currentContext.version < 2) {
                                GL.recordError(1282);
                                return
                            }
                            ret = webglGetExtensions().length;
                            break;
                        case 33307:
                        case 33308:
                            if (GL.currentContext.version < 2) {
                                GL.recordError(1280);
                                return
                            }
                            ret = name_ == 33307 ? 3 : 0;
                            break
                        }
                        if (ret === undefined) {
                            var result = GLctx.getParameter(name_);
                            switch (typeof result) {
                            case "number":
                                ret = result;
                                break;
                            case "boolean":
                                ret = result ? 1 : 0;
                                break;
                            case "string":
                                GL.recordError(1280);
                                return;
                            case "object":
                                if (result === null) {
                                    switch (name_) {
                                    case 34964:
                                    case 35725:
                                    case 34965:
                                    case 36006:
                                    case 36007:
                                    case 32873:
                                    case 34229:
                                    case 36662:
                                    case 36663:
                                    case 35053:
                                    case 35055:
                                    case 36010:
                                    case 35097:
                                    case 35869:
                                    case 32874:
                                    case 36389:
                                    case 35983:
                                    case 35368:
                                    case 34068:
                                        {
                                            ret = 0;
                                            break
                                        }
                                    default:
                                        {
                                            GL.recordError(1280);
                                            return
                                        }
                                    }
                                } else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
                                    for (var i = 0; i < result.length; ++i) {
                                        switch (type) {
                                        case 0:
                                            HEAP32[p + i * 4 >> 2] = result[i];
                                            break;
                                        case 2:
                                            HEAPF32[p + i * 4 >> 2] = result[i];
                                            break;
                                        case 4:
                                            HEAP8[p + i] = result[i] ? 1 : 0;
                                            break
                                        }
                                    }
                                    return
                                } else {
                                    try {
                                        ret = result.name | 0
                                    } catch (e) {
                                        GL.recordError(1280);
                                        err(`GL_INVALID_ENUM in glGet${type}v: Unknown object returned from WebGL getParameter(${name_})! (error: ${e})`);
                                        return
                                    }
                                }
                                break;
                            default:
                                GL.recordError(1280);
                                err(`GL_INVALID_ENUM in glGet${type}v: Native code calling glGet${type}v(${name_}) and it returns ${result} of type ${typeof result}!`);
                                return
                            }
                        }
                        switch (type) {
                        case 1:
                            writeI53ToI64(p, ret);
                            break;
                        case 0:
                            HEAP32[p >> 2] = ret;
                            break;
                        case 2:
                            HEAPF32[p >> 2] = ret;
                            break;
                        case 4:
                            HEAP8[p] = ret ? 1 : 0;
                            break
                        }
                    }
                    ;
                    var _glGetBooleanv = (name_,p)=>emscriptenWebGLGet(name_, p, 4);
                    var _emscripten_glGetBooleanv = _glGetBooleanv;
                    var _glGetBufferParameteri64v = (target,value,data)=>{
                        if (!data) {
                            GL.recordError(1281);
                            return
                        }
                        writeI53ToI64(data, GLctx.getBufferParameter(target, value))
                    }
                    ;
                    var _emscripten_glGetBufferParameteri64v = _glGetBufferParameteri64v;
                    var _glGetBufferParameteriv = (target,value,data)=>{
                        if (!data) {
                            GL.recordError(1281);
                            return
                        }
                        HEAP32[data >> 2] = GLctx.getBufferParameter(target, value)
                    }
                    ;
                    var _emscripten_glGetBufferParameteriv = _glGetBufferParameteriv;
                    var _glGetError = ()=>{
                        var error = GLctx.getError() || GL.lastError;
                        GL.lastError = 0;
                        return error
                    }
                    ;
                    var _emscripten_glGetError = _glGetError;
                    var _glGetFloatv = (name_,p)=>emscriptenWebGLGet(name_, p, 2);
                    var _emscripten_glGetFloatv = _glGetFloatv;
                    var _glGetFragDataLocation = (program,name)=>GLctx.getFragDataLocation(GL.programs[program], UTF8ToString(name));
                    var _emscripten_glGetFragDataLocation = _glGetFragDataLocation;
                    var _glGetFramebufferAttachmentParameteriv = (target,attachment,pname,params)=>{
                        var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
                        if (result instanceof WebGLRenderbuffer || result instanceof WebGLTexture) {
                            result = result.name | 0
                        }
                        HEAP32[params >> 2] = result
                    }
                    ;
                    var _emscripten_glGetFramebufferAttachmentParameteriv = _glGetFramebufferAttachmentParameteriv;
                    var emscriptenWebGLGetIndexed = (target,index,data,type)=>{
                        if (!data) {
                            GL.recordError(1281);
                            return
                        }
                        var result = GLctx.getIndexedParameter(target, index);
                        var ret;
                        switch (typeof result) {
                        case "boolean":
                            ret = result ? 1 : 0;
                            break;
                        case "number":
                            ret = result;
                            break;
                        case "object":
                            if (result === null) {
                                switch (target) {
                                case 35983:
                                case 35368:
                                    ret = 0;
                                    break;
                                default:
                                    {
                                        GL.recordError(1280);
                                        return
                                    }
                                }
                            } else if (result instanceof WebGLBuffer) {
                                ret = result.name | 0
                            } else {
                                GL.recordError(1280);
                                return
                            }
                            break;
                        default:
                            GL.recordError(1280);
                            return
                        }
                        switch (type) {
                        case 1:
                            writeI53ToI64(data, ret);
                            break;
                        case 0:
                            HEAP32[data >> 2] = ret;
                            break;
                        case 2:
                            HEAPF32[data >> 2] = ret;
                            break;
                        case 4:
                            HEAP8[data] = ret ? 1 : 0;
                            break;
                        default:
                            throw "internal emscriptenWebGLGetIndexed() error, bad type: " + type
                        }
                    }
                    ;
                    var _glGetInteger64i_v = (target,index,data)=>emscriptenWebGLGetIndexed(target, index, data, 1);
                    var _emscripten_glGetInteger64i_v = _glGetInteger64i_v;
                    var _glGetInteger64v = (name_,p)=>{
                        emscriptenWebGLGet(name_, p, 1)
                    }
                    ;
                    var _emscripten_glGetInteger64v = _glGetInteger64v;
                    var _glGetIntegeri_v = (target,index,data)=>emscriptenWebGLGetIndexed(target, index, data, 0);
                    var _emscripten_glGetIntegeri_v = _glGetIntegeri_v;
                    var _glGetIntegerv = (name_,p)=>emscriptenWebGLGet(name_, p, 0);
                    var _emscripten_glGetIntegerv = _glGetIntegerv;
                    var _glGetInternalformativ = (target,internalformat,pname,bufSize,params)=>{
                        if (bufSize < 0) {
                            GL.recordError(1281);
                            return
                        }
                        if (!params) {
                            GL.recordError(1281);
                            return
                        }
                        var ret = GLctx.getInternalformatParameter(target, internalformat, pname);
                        if (ret === null)
                            return;
                        for (var i = 0; i < ret.length && i < bufSize; ++i) {
                            HEAP32[params + i * 4 >> 2] = ret[i]
                        }
                    }
                    ;
                    var _emscripten_glGetInternalformativ = _glGetInternalformativ;
                    var _glGetProgramBinary = (program,bufSize,length,binaryFormat,binary)=>{
                        GL.recordError(1282)
                    }
                    ;
                    var _emscripten_glGetProgramBinary = _glGetProgramBinary;
                    var _glGetProgramInfoLog = (program,maxLength,length,infoLog)=>{
                        var log = GLctx.getProgramInfoLog(GL.programs[program]);
                        if (log === null)
                            log = "(unknown error)";
                        var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
                        if (length)
                            HEAP32[length >> 2] = numBytesWrittenExclNull
                    }
                    ;
                    var _emscripten_glGetProgramInfoLog = _glGetProgramInfoLog;
                    var _glGetProgramiv = (program,pname,p)=>{
                        if (!p) {
                            GL.recordError(1281);
                            return
                        }
                        if (program >= GL.counter) {
                            GL.recordError(1281);
                            return
                        }
                        program = GL.programs[program];
                        if (pname == 35716) {
                            var log = GLctx.getProgramInfoLog(program);
                            if (log === null)
                                log = "(unknown error)";
                            HEAP32[p >> 2] = log.length + 1
                        } else if (pname == 35719) {
                            if (!program.maxUniformLength) {
                                var numActiveUniforms = GLctx.getProgramParameter(program, 35718);
                                for (var i = 0; i < numActiveUniforms; ++i) {
                                    program.maxUniformLength = Math.max(program.maxUniformLength, GLctx.getActiveUniform(program, i).name.length + 1)
                                }
                            }
                            HEAP32[p >> 2] = program.maxUniformLength
                        } else if (pname == 35722) {
                            if (!program.maxAttributeLength) {
                                var numActiveAttributes = GLctx.getProgramParameter(program, 35721);
                                for (var i = 0; i < numActiveAttributes; ++i) {
                                    program.maxAttributeLength = Math.max(program.maxAttributeLength, GLctx.getActiveAttrib(program, i).name.length + 1)
                                }
                            }
                            HEAP32[p >> 2] = program.maxAttributeLength
                        } else if (pname == 35381) {
                            if (!program.maxUniformBlockNameLength) {
                                var numActiveUniformBlocks = GLctx.getProgramParameter(program, 35382);
                                for (var i = 0; i < numActiveUniformBlocks; ++i) {
                                    program.maxUniformBlockNameLength = Math.max(program.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(program, i).length + 1)
                                }
                            }
                            HEAP32[p >> 2] = program.maxUniformBlockNameLength
                        } else {
                            HEAP32[p >> 2] = GLctx.getProgramParameter(program, pname)
                        }
                    }
                    ;
                    var _emscripten_glGetProgramiv = _glGetProgramiv;
                    var _glGetQueryObjecti64vEXT = (id,pname,params)=>{
                        if (!params) {
                            GL.recordError(1281);
                            return
                        }
                        var query = GL.queries[id];
                        var param;
                        if (GL.currentContext.version < 2) {
                            param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname)
                        } else {
                            param = GLctx.getQueryParameter(query, pname)
                        }
                        var ret;
                        if (typeof param == "boolean") {
                            ret = param ? 1 : 0
                        } else {
                            ret = param
                        }
                        writeI53ToI64(params, ret)
                    }
                    ;
                    var _emscripten_glGetQueryObjecti64vEXT = _glGetQueryObjecti64vEXT;
                    var _glGetQueryObjectivEXT = (id,pname,params)=>{
                        if (!params) {
                            GL.recordError(1281);
                            return
                        }
                        var query = GL.queries[id];
                        var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
                        var ret;
                        if (typeof param == "boolean") {
                            ret = param ? 1 : 0
                        } else {
                            ret = param
                        }
                        HEAP32[params >> 2] = ret
                    }
                    ;
                    var _emscripten_glGetQueryObjectivEXT = _glGetQueryObjectivEXT;
                    var _glGetQueryObjectui64vEXT = _glGetQueryObjecti64vEXT;
                    var _emscripten_glGetQueryObjectui64vEXT = _glGetQueryObjectui64vEXT;
                    var _glGetQueryObjectuiv = (id,pname,params)=>{
                        if (!params) {
                            GL.recordError(1281);
                            return
                        }
                        var query = GL.queries[id];
                        var param = GLctx.getQueryParameter(query, pname);
                        var ret;
                        if (typeof param == "boolean") {
                            ret = param ? 1 : 0
                        } else {
                            ret = param
                        }
                        HEAP32[params >> 2] = ret
                    }
                    ;
                    var _emscripten_glGetQueryObjectuiv = _glGetQueryObjectuiv;
                    var _glGetQueryObjectuivEXT = _glGetQueryObjectivEXT;
                    var _emscripten_glGetQueryObjectuivEXT = _glGetQueryObjectuivEXT;
                    var _glGetQueryiv = (target,pname,params)=>{
                        if (!params) {
                            GL.recordError(1281);
                            return
                        }
                        HEAP32[params >> 2] = GLctx.getQuery(target, pname)
                    }
                    ;
                    var _emscripten_glGetQueryiv = _glGetQueryiv;
                    var _glGetQueryivEXT = (target,pname,params)=>{
                        if (!params) {
                            GL.recordError(1281);
                            return
                        }
                        HEAP32[params >> 2] = GLctx.disjointTimerQueryExt["getQueryEXT"](target, pname)
                    }
                    ;
                    var _emscripten_glGetQueryivEXT = _glGetQueryivEXT;
                    var _glGetRenderbufferParameteriv = (target,pname,params)=>{
                        if (!params) {
                            GL.recordError(1281);
                            return
                        }
                        HEAP32[params >> 2] = GLctx.getRenderbufferParameter(target, pname)
                    }
                    ;
                    var _emscripten_glGetRenderbufferParameteriv = _glGetRenderbufferParameteriv;
                    var _glGetSamplerParameterfv = (sampler,pname,params)=>{
                        if (!params) {
                            GL.recordError(1281);
                            return
                        }
                        HEAPF32[params >> 2] = GLctx.getSamplerParameter(GL.samplers[sampler], pname)
                    }
                    ;
                    var _emscripten_glGetSamplerParameterfv = _glGetSamplerParameterfv;
                    var _glGetSamplerParameteriv = (sampler,pname,params)=>{
                        if (!params) {
                            GL.recordError(1281);
                            return
                        }
                        HEAP32[params >> 2] = GLctx.getSamplerParameter(GL.samplers[sampler], pname)
                    }
                    ;
                    var _emscripten_glGetSamplerParameteriv = _glGetSamplerParameteriv;
                    var _glGetShaderInfoLog = (shader,maxLength,length,infoLog)=>{
                        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
                        if (log === null)
                            log = "(unknown error)";
                        var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
                        if (length)
                            HEAP32[length >> 2] = numBytesWrittenExclNull
                    }
                    ;
                    var _emscripten_glGetShaderInfoLog = _glGetShaderInfoLog;
                    var _glGetShaderPrecisionFormat = (shaderType,precisionType,range,precision)=>{
                        var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
                        HEAP32[range >> 2] = result.rangeMin;
                        HEAP32[range + 4 >> 2] = result.rangeMax;
                        HEAP32[precision >> 2] = result.precision
                    }
                    ;
                    var _emscripten_glGetShaderPrecisionFormat = _glGetShaderPrecisionFormat;
                    var _glGetShaderSource = (shader,bufSize,length,source)=>{
                        var result = GLctx.getShaderSource(GL.shaders[shader]);
                        if (!result)
                            return;
                        var numBytesWrittenExclNull = bufSize > 0 && source ? stringToUTF8(result, source, bufSize) : 0;
                        if (length)
                            HEAP32[length >> 2] = numBytesWrittenExclNull
                    }
                    ;
                    var _emscripten_glGetShaderSource = _glGetShaderSource;
                    var _glGetShaderiv = (shader,pname,p)=>{
                        if (!p) {
                            GL.recordError(1281);
                            return
                        }
                        if (pname == 35716) {
                            var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
                            if (log === null)
                                log = "(unknown error)";
                            var logLength = log ? log.length + 1 : 0;
                            HEAP32[p >> 2] = logLength
                        } else if (pname == 35720) {
                            var source = GLctx.getShaderSource(GL.shaders[shader]);
                            var sourceLength = source ? source.length + 1 : 0;
                            HEAP32[p >> 2] = sourceLength
                        } else {
                            HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname)
                        }
                    }
                    ;
                    var _emscripten_glGetShaderiv = _glGetShaderiv;
                    var stringToNewUTF8 = str=>{
                        var size = lengthBytesUTF8(str) + 1;
                        var ret = _malloc(size);
                        if (ret)
                            stringToUTF8(str, ret, size);
                        return ret
                    }
                    ;
                    var _glGetString = name_=>{
                        var ret = GL.stringCache[name_];
                        if (!ret) {
                            switch (name_) {
                            case 7939:
                                ret = stringToNewUTF8(webglGetExtensions().join(" "));
                                break;
                            case 7936:
                            case 7937:
                            case 37445:
                            case 37446:
                                var s = GLctx.getParameter(name_);
                                if (!s) {
                                    GL.recordError(1280)
                                }
                                ret = s ? stringToNewUTF8(s) : 0;
                                break;
                            case 7938:
                                var webGLVersion = GLctx.getParameter(7938);
                                var glVersion = `OpenGL ES 2.0 (${webGLVersion})`;
                                if (GL.currentContext.version >= 2)
                                    glVersion = `OpenGL ES 3.0 (${webGLVersion})`;
                                ret = stringToNewUTF8(glVersion);
                                break;
                            case 35724:
                                var glslVersion = GLctx.getParameter(35724);
                                var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
                                var ver_num = glslVersion.match(ver_re);
                                if (ver_num !== null) {
                                    if (ver_num[1].length == 3)
                                        ver_num[1] = ver_num[1] + "0";
                                    glslVersion = `OpenGL ES GLSL ES ${ver_num[1]} (${glslVersion})`
                                }
                                ret = stringToNewUTF8(glslVersion);
                                break;
                            default:
                                GL.recordError(1280)
                            }
                            GL.stringCache[name_] = ret
                        }
                        return ret
                    }
                    ;
                    var _emscripten_glGetString = _glGetString;
                    var _glGetStringi = (name,index)=>{
                        if (GL.currentContext.version < 2) {
                            GL.recordError(1282);
                            return 0
                        }
                        var stringiCache = GL.stringiCache[name];
                        if (stringiCache) {
                            if (index < 0 || index >= stringiCache.length) {
                                GL.recordError(1281);
                                return 0
                            }
                            return stringiCache[index]
                        }
                        switch (name) {
                        case 7939:
                            var exts = webglGetExtensions().map(stringToNewUTF8);
                            stringiCache = GL.stringiCache[name] = exts;
                            if (index < 0 || index >= stringiCache.length) {
                                GL.recordError(1281);
                                return 0
                            }
                            return stringiCache[index];
                        default:
                            GL.recordError(1280);
                            return 0
                        }
                    }
                    ;
                    var _emscripten_glGetStringi = _glGetStringi;
                    var _glGetSynciv = (sync,pname,bufSize,length,values)=>{
                        if (bufSize < 0) {
                            GL.recordError(1281);
                            return
                        }
                        if (!values) {
                            GL.recordError(1281);
                            return
                        }
                        var ret = GLctx.getSyncParameter(GL.syncs[sync], pname);
                        if (ret !== null) {
                            HEAP32[values >> 2] = ret;
                            if (length)
                                HEAP32[length >> 2] = 1
                        }
                    }
                    ;
                    var _emscripten_glGetSynciv = _glGetSynciv;
                    var _glGetTexParameterfv = (target,pname,params)=>{
                        if (!params) {
                            GL.recordError(1281);
                            return
                        }
                        HEAPF32[params >> 2] = GLctx.getTexParameter(target, pname)
                    }
                    ;
                    var _emscripten_glGetTexParameterfv = _glGetTexParameterfv;
                    var _glGetTexParameteriv = (target,pname,params)=>{
                        if (!params) {
                            GL.recordError(1281);
                            return
                        }
                        HEAP32[params >> 2] = GLctx.getTexParameter(target, pname)
                    }
                    ;
                    var _emscripten_glGetTexParameteriv = _glGetTexParameteriv;
                    var _glGetTransformFeedbackVarying = (program,index,bufSize,length,size,type,name)=>{
                        program = GL.programs[program];
                        var info = GLctx.getTransformFeedbackVarying(program, index);
                        if (!info)
                            return;
                        if (name && bufSize > 0) {
                            var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize);
                            if (length)
                                HEAP32[length >> 2] = numBytesWrittenExclNull
                        } else {
                            if (length)
                                HEAP32[length >> 2] = 0
                        }
                        if (size)
                            HEAP32[size >> 2] = info.size;
                        if (type)
                            HEAP32[type >> 2] = info.type
                    }
                    ;
                    var _emscripten_glGetTransformFeedbackVarying = _glGetTransformFeedbackVarying;
                    var _glGetUniformBlockIndex = (program,uniformBlockName)=>GLctx.getUniformBlockIndex(GL.programs[program], UTF8ToString(uniformBlockName));
                    var _emscripten_glGetUniformBlockIndex = _glGetUniformBlockIndex;
                    var _glGetUniformIndices = (program,uniformCount,uniformNames,uniformIndices)=>{
                        if (!uniformIndices) {
                            GL.recordError(1281);
                            return
                        }
                        if (uniformCount > 0 && (uniformNames == 0 || uniformIndices == 0)) {
                            GL.recordError(1281);
                            return
                        }
                        program = GL.programs[program];
                        var names = [];
                        for (var i = 0; i < uniformCount; i++)
                            names.push(UTF8ToString(HEAP32[uniformNames + i * 4 >> 2]));
                        var result = GLctx.getUniformIndices(program, names);
                        if (!result)
                            return;
                        var len = result.length;
                        for (var i = 0; i < len; i++) {
                            HEAP32[uniformIndices + i * 4 >> 2] = result[i]
                        }
                    }
                    ;
                    var _emscripten_glGetUniformIndices = _glGetUniformIndices;
                    var jstoi_q = str=>parseInt(str);
                    var webglGetLeftBracePos = name=>name.slice(-1) == "]" && name.lastIndexOf("[");
                    var webglPrepareUniformLocationsBeforeFirstUse = program=>{
                        var uniformLocsById = program.uniformLocsById, uniformSizeAndIdsByName = program.uniformSizeAndIdsByName, i, j;
                        if (!uniformLocsById) {
                            program.uniformLocsById = uniformLocsById = {};
                            program.uniformArrayNamesById = {};
                            var numActiveUniforms = GLctx.getProgramParameter(program, 35718);
                            for (i = 0; i < numActiveUniforms; ++i) {
                                var u = GLctx.getActiveUniform(program, i);
                                var nm = u.name;
                                var sz = u.size;
                                var lb = webglGetLeftBracePos(nm);
                                var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
                                var id = program.uniformIdCounter;
                                program.uniformIdCounter += sz;
                                uniformSizeAndIdsByName[arrayName] = [sz, id];
                                for (j = 0; j < sz; ++j) {
                                    uniformLocsById[id] = j;
                                    program.uniformArrayNamesById[id++] = arrayName
                                }
                            }
                        }
                    }
                    ;
                    var _glGetUniformLocation = (program,name)=>{
                        name = UTF8ToString(name);
                        if (program = GL.programs[program]) {
                            webglPrepareUniformLocationsBeforeFirstUse(program);
                            var uniformLocsById = program.uniformLocsById;
                            var arrayIndex = 0;
                            var uniformBaseName = name;
                            var leftBrace = webglGetLeftBracePos(name);
                            if (leftBrace > 0) {
                                arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
                                uniformBaseName = name.slice(0, leftBrace)
                            }
                            var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
                            if (sizeAndId && arrayIndex < sizeAndId[0]) {
                                arrayIndex += sizeAndId[1];
                                if (uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name)) {
                                    return arrayIndex
                                }
                            }
                        } else {
                            GL.recordError(1281)
                        }
                        return -1
                    }
                    ;
                    var _emscripten_glGetUniformLocation = _glGetUniformLocation;
                    var webglGetUniformLocation = location=>{
                        var p = GLctx.currentProgram;
                        if (p) {
                            var webglLoc = p.uniformLocsById[location];
                            if (typeof webglLoc == "number") {
                                p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(p, p.uniformArrayNamesById[location] + (webglLoc > 0 ? `[${webglLoc}]` : ""))
                            }
                            return webglLoc
                        } else {
                            GL.recordError(1282)
                        }
                    }
                    ;
                    var emscriptenWebGLGetUniform = (program,location,params,type)=>{
                        if (!params) {
                            GL.recordError(1281);
                            return
                        }
                        program = GL.programs[program];
                        webglPrepareUniformLocationsBeforeFirstUse(program);
                        var data = GLctx.getUniform(program, webglGetUniformLocation(location));
                        if (typeof data == "number" || typeof data == "boolean") {
                            switch (type) {
                            case 0:
                                HEAP32[params >> 2] = data;
                                break;
                            case 2:
                                HEAPF32[params >> 2] = data;
                                break
                            }
                        } else {
                            for (var i = 0; i < data.length; i++) {
                                switch (type) {
                                case 0:
                                    HEAP32[params + i * 4 >> 2] = data[i];
                                    break;
                                case 2:
                                    HEAPF32[params + i * 4 >> 2] = data[i];
                                    break
                                }
                            }
                        }
                    }
                    ;
                    var _glGetUniformfv = (program,location,params)=>{
                        emscriptenWebGLGetUniform(program, location, params, 2)
                    }
                    ;
                    var _emscripten_glGetUniformfv = _glGetUniformfv;
                    var _glGetUniformiv = (program,location,params)=>{
                        emscriptenWebGLGetUniform(program, location, params, 0)
                    }
                    ;
                    var _emscripten_glGetUniformiv = _glGetUniformiv;
                    var _glGetUniformuiv = (program,location,params)=>emscriptenWebGLGetUniform(program, location, params, 0);
                    var _emscripten_glGetUniformuiv = _glGetUniformuiv;
                    var emscriptenWebGLGetVertexAttrib = (index,pname,params,type)=>{
                        if (!params) {
                            GL.recordError(1281);
                            return
                        }
                        if (GL.currentContext.clientBuffers[index].enabled) {
                            err("glGetVertexAttrib*v on client-side array: not supported, bad data returned")
                        }
                        var data = GLctx.getVertexAttrib(index, pname);
                        if (pname == 34975) {
                            HEAP32[params >> 2] = data && data["name"]
                        } else if (typeof data == "number" || typeof data == "boolean") {
                            switch (type) {
                            case 0:
                                HEAP32[params >> 2] = data;
                                break;
                            case 2:
                                HEAPF32[params >> 2] = data;
                                break;
                            case 5:
                                HEAP32[params >> 2] = Math.fround(data);
                                break
                            }
                        } else {
                            for (var i = 0; i < data.length; i++) {
                                switch (type) {
                                case 0:
                                    HEAP32[params + i * 4 >> 2] = data[i];
                                    break;
                                case 2:
                                    HEAPF32[params + i * 4 >> 2] = data[i];
                                    break;
                                case 5:
                                    HEAP32[params + i * 4 >> 2] = Math.fround(data[i]);
                                    break
                                }
                            }
                        }
                    }
                    ;
                    var _glGetVertexAttribIiv = (index,pname,params)=>{
                        emscriptenWebGLGetVertexAttrib(index, pname, params, 0)
                    }
                    ;
                    var _emscripten_glGetVertexAttribIiv = _glGetVertexAttribIiv;
                    var _glGetVertexAttribIuiv = _glGetVertexAttribIiv;
                    var _emscripten_glGetVertexAttribIuiv = _glGetVertexAttribIuiv;
                    var _glGetVertexAttribPointerv = (index,pname,pointer)=>{
                        if (!pointer) {
                            GL.recordError(1281);
                            return
                        }
                        if (GL.currentContext.clientBuffers[index].enabled) {
                            err("glGetVertexAttribPointer on client-side array: not supported, bad data returned")
                        }
                        HEAP32[pointer >> 2] = GLctx.getVertexAttribOffset(index, pname)
                    }
                    ;
                    var _emscripten_glGetVertexAttribPointerv = _glGetVertexAttribPointerv;
                    var _glGetVertexAttribfv = (index,pname,params)=>{
                        emscriptenWebGLGetVertexAttrib(index, pname, params, 2)
                    }
                    ;
                    var _emscripten_glGetVertexAttribfv = _glGetVertexAttribfv;
                    var _glGetVertexAttribiv = (index,pname,params)=>{
                        emscriptenWebGLGetVertexAttrib(index, pname, params, 5)
                    }
                    ;
                    var _emscripten_glGetVertexAttribiv = _glGetVertexAttribiv;
                    var _glHint = (x0,x1)=>GLctx.hint(x0, x1);
                    var _emscripten_glHint = _glHint;
                    var _glInvalidateFramebuffer = (target,numAttachments,attachments)=>{
                        var list = tempFixedLengthArray[numAttachments];
                        for (var i = 0; i < numAttachments; i++) {
                            list[i] = HEAP32[attachments + i * 4 >> 2]
                        }
                        GLctx.invalidateFramebuffer(target, list)
                    }
                    ;
                    var _emscripten_glInvalidateFramebuffer = _glInvalidateFramebuffer;
                    var _glInvalidateSubFramebuffer = (target,numAttachments,attachments,x,y,width,height)=>{
                        var list = tempFixedLengthArray[numAttachments];
                        for (var i = 0; i < numAttachments; i++) {
                            list[i] = HEAP32[attachments + i * 4 >> 2]
                        }
                        GLctx.invalidateSubFramebuffer(target, list, x, y, width, height)
                    }
                    ;
                    var _emscripten_glInvalidateSubFramebuffer = _glInvalidateSubFramebuffer;
                    var _glIsBuffer = buffer=>{
                        var b = GL.buffers[buffer];
                        if (!b)
                            return 0;
                        return GLctx.isBuffer(b)
                    }
                    ;
                    var _emscripten_glIsBuffer = _glIsBuffer;
                    var _glIsEnabled = x0=>GLctx.isEnabled(x0);
                    var _emscripten_glIsEnabled = _glIsEnabled;
                    var _glIsFramebuffer = framebuffer=>{
                        var fb = GL.framebuffers[framebuffer];
                        if (!fb)
                            return 0;
                        return GLctx.isFramebuffer(fb)
                    }
                    ;
                    var _emscripten_glIsFramebuffer = _glIsFramebuffer;
                    var _glIsProgram = program=>{
                        program = GL.programs[program];
                        if (!program)
                            return 0;
                        return GLctx.isProgram(program)
                    }
                    ;
                    var _emscripten_glIsProgram = _glIsProgram;
                    var _glIsQuery = id=>{
                        var query = GL.queries[id];
                        if (!query)
                            return 0;
                        return GLctx.isQuery(query)
                    }
                    ;
                    var _emscripten_glIsQuery = _glIsQuery;
                    var _glIsQueryEXT = id=>{
                        var query = GL.queries[id];
                        if (!query)
                            return 0;
                        return GLctx.disjointTimerQueryExt["isQueryEXT"](query)
                    }
                    ;
                    var _emscripten_glIsQueryEXT = _glIsQueryEXT;
                    var _glIsRenderbuffer = renderbuffer=>{
                        var rb = GL.renderbuffers[renderbuffer];
                        if (!rb)
                            return 0;
                        return GLctx.isRenderbuffer(rb)
                    }
                    ;
                    var _emscripten_glIsRenderbuffer = _glIsRenderbuffer;
                    var _glIsSampler = id=>{
                        var sampler = GL.samplers[id];
                        if (!sampler)
                            return 0;
                        return GLctx.isSampler(sampler)
                    }
                    ;
                    var _emscripten_glIsSampler = _glIsSampler;
                    var _glIsShader = shader=>{
                        var s = GL.shaders[shader];
                        if (!s)
                            return 0;
                        return GLctx.isShader(s)
                    }
                    ;
                    var _emscripten_glIsShader = _glIsShader;
                    var _glIsSync = sync=>GLctx.isSync(GL.syncs[sync]);
                    var _emscripten_glIsSync = _glIsSync;
                    var _glIsTexture = id=>{
                        var texture = GL.textures[id];
                        if (!texture)
                            return 0;
                        return GLctx.isTexture(texture)
                    }
                    ;
                    var _emscripten_glIsTexture = _glIsTexture;
                    var _glIsTransformFeedback = id=>GLctx.isTransformFeedback(GL.transformFeedbacks[id]);
                    var _emscripten_glIsTransformFeedback = _glIsTransformFeedback;
                    var _glIsVertexArray = array=>{
                        var vao = GL.vaos[array];
                        if (!vao)
                            return 0;
                        return GLctx.isVertexArray(vao)
                    }
                    ;
                    var _emscripten_glIsVertexArray = _glIsVertexArray;
                    var _glIsVertexArrayOES = _glIsVertexArray;
                    var _emscripten_glIsVertexArrayOES = _glIsVertexArrayOES;
                    var _glLineWidth = x0=>GLctx.lineWidth(x0);
                    var _emscripten_glLineWidth = _glLineWidth;
                    var _glLinkProgram = program=>{
                        program = GL.programs[program];
                        GLctx.linkProgram(program);
                        program.uniformLocsById = 0;
                        program.uniformSizeAndIdsByName = {}
                    }
                    ;
                    var _emscripten_glLinkProgram = _glLinkProgram;
                    var _glPauseTransformFeedback = ()=>GLctx.pauseTransformFeedback();
                    var _emscripten_glPauseTransformFeedback = _glPauseTransformFeedback;
                    var _glPixelStorei = (pname,param)=>{
                        if (pname == 3317) {
                            GL.unpackAlignment = param
                        } else if (pname == 3314) {
                            GL.unpackRowLength = param
                        }
                        GLctx.pixelStorei(pname, param)
                    }
                    ;
                    var _emscripten_glPixelStorei = _glPixelStorei;
                    var _glPolygonModeWEBGL = (face,mode)=>{
                        GLctx.webglPolygonMode["polygonModeWEBGL"](face, mode)
                    }
                    ;
                    var _emscripten_glPolygonModeWEBGL = _glPolygonModeWEBGL;
                    var _glPolygonOffset = (x0,x1)=>GLctx.polygonOffset(x0, x1);
                    var _emscripten_glPolygonOffset = _glPolygonOffset;
                    var _glPolygonOffsetClampEXT = (factor,units,clamp)=>{
                        GLctx.extPolygonOffsetClamp["polygonOffsetClampEXT"](factor, units, clamp)
                    }
                    ;
                    var _emscripten_glPolygonOffsetClampEXT = _glPolygonOffsetClampEXT;
                    var _glProgramBinary = (program,binaryFormat,binary,length)=>{
                        GL.recordError(1280)
                    }
                    ;
                    var _emscripten_glProgramBinary = _glProgramBinary;
                    var _glProgramParameteri = (program,pname,value)=>{
                        GL.recordError(1280)
                    }
                    ;
                    var _emscripten_glProgramParameteri = _glProgramParameteri;
                    var _glQueryCounterEXT = (id,target)=>{
                        GLctx.disjointTimerQueryExt["queryCounterEXT"](GL.queries[id], target)
                    }
                    ;
                    var _emscripten_glQueryCounterEXT = _glQueryCounterEXT;
                    var _glReadBuffer = x0=>GLctx.readBuffer(x0);
                    var _emscripten_glReadBuffer = _glReadBuffer;
                    var computeUnpackAlignedImageSize = (width,height,sizePerPixel)=>{
                        function roundedToNextMultipleOf(x, y) {
                            return x + y - 1 & -y
                        }
                        var plainRowSize = (GL.unpackRowLength || width) * sizePerPixel;
                        var alignedRowSize = roundedToNextMultipleOf(plainRowSize, GL.unpackAlignment);
                        return height * alignedRowSize
                    }
                    ;
                    var colorChannelsInGlTextureFormat = format=>{
                        var colorChannels = {
                            5: 3,
                            6: 4,
                            8: 2,
                            29502: 3,
                            29504: 4,
                            26917: 2,
                            26918: 2,
                            29846: 3,
                            29847: 4
                        };
                        return colorChannels[format - 6402] || 1
                    }
                    ;
                    var heapObjectForWebGLType = type=>{
                        type -= 5120;
                        if (type == 0)
                            return HEAP8;
                        if (type == 1)
                            return HEAPU8;
                        if (type == 2)
                            return HEAP16;
                        if (type == 4)
                            return HEAP32;
                        if (type == 6)
                            return HEAPF32;
                        if (type == 5 || type == 28922 || type == 28520 || type == 30779 || type == 30782)
                            return HEAPU32;
                        return HEAPU16
                    }
                    ;
                    var toTypedArrayIndex = (pointer,heap)=>pointer >>> 31 - Math.clz32(heap.BYTES_PER_ELEMENT);
                    var emscriptenWebGLGetTexPixelData = (type,format,width,height,pixels,internalFormat)=>{
                        var heap = heapObjectForWebGLType(type);
                        var sizePerPixel = colorChannelsInGlTextureFormat(format) * heap.BYTES_PER_ELEMENT;
                        var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel);
                        return heap.subarray(toTypedArrayIndex(pixels, heap), toTypedArrayIndex(pixels + bytes, heap))
                    }
                    ;
                    var _glReadPixels = (x,y,width,height,format,type,pixels)=>{
                        if (GL.currentContext.version >= 2) {
                            if (GLctx.currentPixelPackBufferBinding) {
                                GLctx.readPixels(x, y, width, height, format, type, pixels);
                                return
                            }
                            var heap = heapObjectForWebGLType(type);
                            var target = toTypedArrayIndex(pixels, heap);
                            GLctx.readPixels(x, y, width, height, format, type, heap, target);
                            return
                        }
                        var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
                        if (!pixelData) {
                            GL.recordError(1280);
                            return
                        }
                        GLctx.readPixels(x, y, width, height, format, type, pixelData)
                    }
                    ;
                    var _emscripten_glReadPixels = _glReadPixels;
                    var _glReleaseShaderCompiler = ()=>{}
                    ;
                    var _emscripten_glReleaseShaderCompiler = _glReleaseShaderCompiler;
                    var _glRenderbufferStorage = (x0,x1,x2,x3)=>GLctx.renderbufferStorage(x0, x1, x2, x3);
                    var _emscripten_glRenderbufferStorage = _glRenderbufferStorage;
                    var _glRenderbufferStorageMultisample = (x0,x1,x2,x3,x4)=>GLctx.renderbufferStorageMultisample(x0, x1, x2, x3, x4);
                    var _emscripten_glRenderbufferStorageMultisample = _glRenderbufferStorageMultisample;
                    var _glResumeTransformFeedback = ()=>GLctx.resumeTransformFeedback();
                    var _emscripten_glResumeTransformFeedback = _glResumeTransformFeedback;
                    var _glSampleCoverage = (value,invert)=>{
                        GLctx.sampleCoverage(value, !!invert)
                    }
                    ;
                    var _emscripten_glSampleCoverage = _glSampleCoverage;
                    var _glSamplerParameterf = (sampler,pname,param)=>{
                        GLctx.samplerParameterf(GL.samplers[sampler], pname, param)
                    }
                    ;
                    var _emscripten_glSamplerParameterf = _glSamplerParameterf;
                    var _glSamplerParameterfv = (sampler,pname,params)=>{
                        var param = HEAPF32[params >> 2];
                        GLctx.samplerParameterf(GL.samplers[sampler], pname, param)
                    }
                    ;
                    var _emscripten_glSamplerParameterfv = _glSamplerParameterfv;
                    var _glSamplerParameteri = (sampler,pname,param)=>{
                        GLctx.samplerParameteri(GL.samplers[sampler], pname, param)
                    }
                    ;
                    var _emscripten_glSamplerParameteri = _glSamplerParameteri;
                    var _glSamplerParameteriv = (sampler,pname,params)=>{
                        var param = HEAP32[params >> 2];
                        GLctx.samplerParameteri(GL.samplers[sampler], pname, param)
                    }
                    ;
                    var _emscripten_glSamplerParameteriv = _glSamplerParameteriv;
                    var _glScissor = (x0,x1,x2,x3)=>GLctx.scissor(x0, x1, x2, x3);
                    var _emscripten_glScissor = _glScissor;
                    var _glShaderBinary = (count,shaders,binaryformat,binary,length)=>{
                        GL.recordError(1280)
                    }
                    ;
                    var _emscripten_glShaderBinary = _glShaderBinary;
                    var _glShaderSource = (shader,count,string,length)=>{
                        var source = GL.getSource(shader, count, string, length);
                        GLctx.shaderSource(GL.shaders[shader], source)
                    }
                    ;
                    var _emscripten_glShaderSource = _glShaderSource;
                    var _glStencilFunc = (x0,x1,x2)=>GLctx.stencilFunc(x0, x1, x2);
                    var _emscripten_glStencilFunc = _glStencilFunc;
                    var _glStencilFuncSeparate = (x0,x1,x2,x3)=>GLctx.stencilFuncSeparate(x0, x1, x2, x3);
                    var _emscripten_glStencilFuncSeparate = _glStencilFuncSeparate;
                    var _glStencilMask = x0=>GLctx.stencilMask(x0);
                    var _emscripten_glStencilMask = _glStencilMask;
                    var _glStencilMaskSeparate = (x0,x1)=>GLctx.stencilMaskSeparate(x0, x1);
                    var _emscripten_glStencilMaskSeparate = _glStencilMaskSeparate;
                    var _glStencilOp = (x0,x1,x2)=>GLctx.stencilOp(x0, x1, x2);
                    var _emscripten_glStencilOp = _glStencilOp;
                    var _glStencilOpSeparate = (x0,x1,x2,x3)=>GLctx.stencilOpSeparate(x0, x1, x2, x3);
                    var _emscripten_glStencilOpSeparate = _glStencilOpSeparate;
                    var _glTexImage2D = (target,level,internalFormat,width,height,border,format,type,pixels)=>{
                        if (GL.currentContext.version >= 2) {
                            if (GLctx.currentPixelUnpackBufferBinding) {
                                GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels);
                                return
                            }
                            if (pixels) {
                                var heap = heapObjectForWebGLType(type);
                                var index = toTypedArrayIndex(pixels, heap);
                                GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, heap, index);
                                return
                            }
                        }
                        var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null;
                        GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData)
                    }
                    ;
                    var _emscripten_glTexImage2D = _glTexImage2D;
                    var _glTexImage3D = (target,level,internalFormat,width,height,depth,border,format,type,pixels)=>{
                        if (GLctx.currentPixelUnpackBufferBinding) {
                            GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, pixels)
                        } else if (pixels) {
                            var heap = heapObjectForWebGLType(type);
                            GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, heap, toTypedArrayIndex(pixels, heap))
                        } else {
                            GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, null)
                        }
                    }
                    ;
                    var _emscripten_glTexImage3D = _glTexImage3D;
                    var _glTexParameterf = (x0,x1,x2)=>GLctx.texParameterf(x0, x1, x2);
                    var _emscripten_glTexParameterf = _glTexParameterf;
                    var _glTexParameterfv = (target,pname,params)=>{
                        var param = HEAPF32[params >> 2];
                        GLctx.texParameterf(target, pname, param)
                    }
                    ;
                    var _emscripten_glTexParameterfv = _glTexParameterfv;
                    var _glTexParameteri = (x0,x1,x2)=>GLctx.texParameteri(x0, x1, x2);
                    var _emscripten_glTexParameteri = _glTexParameteri;
                    var _glTexParameteriv = (target,pname,params)=>{
                        var param = HEAP32[params >> 2];
                        GLctx.texParameteri(target, pname, param)
                    }
                    ;
                    var _emscripten_glTexParameteriv = _glTexParameteriv;
                    var _glTexStorage2D = (x0,x1,x2,x3,x4)=>GLctx.texStorage2D(x0, x1, x2, x3, x4);
                    var _emscripten_glTexStorage2D = _glTexStorage2D;
                    var _glTexStorage3D = (x0,x1,x2,x3,x4,x5)=>GLctx.texStorage3D(x0, x1, x2, x3, x4, x5);
                    var _emscripten_glTexStorage3D = _glTexStorage3D;
                    var _glTexSubImage2D = (target,level,xoffset,yoffset,width,height,format,type,pixels)=>{
                        if (GL.currentContext.version >= 2) {
                            if (GLctx.currentPixelUnpackBufferBinding) {
                                GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
                                return
                            }
                            if (pixels) {
                                var heap = heapObjectForWebGLType(type);
                                GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, heap, toTypedArrayIndex(pixels, heap));
                                return
                            }
                        }
                        var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0) : null;
                        GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData)
                    }
                    ;
                    var _emscripten_glTexSubImage2D = _glTexSubImage2D;
                    var _glTexSubImage3D = (target,level,xoffset,yoffset,zoffset,width,height,depth,format,type,pixels)=>{
                        if (GLctx.currentPixelUnpackBufferBinding) {
                            GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pixels)
                        } else if (pixels) {
                            var heap = heapObjectForWebGLType(type);
                            GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, heap, toTypedArrayIndex(pixels, heap))
                        } else {
                            GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, null)
                        }
                    }
                    ;
                    var _emscripten_glTexSubImage3D = _glTexSubImage3D;
                    var _glTransformFeedbackVaryings = (program,count,varyings,bufferMode)=>{
                        program = GL.programs[program];
                        var vars = [];
                        for (var i = 0; i < count; i++)
                            vars.push(UTF8ToString(HEAP32[varyings + i * 4 >> 2]));
                        GLctx.transformFeedbackVaryings(program, vars, bufferMode)
                    }
                    ;
                    var _emscripten_glTransformFeedbackVaryings = _glTransformFeedbackVaryings;
                    var _glUniform1f = (location,v0)=>{
                        GLctx.uniform1f(webglGetUniformLocation(location), v0)
                    }
                    ;
                    var _emscripten_glUniform1f = _glUniform1f;
                    var miniTempWebGLFloatBuffers = [];
                    var _glUniform1fv = (location,count,value)=>{
                        if (GL.currentContext.version >= 2) {
                            count && GLctx.uniform1fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count);
                            return
                        }
                        if (count <= 288) {
                            var view = miniTempWebGLFloatBuffers[count];
                            for (var i = 0; i < count; ++i) {
                                view[i] = HEAPF32[value + 4 * i >> 2]
                            }
                        } else {
                            var view = HEAPF32.subarray(value >> 2, value + count * 4 >> 2)
                        }
                        GLctx.uniform1fv(webglGetUniformLocation(location), view)
                    }
                    ;
                    var _emscripten_glUniform1fv = _glUniform1fv;
                    var _glUniform1i = (location,v0)=>{
                        GLctx.uniform1i(webglGetUniformLocation(location), v0)
                    }
                    ;
                    var _emscripten_glUniform1i = _glUniform1i;
                    var miniTempWebGLIntBuffers = [];
                    var _glUniform1iv = (location,count,value)=>{
                        if (GL.currentContext.version >= 2) {
                            count && GLctx.uniform1iv(webglGetUniformLocation(location), HEAP32, value >> 2, count);
                            return
                        }
                        if (count <= 288) {
                            var view = miniTempWebGLIntBuffers[count];
                            for (var i = 0; i < count; ++i) {
                                view[i] = HEAP32[value + 4 * i >> 2]
                            }
                        } else {
                            var view = HEAP32.subarray(value >> 2, value + count * 4 >> 2)
                        }
                        GLctx.uniform1iv(webglGetUniformLocation(location), view)
                    }
                    ;
                    var _emscripten_glUniform1iv = _glUniform1iv;
                    var _glUniform1ui = (location,v0)=>{
                        GLctx.uniform1ui(webglGetUniformLocation(location), v0)
                    }
                    ;
                    var _emscripten_glUniform1ui = _glUniform1ui;
                    var _glUniform1uiv = (location,count,value)=>{
                        count && GLctx.uniform1uiv(webglGetUniformLocation(location), HEAPU32, value >> 2, count)
                    }
                    ;
                    var _emscripten_glUniform1uiv = _glUniform1uiv;
                    var _glUniform2f = (location,v0,v1)=>{
                        GLctx.uniform2f(webglGetUniformLocation(location), v0, v1)
                    }
                    ;
                    var _emscripten_glUniform2f = _glUniform2f;
                    var _glUniform2fv = (location,count,value)=>{
                        if (GL.currentContext.version >= 2) {
                            count && GLctx.uniform2fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count * 2);
                            return
                        }
                        if (count <= 144) {
                            count *= 2;
                            var view = miniTempWebGLFloatBuffers[count];
                            for (var i = 0; i < count; i += 2) {
                                view[i] = HEAPF32[value + 4 * i >> 2];
                                view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2]
                            }
                        } else {
                            var view = HEAPF32.subarray(value >> 2, value + count * 8 >> 2)
                        }
                        GLctx.uniform2fv(webglGetUniformLocation(location), view)
                    }
                    ;
                    var _emscripten_glUniform2fv = _glUniform2fv;
                    var _glUniform2i = (location,v0,v1)=>{
                        GLctx.uniform2i(webglGetUniformLocation(location), v0, v1)
                    }
                    ;
                    var _emscripten_glUniform2i = _glUniform2i;
                    var _glUniform2iv = (location,count,value)=>{
                        if (GL.currentContext.version >= 2) {
                            count && GLctx.uniform2iv(webglGetUniformLocation(location), HEAP32, value >> 2, count * 2);
                            return
                        }
                        if (count <= 144) {
                            count *= 2;
                            var view = miniTempWebGLIntBuffers[count];
                            for (var i = 0; i < count; i += 2) {
                                view[i] = HEAP32[value + 4 * i >> 2];
                                view[i + 1] = HEAP32[value + (4 * i + 4) >> 2]
                            }
                        } else {
                            var view = HEAP32.subarray(value >> 2, value + count * 8 >> 2)
                        }
                        GLctx.uniform2iv(webglGetUniformLocation(location), view)
                    }
                    ;
                    var _emscripten_glUniform2iv = _glUniform2iv;
                    var _glUniform2ui = (location,v0,v1)=>{
                        GLctx.uniform2ui(webglGetUniformLocation(location), v0, v1)
                    }
                    ;
                    var _emscripten_glUniform2ui = _glUniform2ui;
                    var _glUniform2uiv = (location,count,value)=>{
                        count && GLctx.uniform2uiv(webglGetUniformLocation(location), HEAPU32, value >> 2, count * 2)
                    }
                    ;
                    var _emscripten_glUniform2uiv = _glUniform2uiv;
                    var _glUniform3f = (location,v0,v1,v2)=>{
                        GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2)
                    }
                    ;
                    var _emscripten_glUniform3f = _glUniform3f;
                    var _glUniform3fv = (location,count,value)=>{
                        if (GL.currentContext.version >= 2) {
                            count && GLctx.uniform3fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count * 3);
                            return
                        }
                        if (count <= 96) {
                            count *= 3;
                            var view = miniTempWebGLFloatBuffers[count];
                            for (var i = 0; i < count; i += 3) {
                                view[i] = HEAPF32[value + 4 * i >> 2];
                                view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
                                view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2]
                            }
                        } else {
                            var view = HEAPF32.subarray(value >> 2, value + count * 12 >> 2)
                        }
                        GLctx.uniform3fv(webglGetUniformLocation(location), view)
                    }
                    ;
                    var _emscripten_glUniform3fv = _glUniform3fv;
                    var _glUniform3i = (location,v0,v1,v2)=>{
                        GLctx.uniform3i(webglGetUniformLocation(location), v0, v1, v2)
                    }
                    ;
                    var _emscripten_glUniform3i = _glUniform3i;
                    var _glUniform3iv = (location,count,value)=>{
                        if (GL.currentContext.version >= 2) {
                            count && GLctx.uniform3iv(webglGetUniformLocation(location), HEAP32, value >> 2, count * 3);
                            return
                        }
                        if (count <= 96) {
                            count *= 3;
                            var view = miniTempWebGLIntBuffers[count];
                            for (var i = 0; i < count; i += 3) {
                                view[i] = HEAP32[value + 4 * i >> 2];
                                view[i + 1] = HEAP32[value + (4 * i + 4) >> 2];
                                view[i + 2] = HEAP32[value + (4 * i + 8) >> 2]
                            }
                        } else {
                            var view = HEAP32.subarray(value >> 2, value + count * 12 >> 2)
                        }
                        GLctx.uniform3iv(webglGetUniformLocation(location), view)
                    }
                    ;
                    var _emscripten_glUniform3iv = _glUniform3iv;
                    var _glUniform3ui = (location,v0,v1,v2)=>{
                        GLctx.uniform3ui(webglGetUniformLocation(location), v0, v1, v2)
                    }
                    ;
                    var _emscripten_glUniform3ui = _glUniform3ui;
                    var _glUniform3uiv = (location,count,value)=>{
                        count && GLctx.uniform3uiv(webglGetUniformLocation(location), HEAPU32, value >> 2, count * 3)
                    }
                    ;
                    var _emscripten_glUniform3uiv = _glUniform3uiv;
                    var _glUniform4f = (location,v0,v1,v2,v3)=>{
                        GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3)
                    }
                    ;
                    var _emscripten_glUniform4f = _glUniform4f;
                    var _glUniform4fv = (location,count,value)=>{
                        if (GL.currentContext.version >= 2) {
                            count && GLctx.uniform4fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count * 4);
                            return
                        }
                        if (count <= 72) {
                            var view = miniTempWebGLFloatBuffers[4 * count];
                            var heap = HEAPF32;
                            value = value >> 2;
                            count *= 4;
                            for (var i = 0; i < count; i += 4) {
                                var dst = value + i;
                                view[i] = heap[dst];
                                view[i + 1] = heap[dst + 1];
                                view[i + 2] = heap[dst + 2];
                                view[i + 3] = heap[dst + 3]
                            }
                        } else {
                            var view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2)
                        }
                        GLctx.uniform4fv(webglGetUniformLocation(location), view)
                    }
                    ;
                    var _emscripten_glUniform4fv = _glUniform4fv;
                    var _glUniform4i = (location,v0,v1,v2,v3)=>{
                        GLctx.uniform4i(webglGetUniformLocation(location), v0, v1, v2, v3)
                    }
                    ;
                    var _emscripten_glUniform4i = _glUniform4i;
                    var _glUniform4iv = (location,count,value)=>{
                        if (GL.currentContext.version >= 2) {
                            count && GLctx.uniform4iv(webglGetUniformLocation(location), HEAP32, value >> 2, count * 4);
                            return
                        }
                        if (count <= 72) {
                            count *= 4;
                            var view = miniTempWebGLIntBuffers[count];
                            for (var i = 0; i < count; i += 4) {
                                view[i] = HEAP32[value + 4 * i >> 2];
                                view[i + 1] = HEAP32[value + (4 * i + 4) >> 2];
                                view[i + 2] = HEAP32[value + (4 * i + 8) >> 2];
                                view[i + 3] = HEAP32[value + (4 * i + 12) >> 2]
                            }
                        } else {
                            var view = HEAP32.subarray(value >> 2, value + count * 16 >> 2)
                        }
                        GLctx.uniform4iv(webglGetUniformLocation(location), view)
                    }
                    ;
                    var _emscripten_glUniform4iv = _glUniform4iv;
                    var _glUniform4ui = (location,v0,v1,v2,v3)=>{
                        GLctx.uniform4ui(webglGetUniformLocation(location), v0, v1, v2, v3)
                    }
                    ;
                    var _emscripten_glUniform4ui = _glUniform4ui;
                    var _glUniform4uiv = (location,count,value)=>{
                        count && GLctx.uniform4uiv(webglGetUniformLocation(location), HEAPU32, value >> 2, count * 4)
                    }
                    ;
                    var _emscripten_glUniform4uiv = _glUniform4uiv;
                    var _glUniformBlockBinding = (program,uniformBlockIndex,uniformBlockBinding)=>{
                        program = GL.programs[program];
                        GLctx.uniformBlockBinding(program, uniformBlockIndex, uniformBlockBinding)
                    }
                    ;
                    var _emscripten_glUniformBlockBinding = _glUniformBlockBinding;
                    var _glUniformMatrix2fv = (location,count,transpose,value)=>{
                        if (GL.currentContext.version >= 2) {
                            count && GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 4);
                            return
                        }
                        if (count <= 72) {
                            count *= 4;
                            var view = miniTempWebGLFloatBuffers[count];
                            for (var i = 0; i < count; i += 4) {
                                view[i] = HEAPF32[value + 4 * i >> 2];
                                view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
                                view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
                                view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2]
                            }
                        } else {
                            var view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2)
                        }
                        GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, view)
                    }
                    ;
                    var _emscripten_glUniformMatrix2fv = _glUniformMatrix2fv;
                    var _glUniformMatrix2x3fv = (location,count,transpose,value)=>{
                        count && GLctx.uniformMatrix2x3fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 6)
                    }
                    ;
                    var _emscripten_glUniformMatrix2x3fv = _glUniformMatrix2x3fv;
                    var _glUniformMatrix2x4fv = (location,count,transpose,value)=>{
                        count && GLctx.uniformMatrix2x4fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 8)
                    }
                    ;
                    var _emscripten_glUniformMatrix2x4fv = _glUniformMatrix2x4fv;
                    var _glUniformMatrix3fv = (location,count,transpose,value)=>{
                        if (GL.currentContext.version >= 2) {
                            count && GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 9);
                            return
                        }
                        if (count <= 32) {
                            count *= 9;
                            var view = miniTempWebGLFloatBuffers[count];
                            for (var i = 0; i < count; i += 9) {
                                view[i] = HEAPF32[value + 4 * i >> 2];
                                view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
                                view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
                                view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2];
                                view[i + 4] = HEAPF32[value + (4 * i + 16) >> 2];
                                view[i + 5] = HEAPF32[value + (4 * i + 20) >> 2];
                                view[i + 6] = HEAPF32[value + (4 * i + 24) >> 2];
                                view[i + 7] = HEAPF32[value + (4 * i + 28) >> 2];
                                view[i + 8] = HEAPF32[value + (4 * i + 32) >> 2]
                            }
                        } else {
                            var view = HEAPF32.subarray(value >> 2, value + count * 36 >> 2)
                        }
                        GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, view)
                    }
                    ;
                    var _emscripten_glUniformMatrix3fv = _glUniformMatrix3fv;
                    var _glUniformMatrix3x2fv = (location,count,transpose,value)=>{
                        count && GLctx.uniformMatrix3x2fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 6)
                    }
                    ;
                    var _emscripten_glUniformMatrix3x2fv = _glUniformMatrix3x2fv;
                    var _glUniformMatrix3x4fv = (location,count,transpose,value)=>{
                        count && GLctx.uniformMatrix3x4fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 12)
                    }
                    ;
                    var _emscripten_glUniformMatrix3x4fv = _glUniformMatrix3x4fv;
                    var _glUniformMatrix4fv = (location,count,transpose,value)=>{
                        if (GL.currentContext.version >= 2) {
                            count && GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 16);
                            return
                        }
                        if (count <= 18) {
                            var view = miniTempWebGLFloatBuffers[16 * count];
                            var heap = HEAPF32;
                            value = value >> 2;
                            count *= 16;
                            for (var i = 0; i < count; i += 16) {
                                var dst = value + i;
                                view[i] = heap[dst];
                                view[i + 1] = heap[dst + 1];
                                view[i + 2] = heap[dst + 2];
                                view[i + 3] = heap[dst + 3];
                                view[i + 4] = heap[dst + 4];
                                view[i + 5] = heap[dst + 5];
                                view[i + 6] = heap[dst + 6];
                                view[i + 7] = heap[dst + 7];
                                view[i + 8] = heap[dst + 8];
                                view[i + 9] = heap[dst + 9];
                                view[i + 10] = heap[dst + 10];
                                view[i + 11] = heap[dst + 11];
                                view[i + 12] = heap[dst + 12];
                                view[i + 13] = heap[dst + 13];
                                view[i + 14] = heap[dst + 14];
                                view[i + 15] = heap[dst + 15]
                            }
                        } else {
                            var view = HEAPF32.subarray(value >> 2, value + count * 64 >> 2)
                        }
                        GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, view)
                    }
                    ;
                    var _emscripten_glUniformMatrix4fv = _glUniformMatrix4fv;
                    var _glUniformMatrix4x2fv = (location,count,transpose,value)=>{
                        count && GLctx.uniformMatrix4x2fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 8)
                    }
                    ;
                    var _emscripten_glUniformMatrix4x2fv = _glUniformMatrix4x2fv;
                    var _glUniformMatrix4x3fv = (location,count,transpose,value)=>{
                        count && GLctx.uniformMatrix4x3fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 12)
                    }
                    ;
                    var _emscripten_glUniformMatrix4x3fv = _glUniformMatrix4x3fv;
                    var _glUseProgram = program=>{
                        program = GL.programs[program];
                        GLctx.useProgram(program);
                        GLctx.currentProgram = program
                    }
                    ;
                    var _emscripten_glUseProgram = _glUseProgram;
                    var _glValidateProgram = program=>{
                        GLctx.validateProgram(GL.programs[program])
                    }
                    ;
                    var _emscripten_glValidateProgram = _glValidateProgram;
                    var _glVertexAttrib1f = (x0,x1)=>GLctx.vertexAttrib1f(x0, x1);
                    var _emscripten_glVertexAttrib1f = _glVertexAttrib1f;
                    var _glVertexAttrib1fv = (index,v)=>{
                        GLctx.vertexAttrib1f(index, HEAPF32[v >> 2])
                    }
                    ;
                    var _emscripten_glVertexAttrib1fv = _glVertexAttrib1fv;
                    var _glVertexAttrib2f = (x0,x1,x2)=>GLctx.vertexAttrib2f(x0, x1, x2);
                    var _emscripten_glVertexAttrib2f = _glVertexAttrib2f;
                    var _glVertexAttrib2fv = (index,v)=>{
                        GLctx.vertexAttrib2f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2])
                    }
                    ;
                    var _emscripten_glVertexAttrib2fv = _glVertexAttrib2fv;
                    var _glVertexAttrib3f = (x0,x1,x2,x3)=>GLctx.vertexAttrib3f(x0, x1, x2, x3);
                    var _emscripten_glVertexAttrib3f = _glVertexAttrib3f;
                    var _glVertexAttrib3fv = (index,v)=>{
                        GLctx.vertexAttrib3f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2], HEAPF32[v + 8 >> 2])
                    }
                    ;
                    var _emscripten_glVertexAttrib3fv = _glVertexAttrib3fv;
                    var _glVertexAttrib4f = (x0,x1,x2,x3,x4)=>GLctx.vertexAttrib4f(x0, x1, x2, x3, x4);
                    var _emscripten_glVertexAttrib4f = _glVertexAttrib4f;
                    var _glVertexAttrib4fv = (index,v)=>{
                        GLctx.vertexAttrib4f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2], HEAPF32[v + 8 >> 2], HEAPF32[v + 12 >> 2])
                    }
                    ;
                    var _emscripten_glVertexAttrib4fv = _glVertexAttrib4fv;
                    var _glVertexAttribDivisor = (index,divisor)=>{
                        GLctx.vertexAttribDivisor(index, divisor)
                    }
                    ;
                    var _emscripten_glVertexAttribDivisor = _glVertexAttribDivisor;
                    var _glVertexAttribDivisorANGLE = _glVertexAttribDivisor;
                    var _emscripten_glVertexAttribDivisorANGLE = _glVertexAttribDivisorANGLE;
                    var _glVertexAttribDivisorARB = _glVertexAttribDivisor;
                    var _emscripten_glVertexAttribDivisorARB = _glVertexAttribDivisorARB;
                    var _glVertexAttribDivisorEXT = _glVertexAttribDivisor;
                    var _emscripten_glVertexAttribDivisorEXT = _glVertexAttribDivisorEXT;
                    var _glVertexAttribDivisorNV = _glVertexAttribDivisor;
                    var _emscripten_glVertexAttribDivisorNV = _glVertexAttribDivisorNV;
                    var _glVertexAttribI4i = (x0,x1,x2,x3,x4)=>GLctx.vertexAttribI4i(x0, x1, x2, x3, x4);
                    var _emscripten_glVertexAttribI4i = _glVertexAttribI4i;
                    var _glVertexAttribI4iv = (index,v)=>{
                        GLctx.vertexAttribI4i(index, HEAP32[v >> 2], HEAP32[v + 4 >> 2], HEAP32[v + 8 >> 2], HEAP32[v + 12 >> 2])
                    }
                    ;
                    var _emscripten_glVertexAttribI4iv = _glVertexAttribI4iv;
                    var _glVertexAttribI4ui = (x0,x1,x2,x3,x4)=>GLctx.vertexAttribI4ui(x0, x1, x2, x3, x4);
                    var _emscripten_glVertexAttribI4ui = _glVertexAttribI4ui;
                    var _glVertexAttribI4uiv = (index,v)=>{
                        GLctx.vertexAttribI4ui(index, HEAPU32[v >> 2], HEAPU32[v + 4 >> 2], HEAPU32[v + 8 >> 2], HEAPU32[v + 12 >> 2])
                    }
                    ;
                    var _emscripten_glVertexAttribI4uiv = _glVertexAttribI4uiv;
                    var _glVertexAttribIPointer = (index,size,type,stride,ptr)=>{
                        GLctx.vertexAttribIPointer(index, size, type, stride, ptr)
                    }
                    ;
                    var _emscripten_glVertexAttribIPointer = _glVertexAttribIPointer;
                    var _glVertexAttribPointer = (index,size,type,normalized,stride,ptr)=>{
                        var cb = GL.currentContext.clientBuffers[index];
                        if (!GLctx.currentArrayBufferBinding) {
                            cb.size = size;
                            cb.type = type;
                            cb.normalized = normalized;
                            cb.stride = stride;
                            cb.ptr = ptr;
                            cb.clientside = true;
                            cb.vertexAttribPointerAdaptor = function(index, size, type, normalized, stride, ptr) {
                                this.vertexAttribPointer(index, size, type, normalized, stride, ptr)
                            }
                            ;
                            return
                        }
                        cb.clientside = false;
                        GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr)
                    }
                    ;
                    var _emscripten_glVertexAttribPointer = _glVertexAttribPointer;
                    var _glViewport = (x0,x1,x2,x3)=>GLctx.viewport(x0, x1, x2, x3);
                    var _emscripten_glViewport = _glViewport;
                    var _glWaitSync = (sync,flags,timeout)=>{
                        timeout = Number(timeout);
                        GLctx.waitSync(GL.syncs[sync], flags, timeout)
                    }
                    ;
                    var _emscripten_glWaitSync = _glWaitSync;
                    var _emscripten_html5_remove_all_event_listeners = ()=>JSEvents.removeAllEventListeners();
                    var _emscripten_pause_main_loop = ()=>MainLoop.pause();
                    var doRequestFullscreen = (target,strategy)=>{
                        if (!JSEvents.fullscreenEnabled())
                            return -1;
                        target = findEventTarget(target);
                        if (!target)
                            return -4;
                        if (!target.requestFullscreen && !target.webkitRequestFullscreen) {
                            return -3
                        }
                        if (!JSEvents.canPerformEventHandlerRequests()) {
                            if (strategy.deferUntilInEventHandler) {
                                JSEvents.deferCall(JSEvents_requestFullscreen, 1, [target, strategy]);
                                return 1
                            }
                            return -2
                        }
                        return JSEvents_requestFullscreen(target, strategy)
                    }
                    ;
                    var _emscripten_request_fullscreen = (target,deferUntilInEventHandler)=>{
                        var strategy = {
                            scaleMode: 0,
                            canvasResolutionScaleMode: 0,
                            filteringMode: 0,
                            deferUntilInEventHandler,
                            canvasResizedCallbackTargetThread: 2
                        };
                        return doRequestFullscreen(target, strategy)
                    }
                    ;
                    var _emscripten_request_pointerlock = (target,deferUntilInEventHandler)=>{
                        target = findEventTarget(target);
                        if (!target)
                            return -4;
                        if (!target.requestPointerLock) {
                            return -1
                        }
                        if (!JSEvents.canPerformEventHandlerRequests()) {
                            if (deferUntilInEventHandler) {
                                JSEvents.deferCall(requestPointerLock, 2, [target]);
                                return 1
                            }
                            return -2
                        }
                        return requestPointerLock(target)
                    }
                    ;
                    var alignMemory = (size,alignment)=>Math.ceil(size / alignment) * alignment;
                    var growMemory = size=>{
                        var b = wasmMemory.buffer;
                        var pages = (size - b.byteLength + 65535) / 65536 | 0;
                        try {
                            wasmMemory.grow(pages);
                            updateMemoryViews();
                            return 1
                        } catch (e) {}
                    }
                    ;
                    var _emscripten_resize_heap = requestedSize=>{
                        var oldSize = HEAPU8.length;
                        requestedSize >>>= 0;
                        var maxHeapSize = getHeapMax();
                        if (requestedSize > maxHeapSize) {
                            return false
                        }
                        for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
                            var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
                            overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
                            var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
                            var replacement = growMemory(newSize);
                            if (replacement) {
                                return true
                            }
                        }
                        return false
                    }
                    ;
                    var _emscripten_resume_main_loop = ()=>MainLoop.resume();
                    var fillDeviceMotionEventData = (eventStruct,e,target)=>{
                        var supportedFields = 0;
                        var a = e["acceleration"];
                        supportedFields |= a && 1;
                        var ag = e["accelerationIncludingGravity"];
                        supportedFields |= ag && 2;
                        var rr = e["rotationRate"];
                        supportedFields |= rr && 4;
                        a = a || {};
                        ag = ag || {};
                        rr = rr || {};
                        HEAPF64[eventStruct >> 3] = a["x"];
                        HEAPF64[eventStruct + 8 >> 3] = a["y"];
                        HEAPF64[eventStruct + 16 >> 3] = a["z"];
                        HEAPF64[eventStruct + 24 >> 3] = ag["x"];
                        HEAPF64[eventStruct + 32 >> 3] = ag["y"];
                        HEAPF64[eventStruct + 40 >> 3] = ag["z"];
                        HEAPF64[eventStruct + 48 >> 3] = rr["alpha"];
                        HEAPF64[eventStruct + 56 >> 3] = rr["beta"];
                        HEAPF64[eventStruct + 64 >> 3] = rr["gamma"]
                    }
                    ;
                    var registerDeviceMotionEventCallback = (target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread)=>{
                        JSEvents.deviceMotionEvent ||= _malloc(80);
                        var deviceMotionEventHandlerFunc = (e=event)=>{
                            fillDeviceMotionEventData(JSEvents.deviceMotionEvent, e, target);
                            if (((a1,a2,a3)=>dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, JSEvents.deviceMotionEvent, userData))
                                e.preventDefault()
                        }
                        ;
                        var eventHandler = {
                            target: findEventTarget(target),
                            eventTypeString,
                            callbackfunc,
                            handlerFunc: deviceMotionEventHandlerFunc,
                            useCapture
                        };
                        return JSEvents.registerOrRemoveHandler(eventHandler)
                    }
                    ;
                    var _emscripten_set_devicemotion_callback_on_thread = (userData,useCapture,callbackfunc,targetThread)=>registerDeviceMotionEventCallback(2, userData, useCapture, callbackfunc, 17, "devicemotion", targetThread);
                    var registerKeyEventCallback = (target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread)=>{
                        JSEvents.keyEvent ||= _malloc(160);
                        var keyEventHandlerFunc = e=>{
                            var keyEventData = JSEvents.keyEvent;
                            HEAPF64[keyEventData >> 3] = e.timeStamp;
                            var idx = keyEventData >> 2;
                            HEAP32[idx + 2] = e.location;
                            HEAP8[keyEventData + 12] = e.ctrlKey;
                            HEAP8[keyEventData + 13] = e.shiftKey;
                            HEAP8[keyEventData + 14] = e.altKey;
                            HEAP8[keyEventData + 15] = e.metaKey;
                            HEAP8[keyEventData + 16] = e.repeat;
                            HEAP32[idx + 5] = e.charCode;
                            HEAP32[idx + 6] = e.keyCode;
                            HEAP32[idx + 7] = e.which;
                            stringToUTF8(e.key || "", keyEventData + 32, 32);
                            stringToUTF8(e.code || "", keyEventData + 64, 32);
                            stringToUTF8(e.char || "", keyEventData + 96, 32);
                            stringToUTF8(e.locale || "", keyEventData + 128, 32);
                            if (((a1,a2,a3)=>dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, keyEventData, userData))
                                e.preventDefault()
                        }
                        ;
                        var eventHandler = {
                            target: findEventTarget(target),
                            eventTypeString,
                            callbackfunc,
                            handlerFunc: keyEventHandlerFunc,
                            useCapture
                        };
                        return JSEvents.registerOrRemoveHandler(eventHandler)
                    }
                    ;
                    var _emscripten_set_keydown_callback_on_thread = (target,userData,useCapture,callbackfunc,targetThread)=>registerKeyEventCallback(target, userData, useCapture, callbackfunc, 2, "keydown", targetThread);
                    var _emscripten_set_keypress_callback_on_thread = (target,userData,useCapture,callbackfunc,targetThread)=>registerKeyEventCallback(target, userData, useCapture, callbackfunc, 1, "keypress", targetThread);
                    var _emscripten_set_keyup_callback_on_thread = (target,userData,useCapture,callbackfunc,targetThread)=>registerKeyEventCallback(target, userData, useCapture, callbackfunc, 3, "keyup", targetThread);
                    var _emscripten_set_main_loop = (func,fps,simulateInfiniteLoop)=>{
                        var iterFunc = ()=>dynCall_v(func);
                        setMainLoop(iterFunc, fps, simulateInfiniteLoop)
                    }
                    ;
                    var fillMouseEventData = (eventStruct,e,target)=>{
                        HEAPF64[eventStruct >> 3] = e.timeStamp;
                        var idx = eventStruct >> 2;
                        HEAP32[idx + 2] = e.screenX;
                        HEAP32[idx + 3] = e.screenY;
                        HEAP32[idx + 4] = e.clientX;
                        HEAP32[idx + 5] = e.clientY;
                        HEAP8[eventStruct + 24] = e.ctrlKey;
                        HEAP8[eventStruct + 25] = e.shiftKey;
                        HEAP8[eventStruct + 26] = e.altKey;
                        HEAP8[eventStruct + 27] = e.metaKey;
                        HEAP16[idx * 2 + 14] = e.button;
                        HEAP16[idx * 2 + 15] = e.buttons;
                        HEAP32[idx + 8] = e["movementX"];
                        HEAP32[idx + 9] = e["movementY"];
                        var rect = getBoundingClientRect(target);
                        HEAP32[idx + 10] = e.clientX - (rect.left | 0);
                        HEAP32[idx + 11] = e.clientY - (rect.top | 0)
                    }
                    ;
                    var registerMouseEventCallback = (target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread)=>{
                        JSEvents.mouseEvent ||= _malloc(64);
                        target = findEventTarget(target);
                        var mouseEventHandlerFunc = (e=event)=>{
                            fillMouseEventData(JSEvents.mouseEvent, e, target);
                            if (((a1,a2,a3)=>dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, JSEvents.mouseEvent, userData))
                                e.preventDefault()
                        }
                        ;
                        var eventHandler = {
                            target,
                            allowsDeferredCalls: eventTypeString != "mousemove" && eventTypeString != "mouseenter" && eventTypeString != "mouseleave",
                            eventTypeString,
                            callbackfunc,
                            handlerFunc: mouseEventHandlerFunc,
                            useCapture
                        };
                        return JSEvents.registerOrRemoveHandler(eventHandler)
                    }
                    ;
                    var _emscripten_set_mousedown_callback_on_thread = (target,userData,useCapture,callbackfunc,targetThread)=>registerMouseEventCallback(target, userData, useCapture, callbackfunc, 5, "mousedown", targetThread);
                    var _emscripten_set_mousemove_callback_on_thread = (target,userData,useCapture,callbackfunc,targetThread)=>registerMouseEventCallback(target, userData, useCapture, callbackfunc, 8, "mousemove", targetThread);
                    var _emscripten_set_mouseup_callback_on_thread = (target,userData,useCapture,callbackfunc,targetThread)=>registerMouseEventCallback(target, userData, useCapture, callbackfunc, 6, "mouseup", targetThread);
                    var fillPointerlockChangeEventData = eventStruct=>{
                        var pointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement;
                        var isPointerlocked = !!pointerLockElement;
                        HEAP8[eventStruct] = isPointerlocked;
                        var nodeName = JSEvents.getNodeNameForTarget(pointerLockElement);
                        var id = pointerLockElement?.id || "";
                        stringToUTF8(nodeName, eventStruct + 1, 128);
                        stringToUTF8(id, eventStruct + 129, 128)
                    }
                    ;
                    var registerPointerlockChangeEventCallback = (target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread)=>{
                        JSEvents.pointerlockChangeEvent ||= _malloc(257);
                        var pointerlockChangeEventHandlerFunc = (e=event)=>{
                            var pointerlockChangeEvent = JSEvents.pointerlockChangeEvent;
                            fillPointerlockChangeEventData(pointerlockChangeEvent);
                            if (((a1,a2,a3)=>dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, pointerlockChangeEvent, userData))
                                e.preventDefault()
                        }
                        ;
                        var eventHandler = {
                            target,
                            eventTypeString,
                            callbackfunc,
                            handlerFunc: pointerlockChangeEventHandlerFunc,
                            useCapture
                        };
                        return JSEvents.registerOrRemoveHandler(eventHandler)
                    }
                    ;
                    var _emscripten_set_pointerlockchange_callback_on_thread = (target,userData,useCapture,callbackfunc,targetThread)=>{
                        if (!document || !document.body || !document.body.requestPointerLock && !document.body.mozRequestPointerLock && !document.body.webkitRequestPointerLock && !document.body.msRequestPointerLock) {
                            return -1
                        }
                        target = findEventTarget(target);
                        if (!target)
                            return -4;
                        registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "mozpointerlockchange", targetThread);
                        registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "webkitpointerlockchange", targetThread);
                        registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "mspointerlockchange", targetThread);
                        return registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "pointerlockchange", targetThread)
                    }
                    ;
                    var registerTouchEventCallback = (target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread)=>{
                        JSEvents.touchEvent ||= _malloc(1552);
                        target = findEventTarget(target);
                        var touchEventHandlerFunc = e=>{
                            var t, touches = {}, et = e.touches;
                            for (let t of et) {
                                t.isChanged = t.onTarget = 0;
                                touches[t.identifier] = t
                            }
                            for (let t of e.changedTouches) {
                                t.isChanged = 1;
                                touches[t.identifier] = t
                            }
                            for (let t of e.targetTouches) {
                                touches[t.identifier].onTarget = 1
                            }
                            var touchEvent = JSEvents.touchEvent;
                            HEAPF64[touchEvent >> 3] = e.timeStamp;
                            HEAP8[touchEvent + 12] = e.ctrlKey;
                            HEAP8[touchEvent + 13] = e.shiftKey;
                            HEAP8[touchEvent + 14] = e.altKey;
                            HEAP8[touchEvent + 15] = e.metaKey;
                            var idx = touchEvent + 16;
                            var targetRect = getBoundingClientRect(target);
                            var numTouches = 0;
                            for (let t of Object.values(touches)) {
                                var idx32 = idx >> 2;
                                HEAP32[idx32 + 0] = t.identifier;
                                HEAP32[idx32 + 1] = t.screenX;
                                HEAP32[idx32 + 2] = t.screenY;
                                HEAP32[idx32 + 3] = t.clientX;
                                HEAP32[idx32 + 4] = t.clientY;
                                HEAP32[idx32 + 5] = t.pageX;
                                HEAP32[idx32 + 6] = t.pageY;
                                HEAP8[idx + 28] = t.isChanged;
                                HEAP8[idx + 29] = t.onTarget;
                                HEAP32[idx32 + 8] = t.clientX - (targetRect.left | 0);
                                HEAP32[idx32 + 9] = t.clientY - (targetRect.top | 0);
                                idx += 48;
                                if (++numTouches > 31) {
                                    break
                                }
                            }
                            HEAP32[touchEvent + 8 >> 2] = numTouches;
                            if (((a1,a2,a3)=>dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, touchEvent, userData))
                                e.preventDefault()
                        }
                        ;
                        var eventHandler = {
                            target,
                            allowsDeferredCalls: eventTypeString == "touchstart" || eventTypeString == "touchend",
                            eventTypeString,
                            callbackfunc,
                            handlerFunc: touchEventHandlerFunc,
                            useCapture
                        };
                        return JSEvents.registerOrRemoveHandler(eventHandler)
                    }
                    ;
                    var _emscripten_set_touchcancel_callback_on_thread = (target,userData,useCapture,callbackfunc,targetThread)=>registerTouchEventCallback(target, userData, useCapture, callbackfunc, 25, "touchcancel", targetThread);
                    var _emscripten_set_touchend_callback_on_thread = (target,userData,useCapture,callbackfunc,targetThread)=>registerTouchEventCallback(target, userData, useCapture, callbackfunc, 23, "touchend", targetThread);
                    var _emscripten_set_touchmove_callback_on_thread = (target,userData,useCapture,callbackfunc,targetThread)=>registerTouchEventCallback(target, userData, useCapture, callbackfunc, 24, "touchmove", targetThread);
                    var _emscripten_set_touchstart_callback_on_thread = (target,userData,useCapture,callbackfunc,targetThread)=>registerTouchEventCallback(target, userData, useCapture, callbackfunc, 22, "touchstart", targetThread);
                    var registerWheelEventCallback = (target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread)=>{
                        JSEvents.wheelEvent ||= _malloc(96);
                        var wheelHandlerFunc = (e=event)=>{
                            var wheelEvent = JSEvents.wheelEvent;
                            fillMouseEventData(wheelEvent, e, target);
                            HEAPF64[wheelEvent + 64 >> 3] = e["deltaX"];
                            HEAPF64[wheelEvent + 72 >> 3] = e["deltaY"];
                            HEAPF64[wheelEvent + 80 >> 3] = e["deltaZ"];
                            HEAP32[wheelEvent + 88 >> 2] = e["deltaMode"];
                            if (((a1,a2,a3)=>dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, wheelEvent, userData))
                                e.preventDefault()
                        }
                        ;
                        var eventHandler = {
                            target,
                            allowsDeferredCalls: true,
                            eventTypeString,
                            callbackfunc,
                            handlerFunc: wheelHandlerFunc,
                            useCapture
                        };
                        return JSEvents.registerOrRemoveHandler(eventHandler)
                    }
                    ;
                    var _emscripten_set_wheel_callback_on_thread = (target,userData,useCapture,callbackfunc,targetThread)=>{
                        target = findEventTarget(target);
                        if (!target)
                            return -4;
                        if (typeof target.onwheel != "undefined") {
                            return registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "wheel", targetThread)
                        } else {
                            return -1
                        }
                    }
                    ;
                    var _emscripten_sleep = ms=>Asyncify.handleSleep(wakeUp=>safeSetTimeout(wakeUp, ms));
                    _emscripten_sleep.isAsync = true;
                    var webglPowerPreferences = ["default", "low-power", "high-performance"];
                    var _emscripten_webgl_do_create_context = (target,attributes)=>{
                        var attr32 = attributes >> 2;
                        var powerPreference = HEAP32[attr32 + (8 >> 2)];
                        var contextAttributes = {
                            alpha: !!HEAP8[attributes + 0],
                            depth: !!HEAP8[attributes + 1],
                            stencil: !!HEAP8[attributes + 2],
                            antialias: !!HEAP8[attributes + 3],
                            premultipliedAlpha: !!HEAP8[attributes + 4],
                            preserveDrawingBuffer: !!HEAP8[attributes + 5],
                            powerPreference: webglPowerPreferences[powerPreference],
                            failIfMajorPerformanceCaveat: !!HEAP8[attributes + 12],
                            majorVersion: HEAP32[attr32 + (16 >> 2)],
                            minorVersion: HEAP32[attr32 + (20 >> 2)],
                            enableExtensionsByDefault: HEAP8[attributes + 24],
                            explicitSwapControl: HEAP8[attributes + 25],
                            proxyContextToMainThread: HEAP32[attr32 + (28 >> 2)],
                            renderViaOffscreenBackBuffer: HEAP8[attributes + 32]
                        };
                        var canvas = findCanvasEventTarget(target);
                        if (!canvas) {
                            return 0
                        }
                        if (contextAttributes.explicitSwapControl) {
                            return 0
                        }
                        var contextHandle = GL.createContext(canvas, contextAttributes);
                        return contextHandle
                    }
                    ;
                    var _emscripten_webgl_create_context = _emscripten_webgl_do_create_context;
                    var _emscripten_webgl_destroy_context = contextHandle=>{
                        if (GL.currentContext == contextHandle)
                            GL.currentContext = 0;
                        GL.deleteContext(contextHandle)
                    }
                    ;
                    var _emscripten_webgl_get_drawing_buffer_size = (contextHandle,width,height)=>{
                        var GLContext = GL.getContext(contextHandle);
                        if (!GLContext || !GLContext.GLctx || !width || !height) {
                            return -5
                        }
                        HEAP32[width >> 2] = GLContext.GLctx.drawingBufferWidth;
                        HEAP32[height >> 2] = GLContext.GLctx.drawingBufferHeight;
                        return 0
                    }
                    ;
                    var _emscripten_webgl_make_context_current = contextHandle=>{
                        var success = GL.makeContextCurrent(contextHandle);
                        return success ? 0 : -5
                    }
                    ;
                    var ENV = {};
                    var getExecutableName = ()=>thisProgram || "./this.program";
                    var getEnvStrings = ()=>{
                        if (!getEnvStrings.strings) {
                            var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
                            var env = {
                                USER: "web_user",
                                LOGNAME: "web_user",
                                PATH: "/",
                                PWD: "/",
                                HOME: "/home/web_user",
                                LANG: lang,
                                _: getExecutableName()
                            };
                            for (var x in ENV) {
                                if (ENV[x] === undefined)
                                    delete env[x];
                                else
                                    env[x] = ENV[x]
                            }
                            var strings = [];
                            for (var x in env) {
                                strings.push(`${x}=${env[x]}`)
                            }
                            getEnvStrings.strings = strings
                        }
                        return getEnvStrings.strings
                    }
                    ;
                    var _environ_get = (__environ,environ_buf)=>{
                        var bufSize = 0;
                        var envp = 0;
                        for (var string of getEnvStrings()) {
                            var ptr = environ_buf + bufSize;
                            HEAPU32[__environ + envp >> 2] = ptr;
                            bufSize += stringToUTF8(string, ptr, Infinity) + 1;
                            envp += 4
                        }
                        return 0
                    }
                    ;
                    var _environ_sizes_get = (penviron_count,penviron_buf_size)=>{
                        var strings = getEnvStrings();
                        HEAPU32[penviron_count >> 2] = strings.length;
                        var bufSize = 0;
                        for (var string of strings) {
                            bufSize += lengthBytesUTF8(string) + 1
                        }
                        HEAPU32[penviron_buf_size >> 2] = bufSize;
                        return 0
                    }
                    ;
                    function _fd_close(fd) {
                        try {
                            var stream = SYSCALLS.getStreamFromFD(fd);
                            FS.close(stream);
                            return 0
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return e.errno
                        }
                    }
                    var doReadv = (stream,iov,iovcnt,offset)=>{
                        var ret = 0;
                        for (var i = 0; i < iovcnt; i++) {
                            var ptr = HEAPU32[iov >> 2];
                            var len = HEAPU32[iov + 4 >> 2];
                            iov += 8;
                            var curr = FS.read(stream, HEAP8, ptr, len, offset);
                            if (curr < 0)
                                return -1;
                            ret += curr;
                            if (curr < len)
                                break;
                            if (typeof offset != "undefined") {
                                offset += curr
                            }
                        }
                        return ret
                    }
                    ;
                    function _fd_read(fd, iov, iovcnt, pnum) {
                        try {
                            var stream = SYSCALLS.getStreamFromFD(fd);
                            var num = doReadv(stream, iov, iovcnt);
                            HEAPU32[pnum >> 2] = num;
                            return 0
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return e.errno
                        }
                    }
                    function _fd_seek(fd, offset, whence, newOffset) {
                        offset = bigintToI53Checked(offset);
                        try {
                            if (isNaN(offset))
                                return 61;
                            var stream = SYSCALLS.getStreamFromFD(fd);
                            FS.llseek(stream, offset, whence);
                            HEAP64[newOffset >> 3] = BigInt(stream.position);
                            if (stream.getdents && offset === 0 && whence === 0)
                                stream.getdents = null;
                            return 0
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return e.errno
                        }
                    }
                    var doWritev = (stream,iov,iovcnt,offset)=>{
                        var ret = 0;
                        for (var i = 0; i < iovcnt; i++) {
                            var ptr = HEAPU32[iov >> 2];
                            var len = HEAPU32[iov + 4 >> 2];
                            iov += 8;
                            var curr = FS.write(stream, HEAP8, ptr, len, offset);
                            if (curr < 0)
                                return -1;
                            ret += curr;
                            if (curr < len) {
                                break
                            }
                            if (typeof offset != "undefined") {
                                offset += curr
                            }
                        }
                        return ret
                    }
                    ;
                    function _fd_write(fd, iov, iovcnt, pnum) {
                        try {
                            var stream = SYSCALLS.getStreamFromFD(fd);
                            var num = doWritev(stream, iov, iovcnt);
                            HEAPU32[pnum >> 2] = num;
                            return 0
                        } catch (e) {
                            if (typeof FS == "undefined" || !(e.name === "ErrnoError"))
                                throw e;
                            return e.errno
                        }
                    }
                    var _getaddrinfo = (node,service,hint,out)=>{
                        var addr = 0;
                        var port = 0;
                        var flags = 0;
                        var family = 0;
                        var type = 0;
                        var proto = 0;
                        var ai;
                        function allocaddrinfo(family, type, proto, canon, addr, port) {
                            var sa, salen, ai;
                            var errno;
                            salen = family === 10 ? 28 : 16;
                            addr = family === 10 ? inetNtop6(addr) : inetNtop4(addr);
                            sa = _malloc(salen);
                            errno = writeSockaddr(sa, family, addr, port);
                            assert(!errno);
                            ai = _malloc(32);
                            HEAP32[ai + 4 >> 2] = family;
                            HEAP32[ai + 8 >> 2] = type;
                            HEAP32[ai + 12 >> 2] = proto;
                            HEAPU32[ai + 24 >> 2] = canon;
                            HEAPU32[ai + 20 >> 2] = sa;
                            if (family === 10) {
                                HEAP32[ai + 16 >> 2] = 28
                            } else {
                                HEAP32[ai + 16 >> 2] = 16
                            }
                            HEAP32[ai + 28 >> 2] = 0;
                            return ai
                        }
                        if (hint) {
                            flags = HEAP32[hint >> 2];
                            family = HEAP32[hint + 4 >> 2];
                            type = HEAP32[hint + 8 >> 2];
                            proto = HEAP32[hint + 12 >> 2]
                        }
                        if (type && !proto) {
                            proto = type === 2 ? 17 : 6
                        }
                        if (!type && proto) {
                            type = proto === 17 ? 2 : 1
                        }
                        if (proto === 0) {
                            proto = 6
                        }
                        if (type === 0) {
                            type = 1
                        }
                        if (!node && !service) {
                            return -2
                        }
                        if (flags & ~(1 | 2 | 4 | 1024 | 8 | 16 | 32)) {
                            return -1
                        }
                        if (hint !== 0 && HEAP32[hint >> 2] & 2 && !node) {
                            return -1
                        }
                        if (flags & 32) {
                            return -2
                        }
                        if (type !== 0 && type !== 1 && type !== 2) {
                            return -7
                        }
                        if (family !== 0 && family !== 2 && family !== 10) {
                            return -6
                        }
                        if (service) {
                            service = UTF8ToString(service);
                            port = parseInt(service, 10);
                            if (isNaN(port)) {
                                if (flags & 1024) {
                                    return -2
                                }
                                return -8
                            }
                        }
                        if (!node) {
                            if (family === 0) {
                                family = 2
                            }
                            if ((flags & 1) === 0) {
                                if (family === 2) {
                                    addr = _htonl(2130706433)
                                } else {
                                    addr = [0, 0, 0, _htonl(1)]
                                }
                            }
                            ai = allocaddrinfo(family, type, proto, null, addr, port);
                            HEAPU32[out >> 2] = ai;
                            return 0
                        }
                        node = UTF8ToString(node);
                        addr = inetPton4(node);
                        if (addr !== null) {
                            if (family === 0 || family === 2) {
                                family = 2
                            } else if (family === 10 && flags & 8) {
                                addr = [0, 0, _htonl(65535), addr];
                                family = 10
                            } else {
                                return -2
                            }
                        } else {
                            addr = inetPton6(node);
                            if (addr !== null) {
                                if (family === 0 || family === 10) {
                                    family = 10
                                } else {
                                    return -2
                                }
                            }
                        }
                        if (addr != null) {
                            ai = allocaddrinfo(family, type, proto, node, addr, port);
                            HEAPU32[out >> 2] = ai;
                            return 0
                        }
                        if (flags & 4) {
                            return -2
                        }
                        node = DNS.lookup_name(node);
                        addr = inetPton4(node);
                        if (family === 0) {
                            family = 2
                        } else if (family === 10) {
                            addr = [0, 0, _htonl(65535), addr]
                        }
                        ai = allocaddrinfo(family, type, proto, null, addr, port);
                        HEAPU32[out >> 2] = ai;
                        return 0
                    }
                    ;
                    var _getnameinfo = (sa,salen,node,nodelen,serv,servlen,flags)=>{
                        var info = readSockaddr(sa, salen);
                        if (info.errno) {
                            return -6
                        }
                        var port = info.port;
                        var addr = info.addr;
                        var overflowed = false;
                        if (node && nodelen) {
                            var lookup;
                            if (flags & 1 || !(lookup = DNS.lookup_addr(addr))) {
                                if (flags & 8) {
                                    return -2
                                }
                            } else {
                                addr = lookup
                            }
                            var numBytesWrittenExclNull = stringToUTF8(addr, node, nodelen);
                            if (numBytesWrittenExclNull + 1 >= nodelen) {
                                overflowed = true
                            }
                        }
                        if (serv && servlen) {
                            port = "" + port;
                            var numBytesWrittenExclNull = stringToUTF8(port, serv, servlen);
                            if (numBytesWrittenExclNull + 1 >= servlen) {
                                overflowed = true
                            }
                        }
                        if (overflowed) {
                            return -12
                        }
                        return 0
                    }
                    ;
                    var wasmTable;
                    var runAndAbortIfError = func=>{
                        try {
                            return func()
                        } catch (e) {
                            abort(e)
                        }
                    }
                    ;
                    var runtimeKeepalivePush = ()=>{
                        runtimeKeepaliveCounter += 1
                    }
                    ;
                    var runtimeKeepalivePop = ()=>{
                        runtimeKeepaliveCounter -= 1
                    }
                    ;
                    var Asyncify = {
                        instrumentWasmImports(imports) {
                            var importPattern = /^(invoke_.*|__asyncjs__.*)$/;
                            for (let[x,original] of Object.entries(imports)) {
                                if (typeof original == "function") {
                                    let isAsyncifyImport = original.isAsync || importPattern.test(x)
                                }
                            }
                        },
                        instrumentWasmExports(exports) {
                            var ret = {};
                            for (let[x,original] of Object.entries(exports)) {
                                if (typeof original == "function") {
                                    ret[x] = (...args)=>{
                                        Asyncify.exportCallStack.push(x);
                                        try {
                                            return original(...args)
                                        } finally {
                                            if (!ABORT) {
                                                var y = Asyncify.exportCallStack.pop();
                                                Asyncify.maybeStopUnwind()
                                            }
                                        }
                                    }
                                } else {
                                    ret[x] = original
                                }
                            }
                            return ret
                        },
                        State: {
                            Normal: 0,
                            Unwinding: 1,
                            Rewinding: 2,
                            Disabled: 3
                        },
                        state: 0,
                        StackSize: 8192,
                        currData: null,
                        handleSleepReturnValue: 0,
                        exportCallStack: [],
                        callStackNameToId: {},
                        callStackIdToName: {},
                        callStackId: 0,
                        asyncPromiseHandlers: null,
                        sleepCallbacks: [],
                        getCallStackId(funcName) {
                            var id = Asyncify.callStackNameToId[funcName];
                            if (id === undefined) {
                                id = Asyncify.callStackId++;
                                Asyncify.callStackNameToId[funcName] = id;
                                Asyncify.callStackIdToName[id] = funcName
                            }
                            return id
                        },
                        maybeStopUnwind() {
                            if (Asyncify.currData && Asyncify.state === Asyncify.State.Unwinding && Asyncify.exportCallStack.length === 0) {
                                Asyncify.state = Asyncify.State.Normal;
                                runAndAbortIfError(_asyncify_stop_unwind);
                                if (typeof Fibers != "undefined") {
                                    Fibers.trampoline()
                                }
                            }
                        },
                        whenDone() {
                            return new Promise((resolve,reject)=>{
                                Asyncify.asyncPromiseHandlers = {
                                    resolve,
                                    reject
                                }
                            }
                            )
                        },
                        allocateData() {
                            var ptr = _malloc(12 + Asyncify.StackSize);
                            Asyncify.setDataHeader(ptr, ptr + 12, Asyncify.StackSize);
                            Asyncify.setDataRewindFunc(ptr);
                            return ptr
                        },
                        setDataHeader(ptr, stack, stackSize) {
                            HEAPU32[ptr >> 2] = stack;
                            HEAPU32[ptr + 4 >> 2] = stack + stackSize
                        },
                        setDataRewindFunc(ptr) {
                            var bottomOfCallStack = Asyncify.exportCallStack[0];
                            var rewindId = Asyncify.getCallStackId(bottomOfCallStack);
                            HEAP32[ptr + 8 >> 2] = rewindId
                        },
                        getDataRewindFuncName(ptr) {
                            var id = HEAP32[ptr + 8 >> 2];
                            var name = Asyncify.callStackIdToName[id];
                            return name
                        },
                        getDataRewindFunc(name) {
                            var func = wasmExports[name];
                            return func
                        },
                        doRewind(ptr) {
                            var name = Asyncify.getDataRewindFuncName(ptr);
                            var func = Asyncify.getDataRewindFunc(name);
                            return func()
                        },
                        handleSleep(startAsync) {
                            if (ABORT)
                                return;
                            if (Asyncify.state === Asyncify.State.Normal) {
                                var reachedCallback = false;
                                var reachedAfterCallback = false;
                                startAsync((handleSleepReturnValue=0)=>{
                                    if (ABORT)
                                        return;
                                    Asyncify.handleSleepReturnValue = handleSleepReturnValue;
                                    reachedCallback = true;
                                    if (!reachedAfterCallback) {
                                        return
                                    }
                                    Asyncify.state = Asyncify.State.Rewinding;
                                    runAndAbortIfError(()=>_asyncify_start_rewind(Asyncify.currData));
                                    if (typeof MainLoop != "undefined" && MainLoop.func) {
                                        MainLoop.resume()
                                    }
                                    var asyncWasmReturnValue, isError = false;
                                    try {
                                        asyncWasmReturnValue = Asyncify.doRewind(Asyncify.currData)
                                    } catch (err) {
                                        asyncWasmReturnValue = err;
                                        isError = true
                                    }
                                    var handled = false;
                                    if (!Asyncify.currData) {
                                        var asyncPromiseHandlers = Asyncify.asyncPromiseHandlers;
                                        if (asyncPromiseHandlers) {
                                            Asyncify.asyncPromiseHandlers = null;
                                            (isError ? asyncPromiseHandlers.reject : asyncPromiseHandlers.resolve)(asyncWasmReturnValue);
                                            handled = true
                                        }
                                    }
                                    if (isError && !handled) {
                                        throw asyncWasmReturnValue
                                    }
                                }
                                );
                                reachedAfterCallback = true;
                                if (!reachedCallback) {
                                    Asyncify.state = Asyncify.State.Unwinding;
                                    Asyncify.currData = Asyncify.allocateData();
                                    if (typeof MainLoop != "undefined" && MainLoop.func) {
                                        MainLoop.pause()
                                    }
                                    runAndAbortIfError(()=>_asyncify_start_unwind(Asyncify.currData))
                                }
                            } else if (Asyncify.state === Asyncify.State.Rewinding) {
                                Asyncify.state = Asyncify.State.Normal;
                                runAndAbortIfError(_asyncify_stop_rewind);
                                _free(Asyncify.currData);
                                Asyncify.currData = null;
                                Asyncify.sleepCallbacks.forEach(callUserCallback)
                            } else {
                                abort(`invalid state: ${Asyncify.state}`)
                            }
                            return Asyncify.handleSleepReturnValue
                        },
                        handleAsync(startAsync) {
                            return Asyncify.handleSleep(wakeUp=>{
                                startAsync().then(wakeUp)
                            }
                            )
                        }
                    };
                    var warnOnce = text=>{
                        warnOnce.shown ||= {};
                        if (!warnOnce.shown[text]) {
                            warnOnce.shown[text] = 1;
                            err(text)
                        }
                    }
                    ;
                    var Browser = {
                        useWebGL: false,
                        isFullscreen: false,
                        pointerLock: false,
                        moduleContextCreatedCallbacks: [],
                        workers: [],
                        preloadedImages: {},
                        preloadedAudios: {},
                        getCanvas: ()=>Module["canvas"],
                        init() {
                            if (Browser.initted)
                                return;
                            Browser.initted = true;
                            var imagePlugin = {};
                            imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
                                return !Module["noImageDecoding"] && /\.(jpg|jpeg|png|bmp|webp)$/i.test(name)
                            }
                            ;
                            imagePlugin["handle"] = function imagePlugin_handle(byteArray, name, onload, onerror) {
                                var b = new Blob([byteArray],{
                                    type: Browser.getMimetype(name)
                                });
                                if (b.size !== byteArray.length) {
                                    b = new Blob([new Uint8Array(byteArray).buffer],{
                                        type: Browser.getMimetype(name)
                                    })
                                }
                                var url = URL.createObjectURL(b);
                                var img = new Image;
                                img.onload = ()=>{
                                    var canvas = document.createElement("canvas");
                                    canvas.width = img.width;
                                    canvas.height = img.height;
                                    var ctx = canvas.getContext("2d");
                                    ctx.drawImage(img, 0, 0);
                                    Browser.preloadedImages[name] = canvas;
                                    URL.revokeObjectURL(url);
                                    onload?.(byteArray)
                                }
                                ;
                                img.onerror = event=>{
                                    err(`Image ${url} could not be decoded`);
                                    onerror?.()
                                }
                                ;
                                img.src = url
                            }
                            ;
                            preloadPlugins.push(imagePlugin);
                            var audioPlugin = {};
                            audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
                                return !Module["noAudioDecoding"] && name.slice(-4)in {
                                    ".ogg": 1,
                                    ".wav": 1,
                                    ".mp3": 1
                                }
                            }
                            ;
                            audioPlugin["handle"] = function audioPlugin_handle(byteArray, name, onload, onerror) {
                                var done = false;
                                function finish(audio) {
                                    if (done)
                                        return;
                                    done = true;
                                    Browser.preloadedAudios[name] = audio;
                                    onload?.(byteArray)
                                }
                                var b = new Blob([byteArray],{
                                    type: Browser.getMimetype(name)
                                });
                                var url = URL.createObjectURL(b);
                                var audio = new Audio;
                                audio.addEventListener("canplaythrough", ()=>finish(audio), false);
                                audio.onerror = function audio_onerror(event) {
                                    if (done)
                                        return;
                                    err(`warning: browser could not fully decode audio ${name}, trying slower base64 approach`);
                                    function encode64(data) {
                                        var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                                        var PAD = "=";
                                        var ret = "";
                                        var leftchar = 0;
                                        var leftbits = 0;
                                        for (var i = 0; i < data.length; i++) {
                                            leftchar = leftchar << 8 | data[i];
                                            leftbits += 8;
                                            while (leftbits >= 6) {
                                                var curr = leftchar >> leftbits - 6 & 63;
                                                leftbits -= 6;
                                                ret += BASE[curr]
                                            }
                                        }
                                        if (leftbits == 2) {
                                            ret += BASE[(leftchar & 3) << 4];
                                            ret += PAD + PAD
                                        } else if (leftbits == 4) {
                                            ret += BASE[(leftchar & 15) << 2];
                                            ret += PAD
                                        }
                                        return ret
                                    }
                                    audio.src = "data:audio/x-" + name.slice(-3) + ";base64," + encode64(byteArray);
                                    finish(audio)
                                }
                                ;
                                audio.src = url;
                                safeSetTimeout(()=>{
                                    finish(audio)
                                }
                                , 1e4)
                            }
                            ;
                            preloadPlugins.push(audioPlugin);
                            function pointerLockChange() {
                                var canvas = Browser.getCanvas();
                                Browser.pointerLock = document["pointerLockElement"] === canvas || document["mozPointerLockElement"] === canvas || document["webkitPointerLockElement"] === canvas || document["msPointerLockElement"] === canvas
                            }
                            var canvas = Browser.getCanvas();
                            if (canvas) {
                                canvas.requestPointerLock = canvas["requestPointerLock"] || canvas["mozRequestPointerLock"] || canvas["webkitRequestPointerLock"] || canvas["msRequestPointerLock"] || (()=>{}
                                );
                                canvas.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document["webkitExitPointerLock"] || document["msExitPointerLock"] || (()=>{}
                                );
                                canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
                                document.addEventListener("pointerlockchange", pointerLockChange, false);
                                document.addEventListener("mozpointerlockchange", pointerLockChange, false);
                                document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
                                document.addEventListener("mspointerlockchange", pointerLockChange, false);
                                if (Module["elementPointerLock"]) {
                                    canvas.addEventListener("click", ev=>{
                                        if (!Browser.pointerLock && Browser.getCanvas().requestPointerLock) {
                                            Browser.getCanvas().requestPointerLock();
                                            ev.preventDefault()
                                        }
                                    }
                                    , false)
                                }
                            }
                        },
                        createContext(canvas, useWebGL, setInModule, webGLContextAttributes) {
                            if (useWebGL && Module["ctx"] && canvas == Browser.getCanvas())
                                return Module["ctx"];
                            var ctx;
                            var contextHandle;
                            if (useWebGL) {
                                var contextAttributes = {
                                    antialias: false,
                                    alpha: false,
                                    majorVersion: typeof WebGL2RenderingContext != "undefined" ? 2 : 1
                                };
                                if (webGLContextAttributes) {
                                    for (var attribute in webGLContextAttributes) {
                                        contextAttributes[attribute] = webGLContextAttributes[attribute]
                                    }
                                }
                                if (typeof GL != "undefined") {
                                    contextHandle = GL.createContext(canvas, contextAttributes);
                                    if (contextHandle) {
                                        ctx = GL.getContext(contextHandle).GLctx
                                    }
                                }
                            } else {
                                ctx = canvas.getContext("2d")
                            }
                            if (!ctx)
                                return null;
                            if (setInModule) {
                                Module["ctx"] = ctx;
                                if (useWebGL)
                                    GL.makeContextCurrent(contextHandle);
                                Browser.useWebGL = useWebGL;
                                Browser.moduleContextCreatedCallbacks.forEach(callback=>callback());
                                Browser.init()
                            }
                            return ctx
                        },
                        fullscreenHandlersInstalled: false,
                        lockPointer: undefined,
                        resizeCanvas: undefined,
                        requestFullscreen(lockPointer, resizeCanvas) {
                            Browser.lockPointer = lockPointer;
                            Browser.resizeCanvas = resizeCanvas;
                            if (typeof Browser.lockPointer == "undefined")
                                Browser.lockPointer = true;
                            if (typeof Browser.resizeCanvas == "undefined")
                                Browser.resizeCanvas = false;
                            var canvas = Browser.getCanvas();
                            function fullscreenChange() {
                                Browser.isFullscreen = false;
                                var canvasContainer = canvas.parentNode;
                                if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvasContainer) {
                                    canvas.exitFullscreen = Browser.exitFullscreen;
                                    if (Browser.lockPointer)
                                        canvas.requestPointerLock();
                                    Browser.isFullscreen = true;
                                    if (Browser.resizeCanvas) {
                                        Browser.setFullscreenCanvasSize()
                                    } else {
                                        Browser.updateCanvasDimensions(canvas)
                                    }
                                } else {
                                    canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
                                    canvasContainer.parentNode.removeChild(canvasContainer);
                                    if (Browser.resizeCanvas) {
                                        Browser.setWindowedCanvasSize()
                                    } else {
                                        Browser.updateCanvasDimensions(canvas)
                                    }
                                }
                                Module["onFullScreen"]?.(Browser.isFullscreen);
                                Module["onFullscreen"]?.(Browser.isFullscreen)
                            }
                            if (!Browser.fullscreenHandlersInstalled) {
                                Browser.fullscreenHandlersInstalled = true;
                                document.addEventListener("fullscreenchange", fullscreenChange, false);
                                document.addEventListener("mozfullscreenchange", fullscreenChange, false);
                                document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
                                document.addEventListener("MSFullscreenChange", fullscreenChange, false)
                            }
                            var canvasContainer = document.createElement("div");
                            canvas.parentNode.insertBefore(canvasContainer, canvas);
                            canvasContainer.appendChild(canvas);
                            canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullscreen"] ? ()=>canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null) || (canvasContainer["webkitRequestFullScreen"] ? ()=>canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null);
                            canvasContainer.requestFullscreen()
                        },
                        exitFullscreen() {
                            if (!Browser.isFullscreen) {
                                return false
                            }
                            var CFS = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] || (()=>{}
                            );
                            CFS.apply(document, []);
                            return true
                        },
                        safeSetTimeout(func, timeout) {
                            return safeSetTimeout(func, timeout)
                        },
                        getMimetype(name) {
                            return {
                                jpg: "image/jpeg",
                                jpeg: "image/jpeg",
                                png: "image/png",
                                bmp: "image/bmp",
                                ogg: "audio/ogg",
                                wav: "audio/wav",
                                mp3: "audio/mpeg"
                            }[name.slice(name.lastIndexOf(".") + 1)]
                        },
                        getUserMedia(func) {
                            window.getUserMedia ||= navigator["getUserMedia"] || navigator["mozGetUserMedia"];
                            window.getUserMedia(func)
                        },
                        getMovementX(event) {
                            return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0
                        },
                        getMovementY(event) {
                            return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0
                        },
                        getMouseWheelDelta(event) {
                            var delta = 0;
                            switch (event.type) {
                            case "DOMMouseScroll":
                                delta = event.detail / 3;
                                break;
                            case "mousewheel":
                                delta = event.wheelDelta / 120;
                                break;
                            case "wheel":
                                delta = event.deltaY;
                                switch (event.deltaMode) {
                                case 0:
                                    delta /= 100;
                                    break;
                                case 1:
                                    delta /= 3;
                                    break;
                                case 2:
                                    delta *= 80;
                                    break;
                                default:
                                    throw "unrecognized mouse wheel delta mode: " + event.deltaMode
                                }
                                break;
                            default:
                                throw "unrecognized mouse wheel event: " + event.type
                            }
                            return delta
                        },
                        mouseX: 0,
                        mouseY: 0,
                        mouseMovementX: 0,
                        mouseMovementY: 0,
                        touches: {},
                        lastTouches: {},
                        calculateMouseCoords(pageX, pageY) {
                            var canvas = Browser.getCanvas();
                            var rect = canvas.getBoundingClientRect();
                            var scrollX = typeof window.scrollX != "undefined" ? window.scrollX : window.pageXOffset;
                            var scrollY = typeof window.scrollY != "undefined" ? window.scrollY : window.pageYOffset;
                            var adjustedX = pageX - (scrollX + rect.left);
                            var adjustedY = pageY - (scrollY + rect.top);
                            adjustedX = adjustedX * (canvas.width / rect.width);
                            adjustedY = adjustedY * (canvas.height / rect.height);
                            return {
                                x: adjustedX,
                                y: adjustedY
                            }
                        },
                        setMouseCoords(pageX, pageY) {
                            const {x, y} = Browser.calculateMouseCoords(pageX, pageY);
                            Browser.mouseMovementX = x - Browser.mouseX;
                            Browser.mouseMovementY = y - Browser.mouseY;
                            Browser.mouseX = x;
                            Browser.mouseY = y
                        },
                        calculateMouseEvent(event) {
                            if (Browser.pointerLock) {
                                if (event.type != "mousemove" && "mozMovementX"in event) {
                                    Browser.mouseMovementX = Browser.mouseMovementY = 0
                                } else {
                                    Browser.mouseMovementX = Browser.getMovementX(event);
                                    Browser.mouseMovementY = Browser.getMovementY(event)
                                }
                                Browser.mouseX += Browser.mouseMovementX;
                                Browser.mouseY += Browser.mouseMovementY
                            } else {
                                if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
                                    var touch = event.touch;
                                    if (touch === undefined) {
                                        return
                                    }
                                    var coords = Browser.calculateMouseCoords(touch.pageX, touch.pageY);
                                    if (event.type === "touchstart") {
                                        Browser.lastTouches[touch.identifier] = coords;
                                        Browser.touches[touch.identifier] = coords
                                    } else if (event.type === "touchend" || event.type === "touchmove") {
                                        var last = Browser.touches[touch.identifier];
                                        last ||= coords;
                                        Browser.lastTouches[touch.identifier] = last;
                                        Browser.touches[touch.identifier] = coords
                                    }
                                    return
                                }
                                Browser.setMouseCoords(event.pageX, event.pageY)
                            }
                        },
                        resizeListeners: [],
                        updateResizeListeners() {
                            var canvas = Browser.getCanvas();
                            Browser.resizeListeners.forEach(listener=>listener(canvas.width, canvas.height))
                        },
                        setCanvasSize(width, height, noUpdates) {
                            var canvas = Browser.getCanvas();
                            Browser.updateCanvasDimensions(canvas, width, height);
                            if (!noUpdates)
                                Browser.updateResizeListeners()
                        },
                        windowedWidth: 0,
                        windowedHeight: 0,
                        setFullscreenCanvasSize() {
                            if (typeof SDL != "undefined") {
                                var flags = HEAPU32[SDL.screen >> 2];
                                flags = flags | 8388608;
                                HEAP32[SDL.screen >> 2] = flags
                            }
                            Browser.updateCanvasDimensions(Browser.getCanvas());
                            Browser.updateResizeListeners()
                        },
                        setWindowedCanvasSize() {
                            if (typeof SDL != "undefined") {
                                var flags = HEAPU32[SDL.screen >> 2];
                                flags = flags & ~8388608;
                                HEAP32[SDL.screen >> 2] = flags
                            }
                            Browser.updateCanvasDimensions(Browser.getCanvas());
                            Browser.updateResizeListeners()
                        },
                        updateCanvasDimensions(canvas, wNative, hNative) {
                            if (wNative && hNative) {
                                canvas.widthNative = wNative;
                                canvas.heightNative = hNative
                            } else {
                                wNative = canvas.widthNative;
                                hNative = canvas.heightNative
                            }
                            var w = wNative;
                            var h = hNative;
                            if (Module["forcedAspectRatio"] > 0) {
                                if (w / h < Module["forcedAspectRatio"]) {
                                    w = Math.round(h * Module["forcedAspectRatio"])
                                } else {
                                    h = Math.round(w / Module["forcedAspectRatio"])
                                }
                            }
                            if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvas.parentNode && typeof screen != "undefined") {
                                var factor = Math.min(screen.width / w, screen.height / h);
                                w = Math.round(w * factor);
                                h = Math.round(h * factor)
                            }
                            if (Browser.resizeCanvas) {
                                if (canvas.width != w)
                                    canvas.width = w;
                                if (canvas.height != h)
                                    canvas.height = h;
                                if (typeof canvas.style != "undefined") {
                                    canvas.style.removeProperty("width");
                                    canvas.style.removeProperty("height")
                                }
                            } else {
                                if (canvas.width != wNative)
                                    canvas.width = wNative;
                                if (canvas.height != hNative)
                                    canvas.height = hNative;
                                if (typeof canvas.style != "undefined") {
                                    if (w != wNative || h != hNative) {
                                        canvas.style.setProperty("width", w + "px", "important");
                                        canvas.style.setProperty("height", h + "px", "important")
                                    } else {
                                        canvas.style.removeProperty("width");
                                        canvas.style.removeProperty("height")
                                    }
                                }
                            }
                        }
                    };
                    var getCFunc = ident=>{
                        var func = Module["_" + ident];
                        return func
                    }
                    ;
                    var writeArrayToMemory = (array,buffer)=>{
                        HEAP8.set(array, buffer)
                    }
                    ;
                    var ccall = (ident,returnType,argTypes,args,opts)=>{
                        var toC = {
                            string: str=>{
                                var ret = 0;
                                if (str !== null && str !== undefined && str !== 0) {
                                    ret = stringToUTF8OnStack(str)
                                }
                                return ret
                            }
                            ,
                            array: arr=>{
                                var ret = stackAlloc(arr.length);
                                writeArrayToMemory(arr, ret);
                                return ret
                            }
                        };
                        function convertReturnValue(ret) {
                            if (returnType === "string") {
                                return UTF8ToString(ret)
                            }
                            if (returnType === "boolean")
                                return Boolean(ret);
                            return ret
                        }
                        var func = getCFunc(ident);
                        var cArgs = [];
                        var stack = 0;
                        if (args) {
                            for (var i = 0; i < args.length; i++) {
                                var converter = toC[argTypes[i]];
                                if (converter) {
                                    if (stack === 0)
                                        stack = stackSave();
                                    cArgs[i] = converter(args[i])
                                } else {
                                    cArgs[i] = args[i]
                                }
                            }
                        }
                        var previousAsync = Asyncify.currData;
                        var ret = func(...cArgs);
                        function onDone(ret) {
                            runtimeKeepalivePop();
                            if (stack !== 0)
                                stackRestore(stack);
                            return convertReturnValue(ret)
                        }
                        var asyncMode = opts?.async;
                        runtimeKeepalivePush();
                        if (Asyncify.currData != previousAsync) {
                            return Asyncify.whenDone().then(onDone)
                        }
                        ret = onDone(ret);
                        if (asyncMode)
                            return Promise.resolve(ret);
                        return ret
                    }
                    ;
                    var cwrap = (ident,returnType,argTypes,opts)=>{
                        var numericArgs = !argTypes || argTypes.every(type=>type === "number" || type === "boolean");
                        var numericRet = returnType !== "string";
                        if (numericRet && numericArgs && !opts) {
                            return getCFunc(ident)
                        }
                        return (...args)=>ccall(ident, returnType, argTypes, args, opts)
                    }
                    ;
                    var ERRNO_CODES = {
                        EPERM: 63,
                        ENOENT: 44,
                        ESRCH: 71,
                        EINTR: 27,
                        EIO: 29,
                        ENXIO: 60,
                        E2BIG: 1,
                        ENOEXEC: 45,
                        EBADF: 8,
                        ECHILD: 12,
                        EAGAIN: 6,
                        EWOULDBLOCK: 6,
                        ENOMEM: 48,
                        EACCES: 2,
                        EFAULT: 21,
                        ENOTBLK: 105,
                        EBUSY: 10,
                        EEXIST: 20,
                        EXDEV: 75,
                        ENODEV: 43,
                        ENOTDIR: 54,
                        EISDIR: 31,
                        EINVAL: 28,
                        ENFILE: 41,
                        EMFILE: 33,
                        ENOTTY: 59,
                        ETXTBSY: 74,
                        EFBIG: 22,
                        ENOSPC: 51,
                        ESPIPE: 70,
                        EROFS: 69,
                        EMLINK: 34,
                        EPIPE: 64,
                        EDOM: 18,
                        ERANGE: 68,
                        ENOMSG: 49,
                        EIDRM: 24,
                        ECHRNG: 106,
                        EL2NSYNC: 156,
                        EL3HLT: 107,
                        EL3RST: 108,
                        ELNRNG: 109,
                        EUNATCH: 110,
                        ENOCSI: 111,
                        EL2HLT: 112,
                        EDEADLK: 16,
                        ENOLCK: 46,
                        EBADE: 113,
                        EBADR: 114,
                        EXFULL: 115,
                        ENOANO: 104,
                        EBADRQC: 103,
                        EBADSLT: 102,
                        EDEADLOCK: 16,
                        EBFONT: 101,
                        ENOSTR: 100,
                        ENODATA: 116,
                        ETIME: 117,
                        ENOSR: 118,
                        ENONET: 119,
                        ENOPKG: 120,
                        EREMOTE: 121,
                        ENOLINK: 47,
                        EADV: 122,
                        ESRMNT: 123,
                        ECOMM: 124,
                        EPROTO: 65,
                        EMULTIHOP: 36,
                        EDOTDOT: 125,
                        EBADMSG: 9,
                        ENOTUNIQ: 126,
                        EBADFD: 127,
                        EREMCHG: 128,
                        ELIBACC: 129,
                        ELIBBAD: 130,
                        ELIBSCN: 131,
                        ELIBMAX: 132,
                        ELIBEXEC: 133,
                        ENOSYS: 52,
                        ENOTEMPTY: 55,
                        ENAMETOOLONG: 37,
                        ELOOP: 32,
                        EOPNOTSUPP: 138,
                        EPFNOSUPPORT: 139,
                        ECONNRESET: 15,
                        ENOBUFS: 42,
                        EAFNOSUPPORT: 5,
                        EPROTOTYPE: 67,
                        ENOTSOCK: 57,
                        ENOPROTOOPT: 50,
                        ESHUTDOWN: 140,
                        ECONNREFUSED: 14,
                        EADDRINUSE: 3,
                        ECONNABORTED: 13,
                        ENETUNREACH: 40,
                        ENETDOWN: 38,
                        ETIMEDOUT: 73,
                        EHOSTDOWN: 142,
                        EHOSTUNREACH: 23,
                        EINPROGRESS: 26,
                        EALREADY: 7,
                        EDESTADDRREQ: 17,
                        EMSGSIZE: 35,
                        EPROTONOSUPPORT: 66,
                        ESOCKTNOSUPPORT: 137,
                        EADDRNOTAVAIL: 4,
                        ENETRESET: 39,
                        EISCONN: 30,
                        ENOTCONN: 53,
                        ETOOMANYREFS: 141,
                        EUSERS: 136,
                        EDQUOT: 19,
                        ESTALE: 72,
                        ENOTSUP: 138,
                        ENOMEDIUM: 148,
                        EILSEQ: 25,
                        EOVERFLOW: 61,
                        ECANCELED: 11,
                        ENOTRECOVERABLE: 56,
                        EOWNERDEAD: 62,
                        ESTRPIPE: 135
                    };
                    function EmscriptenSendCommand(str) {
                        RPE.command_queue.push(str);
                        _platform_emscripten_command_raise_flag()
                    }
                    function EmscriptenReceiveCommandReply() {
                        return RPE.command_reply_queue.shift()
                    }
                    FS.createPreloadedFile = FS_createPreloadedFile;
                    FS.staticInit();
                    MEMFS.doesNotExistError = new FS.ErrnoError(44);
                    MEMFS.doesNotExistError.stack = "<generic error, no stack>";
                    Module["requestAnimationFrame"] = MainLoop.requestAnimationFrame;
                    Module["pauseMainLoop"] = MainLoop.pause;
                    Module["resumeMainLoop"] = MainLoop.resume;
                    MainLoop.init();
                    registerPreMainLoop(()=>GL.newRenderingFrameStarted());
                    for (let i = 0; i < 32; ++i)
                        tempFixedLengthArray.push(new Array(i));
                    var miniTempWebGLFloatBuffersStorage = new Float32Array(288);
                    for (var i = 0; i <= 288; ++i) {
                        miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i)
                    }
                    var miniTempWebGLIntBuffersStorage = new Int32Array(288);
                    for (var i = 0; i <= 288; ++i) {
                        miniTempWebGLIntBuffers[i] = miniTempWebGLIntBuffersStorage.subarray(0, i)
                    }
                    Module["requestFullscreen"] = Browser.requestFullscreen;
                    Module["setCanvasSize"] = Browser.setCanvasSize;
                    Module["getUserMedia"] = Browser.getUserMedia;
                    Module["createContext"] = Browser.createContext;
                    {
                        if (Module["noExitRuntime"])
                            noExitRuntime = Module["noExitRuntime"];
                        if (Module["preloadPlugins"])
                            preloadPlugins = Module["preloadPlugins"];
                        if (Module["print"])
                            out = Module["print"];
                        if (Module["printErr"])
                            err = Module["printErr"];
                        if (Module["wasmBinary"])
                            wasmBinary = Module["wasmBinary"];
                        if (Module["arguments"])
                            arguments_ = Module["arguments"];
                        if (Module["thisProgram"])
                            thisProgram = Module["thisProgram"]
                    }
                    Module["callMain"] = callMain;
                    Module["abort"] = abort;
                    Module["ENV"] = ENV;
                    Module["ERRNO_CODES"] = ERRNO_CODES;
                    Module["cwrap"] = cwrap;
                    Module["getValue"] = getValue;
                    Module["PATH"] = PATH;
                    Module["UTF8ToString"] = UTF8ToString;
                    Module["stringToNewUTF8"] = stringToNewUTF8;
                    Module["Browser"] = Browser;
                    Module["FS"] = FS;
                    Module["AL"] = AL;
                    Module["EmscriptenSendCommand"] = EmscriptenSendCommand;
                    Module["EmscriptenReceiveCommandReply"] = EmscriptenReceiveCommandReply;
                    Module["EmscriptenSendCommand"] = EmscriptenSendCommand;
                    Module["EmscriptenReceiveCommandReply"] = EmscriptenReceiveCommandReply;
                    var ASM_CONSTS = {
                        1410376: ()=>{
                            try {
                                return stringToNewUTF8(Module.getSavExt())
                            } catch (e) {
                                return stringToNewUTF8(".srm")
                            }
                        }
                        ,
                        1410477: $0=>{
                            if (Module.callbacks && typeof Module.callbacks.setupCoreSettingFile === "function") {
                                Module.callbacks.setupCoreSettingFile("/home/web_user/retroarch/userdata/config/" + UTF8ToString($0) + "/" + UTF8ToString($0) + ".opt")
                            }
                        }
                        ,
                        1410707: ($0,$1)=>{
                            var message = UTF8ToString($0, $1);
                            RPE.command_reply_queue.push(message)
                        }
                        ,
                        1410786: ($0,$1,$2)=>{
                            var next_command = RPE.command_queue.shift();
                            var length = lengthBytesUTF8(next_command);
                            if (length > $2) {
                                console.error("[CMD] Command too long, skipping", next_command);
                                return 0
                            }
                            stringToUTF8(next_command, $1, $2);
                            if (RPE.command_queue.length == 0) {
                                setValue($0, 0, "i8")
                            }
                            return length
                        }
                        ,
                        1411089: $0=>{
                            if ($0) {
                                Module.canvas.style.removeProperty("cursor")
                            } else {
                                Module.canvas.style.setProperty("cursor", "none")
                            }
                        }
                        ,
                        1411211: ()=>{
                            specialHTMLTargets["!canvas"] = Module.canvas;
                            specialHTMLTargets["!parent"] = Module.parent
                        }
                        ,
                        1411309: ()=>Atomics?.waitAsync?.toString().includes("[native code]"),
                        1411378: $0=>{
                            var func = $0 ? "fullscreenEnter" : "fullscreenExit";
                            if (Module[func]) {
                                Module[func]();
                                return 1
                            }
                            return 0
                        }
                    };
                    var wasmImports = {
                        Na: _PlatformEmscriptenGLContextEventInit,
                        lb: _PlatformEmscriptenGetSystemInfo,
                        Pa: _PlatformEmscriptenMemoryUsageInit,
                        Qa: _PlatformEmscriptenPowerStateInit,
                        ub: _PlatformEmscriptenSetCanvasSize,
                        Cb: _PlatformEmscriptenSetWakeLock,
                        ab: _PlatformEmscriptenWatchCanvasSizeAndDpr,
                        Oa: _PlatformEmscriptenWatchFullscreen,
                        Ra: _PlatformEmscriptenWatchWindowVisibility,
                        x: ___assert_fail,
                        Za: ___syscall_accept4,
                        Ya: ___syscall_bind,
                        Xa: ___syscall_connect,
                        j: ___syscall_fcntl64,
                        sb: ___syscall_ftruncate64,
                        rb: ___syscall_getcwd,
                        hb: ___syscall_getdents64,
                        Wa: ___syscall_getsockname,
                        Va: ___syscall_getsockopt,
                        tb: ___syscall_ioctl,
                        Ua: ___syscall_listen,
                        nb: ___syscall_mkdirat,
                        ia: ___syscall_openat,
                        ib: ___syscall_poll,
                        gb: ___syscall_readlinkat,
                        Ta: ___syscall_recvfrom,
                        db: ___syscall_renameat,
                        eb: ___syscall_rmdir,
                        Sa: ___syscall_sendto,
                        ga: ___syscall_socket,
                        cb: ___syscall_stat64,
                        fb: ___syscall_unlinkat,
                        xb: __abort_js,
                        _a: __emscripten_throw_longjmp,
                        jb: __localtime_js,
                        kb: __mktime_js,
                        mb: __tzset_js,
                        Ha: _alBufferData,
                        Ca: _alDeleteBuffers,
                        Da: _alDeleteSources,
                        Ia: _alGenBuffers,
                        Ja: _alGenSources,
                        da: _alGetError,
                        O: _alGetSourcei,
                        Fa: _alSourcePlay,
                        Ga: _alSourceQueueBuffers,
                        Ea: _alSourceStop,
                        ea: _alSourceUnqueueBuffers,
                        Aa: _alcCloseDevice,
                        Ka: _alcCreateContext,
                        Ba: _alcDestroyContext,
                        fa: _alcMakeContextCurrent,
                        La: _alcOpenDevice,
                        wb: _clock_time_get,
                        X: _emscripten_asm_const_int,
                        Q: _emscripten_asm_const_int_sync_on_main_thread,
                        Eg: _emscripten_asm_const_ptr,
                        rc: _emscripten_async_call,
                        _g: _emscripten_async_wget2_data,
                        vb: _emscripten_date_now,
                        Nb: _emscripten_exit_fullscreen,
                        qd: _emscripten_exit_pointerlock,
                        sh: _emscripten_force_exit,
                        bb: _emscripten_get_heap_max,
                        Fg: _emscripten_glActiveTexture,
                        Dg: _emscripten_glAttachShader,
                        sd: _emscripten_glBeginQuery,
                        Wg: _emscripten_glBeginQueryEXT,
                        Zc: _emscripten_glBeginTransformFeedback,
                        Cg: _emscripten_glBindAttribLocation,
                        Bg: _emscripten_glBindBuffer,
                        Wc: _emscripten_glBindBufferBase,
                        Xc: _emscripten_glBindBufferRange,
                        Ag: _emscripten_glBindFramebuffer,
                        zg: _emscripten_glBindRenderbuffer,
                        ac: _emscripten_glBindSampler,
                        yg: _emscripten_glBindTexture,
                        Tb: _emscripten_glBindTransformFeedback,
                        cd: _emscripten_glBindVertexArray,
                        Ng: _emscripten_glBindVertexArrayOES,
                        xg: _emscripten_glBlendColor,
                        wg: _emscripten_glBlendEquation,
                        vg: _emscripten_glBlendEquationSeparate,
                        ug: _emscripten_glBlendFunc,
                        tg: _emscripten_glBlendFuncSeparate,
                        gd: _emscripten_glBlitFramebuffer,
                        sg: _emscripten_glBufferData,
                        rg: _emscripten_glBufferSubData,
                        qg: _emscripten_glCheckFramebufferStatus,
                        pg: _emscripten_glClear,
                        yc: _emscripten_glClearBufferfi,
                        zc: _emscripten_glClearBufferfv,
                        Bc: _emscripten_glClearBufferiv,
                        Ac: _emscripten_glClearBufferuiv,
                        og: _emscripten_glClearColor,
                        ng: _emscripten_glClearDepthf,
                        mg: _emscripten_glClearStencil,
                        jc: _emscripten_glClientWaitSync,
                        Jd: _emscripten_glClipControlEXT,
                        lg: _emscripten_glColorMask,
                        kg: _emscripten_glCompileShader,
                        ig: _emscripten_glCompressedTexImage2D,
                        xd: _emscripten_glCompressedTexImage3D,
                        hg: _emscripten_glCompressedTexSubImage2D,
                        wd: _emscripten_glCompressedTexSubImage3D,
                        wc: _emscripten_glCopyBufferSubData,
                        gg: _emscripten_glCopyTexImage2D,
                        fg: _emscripten_glCopyTexSubImage2D,
                        yd: _emscripten_glCopyTexSubImage3D,
                        eg: _emscripten_glCreateProgram,
                        dg: _emscripten_glCreateShader,
                        cg: _emscripten_glCullFace,
                        bg: _emscripten_glDeleteBuffers,
                        ag: _emscripten_glDeleteFramebuffers,
                        $f: _emscripten_glDeleteProgram,
                        ud: _emscripten_glDeleteQueries,
                        Yg: _emscripten_glDeleteQueriesEXT,
                        Zf: _emscripten_glDeleteRenderbuffers,
                        cc: _emscripten_glDeleteSamplers,
                        Yf: _emscripten_glDeleteShader,
                        kc: _emscripten_glDeleteSync,
                        Xf: _emscripten_glDeleteTextures,
                        Sb: _emscripten_glDeleteTransformFeedbacks,
                        bd: _emscripten_glDeleteVertexArrays,
                        Mg: _emscripten_glDeleteVertexArraysOES,
                        Wf: _emscripten_glDepthFunc,
                        Vf: _emscripten_glDepthMask,
                        Uf: _emscripten_glDepthRangef,
                        Tf: _emscripten_glDetachShader,
                        Sf: _emscripten_glDisable,
                        Rf: _emscripten_glDisableVertexAttribArray,
                        Qf: _emscripten_glDrawArrays,
                        oc: _emscripten_glDrawArraysInstanced,
                        Ig: _emscripten_glDrawArraysInstancedANGLE,
                        Ab: _emscripten_glDrawArraysInstancedARB,
                        Gd: _emscripten_glDrawArraysInstancedEXT,
                        Bb: _emscripten_glDrawArraysInstancedNV,
                        nd: _emscripten_glDrawBuffers,
                        Ed: _emscripten_glDrawBuffersEXT,
                        Jg: _emscripten_glDrawBuffersWEBGL,
                        Nf: _emscripten_glDrawElements,
                        nc: _emscripten_glDrawElementsInstanced,
                        Hg: _emscripten_glDrawElementsInstancedANGLE,
                        yb: _emscripten_glDrawElementsInstancedARB,
                        zb: _emscripten_glDrawElementsInstancedEXT,
                        Fd: _emscripten_glDrawElementsInstancedNV,
                        Cd: _emscripten_glDrawRangeElements,
                        Mf: _emscripten_glEnable,
                        Lf: _emscripten_glEnableVertexAttribArray,
                        rd: _emscripten_glEndQuery,
                        Vg: _emscripten_glEndQueryEXT,
                        Yc: _emscripten_glEndTransformFeedback,
                        mc: _emscripten_glFenceSync,
                        Kf: _emscripten_glFinish,
                        Jf: _emscripten_glFlush,
                        If: _emscripten_glFramebufferRenderbuffer,
                        Hf: _emscripten_glFramebufferTexture2D,
                        dd: _emscripten_glFramebufferTextureLayer,
                        Gf: _emscripten_glFrontFace,
                        Ff: _emscripten_glGenBuffers,
                        Cf: _emscripten_glGenFramebuffers,
                        vd: _emscripten_glGenQueries,
                        Zg: _emscripten_glGenQueriesEXT,
                        Bf: _emscripten_glGenRenderbuffers,
                        dc: _emscripten_glGenSamplers,
                        Af: _emscripten_glGenTextures,
                        Rb: _emscripten_glGenTransformFeedbacks,
                        ad: _emscripten_glGenVertexArrays,
                        Lg: _emscripten_glGenVertexArraysOES,
                        Ef: _emscripten_glGenerateMipmap,
                        zf: _emscripten_glGetActiveAttrib,
                        yf: _emscripten_glGetActiveUniform,
                        qc: _emscripten_glGetActiveUniformBlockName,
                        sc: _emscripten_glGetActiveUniformBlockiv,
                        uc: _emscripten_glGetActiveUniformsiv,
                        xf: _emscripten_glGetAttachedShaders,
                        wf: _emscripten_glGetAttribLocation,
                        vf: _emscripten_glGetBooleanv,
                        ec: _emscripten_glGetBufferParameteri64v,
                        uf: _emscripten_glGetBufferParameteriv,
                        tf: _emscripten_glGetError,
                        rf: _emscripten_glGetFloatv,
                        Lc: _emscripten_glGetFragDataLocation,
                        qf: _emscripten_glGetFramebufferAttachmentParameteriv,
                        fc: _emscripten_glGetInteger64i_v,
                        hc: _emscripten_glGetInteger64v,
                        _c: _emscripten_glGetIntegeri_v,
                        pf: _emscripten_glGetIntegerv,
                        Fb: _emscripten_glGetInternalformativ,
                        Mb: _emscripten_glGetProgramBinary,
                        nf: _emscripten_glGetProgramInfoLog,
                        of: _emscripten_glGetProgramiv,
                        Qg: _emscripten_glGetQueryObjecti64vEXT,
                        Sg: _emscripten_glGetQueryObjectivEXT,
                        Og: _emscripten_glGetQueryObjectui64vEXT,
                        od: _emscripten_glGetQueryObjectuiv,
                        Rg: _emscripten_glGetQueryObjectuivEXT,
                        pd: _emscripten_glGetQueryiv,
                        Tg: _emscripten_glGetQueryivEXT,
                        mf: _emscripten_glGetRenderbufferParameteriv,
                        Vb: _emscripten_glGetSamplerParameterfv,
                        Wb: _emscripten_glGetSamplerParameteriv,
                        kf: _emscripten_glGetShaderInfoLog,
                        jf: _emscripten_glGetShaderPrecisionFormat,
                        hf: _emscripten_glGetShaderSource,
                        lf: _emscripten_glGetShaderiv,
                        ff: _emscripten_glGetString,
                        xc: _emscripten_glGetStringi,
                        gc: _emscripten_glGetSynciv,
                        ef: _emscripten_glGetTexParameterfv,
                        df: _emscripten_glGetTexParameteriv,
                        Uc: _emscripten_glGetTransformFeedbackVarying,
                        tc: _emscripten_glGetUniformBlockIndex,
                        vc: _emscripten_glGetUniformIndices,
                        af: _emscripten_glGetUniformLocation,
                        cf: _emscripten_glGetUniformfv,
                        bf: _emscripten_glGetUniformiv,
                        Mc: _emscripten_glGetUniformuiv,
                        Sc: _emscripten_glGetVertexAttribIiv,
                        Rc: _emscripten_glGetVertexAttribIuiv,
                        Ze: _emscripten_glGetVertexAttribPointerv,
                        $e: _emscripten_glGetVertexAttribfv,
                        _e: _emscripten_glGetVertexAttribiv,
                        Ye: _emscripten_glHint,
                        Jb: _emscripten_glInvalidateFramebuffer,
                        Ib: _emscripten_glInvalidateSubFramebuffer,
                        We: _emscripten_glIsBuffer,
                        Ve: _emscripten_glIsEnabled,
                        Ue: _emscripten_glIsFramebuffer,
                        Te: _emscripten_glIsProgram,
                        td: _emscripten_glIsQuery,
                        Xg: _emscripten_glIsQueryEXT,
                        Se: _emscripten_glIsRenderbuffer,
                        bc: _emscripten_glIsSampler,
                        Re: _emscripten_glIsShader,
                        lc: _emscripten_glIsSync,
                        Qe: _emscripten_glIsTexture,
                        Qb: _emscripten_glIsTransformFeedback,
                        $c: _emscripten_glIsVertexArray,
                        Kg: _emscripten_glIsVertexArrayOES,
                        Pe: _emscripten_glLineWidth,
                        Oe: _emscripten_glLinkProgram,
                        Pb: _emscripten_glPauseTransformFeedback,
                        Ne: _emscripten_glPixelStorei,
                        Id: _emscripten_glPolygonModeWEBGL,
                        Le: _emscripten_glPolygonOffset,
                        Kd: _emscripten_glPolygonOffsetClampEXT,
                        Lb: _emscripten_glProgramBinary,
                        Kb: _emscripten_glProgramParameteri,
                        Ug: _emscripten_glQueryCounterEXT,
                        Dd: _emscripten_glReadBuffer,
                        Ke: _emscripten_glReadPixels,
                        Je: _emscripten_glReleaseShaderCompiler,
                        Ie: _emscripten_glRenderbufferStorage,
                        ed: _emscripten_glRenderbufferStorageMultisample,
                        Ob: _emscripten_glResumeTransformFeedback,
                        He: _emscripten_glSampleCoverage,
                        Zb: _emscripten_glSamplerParameterf,
                        Xb: _emscripten_glSamplerParameterfv,
                        $b: _emscripten_glSamplerParameteri,
                        _b: _emscripten_glSamplerParameteriv,
                        Ge: _emscripten_glScissor,
                        Fe: _emscripten_glShaderBinary,
                        Ee: _emscripten_glShaderSource,
                        De: _emscripten_glStencilFunc,
                        Ce: _emscripten_glStencilFuncSeparate,
                        Ae: _emscripten_glStencilMask,
                        ze: _emscripten_glStencilMaskSeparate,
                        ye: _emscripten_glStencilOp,
                        xe: _emscripten_glStencilOpSeparate,
                        we: _emscripten_glTexImage2D,
                        Ad: _emscripten_glTexImage3D,
                        ve: _emscripten_glTexParameterf,
                        ue: _emscripten_glTexParameterfv,
                        te: _emscripten_glTexParameteri,
                        se: _emscripten_glTexParameteriv,
                        Hb: _emscripten_glTexStorage2D,
                        Gb: _emscripten_glTexStorage3D,
                        re: _emscripten_glTexSubImage2D,
                        zd: _emscripten_glTexSubImage3D,
                        Vc: _emscripten_glTransformFeedbackVaryings,
                        pe: _emscripten_glUniform1f,
                        oe: _emscripten_glUniform1fv,
                        ne: _emscripten_glUniform1i,
                        me: _emscripten_glUniform1iv,
                        Kc: _emscripten_glUniform1ui,
                        Gc: _emscripten_glUniform1uiv,
                        le: _emscripten_glUniform2f,
                        ke: _emscripten_glUniform2fv,
                        je: _emscripten_glUniform2i,
                        ie: _emscripten_glUniform2iv,
                        Jc: _emscripten_glUniform2ui,
                        Fc: _emscripten_glUniform2uiv,
                        he: _emscripten_glUniform3f,
                        ge: _emscripten_glUniform3fv,
                        ee: _emscripten_glUniform3i,
                        de: _emscripten_glUniform3iv,
                        Ic: _emscripten_glUniform3ui,
                        Ec: _emscripten_glUniform3uiv,
                        ce: _emscripten_glUniform4f,
                        be: _emscripten_glUniform4fv,
                        ae: _emscripten_glUniform4i,
                        $d: _emscripten_glUniform4iv,
                        Hc: _emscripten_glUniform4ui,
                        Dc: _emscripten_glUniform4uiv,
                        pc: _emscripten_glUniformBlockBinding,
                        _d: _emscripten_glUniformMatrix2fv,
                        md: _emscripten_glUniformMatrix2x3fv,
                        kd: _emscripten_glUniformMatrix2x4fv,
                        Zd: _emscripten_glUniformMatrix3fv,
                        ld: _emscripten_glUniformMatrix3x2fv,
                        id: _emscripten_glUniformMatrix3x4fv,
                        Yd: _emscripten_glUniformMatrix4fv,
                        jd: _emscripten_glUniformMatrix4x2fv,
                        hd: _emscripten_glUniformMatrix4x3fv,
                        Xd: _emscripten_glUseProgram,
                        Vd: _emscripten_glValidateProgram,
                        Ud: _emscripten_glVertexAttrib1f,
                        Td: _emscripten_glVertexAttrib1fv,
                        Sd: _emscripten_glVertexAttrib2f,
                        Rd: _emscripten_glVertexAttrib2fv,
                        Qd: _emscripten_glVertexAttrib3f,
                        Pd: _emscripten_glVertexAttrib3fv,
                        Od: _emscripten_glVertexAttrib4f,
                        Nd: _emscripten_glVertexAttrib4fv,
                        Ub: _emscripten_glVertexAttribDivisor,
                        Gg: _emscripten_glVertexAttribDivisorANGLE,
                        Db: _emscripten_glVertexAttribDivisorARB,
                        Hd: _emscripten_glVertexAttribDivisorEXT,
                        Eb: _emscripten_glVertexAttribDivisorNV,
                        Qc: _emscripten_glVertexAttribI4i,
                        Oc: _emscripten_glVertexAttribI4iv,
                        Pc: _emscripten_glVertexAttribI4ui,
                        Nc: _emscripten_glVertexAttribI4uiv,
                        Tc: _emscripten_glVertexAttribIPointer,
                        Md: _emscripten_glVertexAttribPointer,
                        Ld: _emscripten_glViewport,
                        ic: _emscripten_glWaitSync,
                        fd: _emscripten_html5_remove_all_event_listeners,
                        th: _emscripten_pause_main_loop,
                        Yb: _emscripten_request_fullscreen,
                        Bd: _emscripten_request_pointerlock,
                        $a: _emscripten_resize_heap,
                        Pf: _emscripten_resume_main_loop,
                        Cc: _emscripten_set_canvas_element_size,
                        ja: _emscripten_set_devicemotion_callback_on_thread,
                        jg: _emscripten_set_keydown_callback_on_thread,
                        Of: _emscripten_set_keypress_callback_on_thread,
                        _f: _emscripten_set_keyup_callback_on_thread,
                        Ma: _emscripten_set_main_loop,
                        I: _emscripten_set_main_loop_timing,
                        Df: _emscripten_set_mousedown_callback_on_thread,
                        gf: _emscripten_set_mousemove_callback_on_thread,
                        sf: _emscripten_set_mouseup_callback_on_thread,
                        Wd: _emscripten_set_pointerlockchange_callback_on_thread,
                        fe: _emscripten_set_touchcancel_callback_on_thread,
                        Be: _emscripten_set_touchend_callback_on_thread,
                        qe: _emscripten_set_touchmove_callback_on_thread,
                        Me: _emscripten_set_touchstart_callback_on_thread,
                        Xe: _emscripten_set_wheel_callback_on_thread,
                        P: _emscripten_sleep,
                        rh: _emscripten_webgl_create_context,
                        xa: _emscripten_webgl_destroy_context,
                        qh: _emscripten_webgl_get_drawing_buffer_size,
                        wa: _emscripten_webgl_make_context_current,
                        pb: _environ_get,
                        qb: _environ_sizes_get,
                        $: _exit,
                        H: _fd_close,
                        ha: _fd_read,
                        ob: _fd_seek,
                        W: _fd_write,
                        E: _getaddrinfo,
                        D: _getnameinfo,
                        F: _glActiveTexture,
                        ta: _glAttachShader,
                        na: _glBindBuffer,
                        k: _glBindFramebuffer,
                        L: _glBindRenderbuffer,
                        b: _glBindTexture,
                        G: _glBlendEquation,
                        u: _glBlendFunc,
                        eh: _glBufferData,
                        A: _glCheckFramebufferStatus,
                        w: _glClear,
                        V: _glClearColor,
                        ah: _glCompileShader,
                        jh: _glCreateProgram,
                        ua: _glCreateShader,
                        U: _glDeleteBuffers,
                        t: _glDeleteFramebuffers,
                        pa: _glDeleteProgram,
                        _: _glDeleteRenderbuffers,
                        ra: _glDeleteShader,
                        f: _glDeleteTextures,
                        g: _glDisable,
                        Y: _glDisableVertexAttribArray,
                        n: _glDrawArrays,
                        v: _glEnable,
                        dh: _glEnableVertexAttribArray,
                        R: _glFramebufferRenderbuffer,
                        B: _glFramebufferTexture2D,
                        va: _glGenBuffers,
                        T: _glGenFramebuffers,
                        ya: _glGenRenderbuffers,
                        p: _glGenTextures,
                        M: _glGenerateMipmap,
                        oa: _glGetAttribLocation,
                        aa: _glGetError,
                        S: _glGetIntegerv,
                        gh: _glGetProgramInfoLog,
                        sa: _glGetProgramiv,
                        $g: _glGetShaderInfoLog,
                        ma: _glGetShaderiv,
                        c: _glGetString,
                        z: _glGetUniformLocation,
                        qa: _glIsProgram,
                        ih: _glLinkProgram,
                        C: _glPixelStorei,
                        za: _glReadPixels,
                        Z: _glRenderbufferStorage,
                        ca: _glScissor,
                        bh: _glShaderSource,
                        o: _glTexImage2D,
                        d: _glTexParameteri,
                        N: _glTexSubImage2D,
                        K: _glUniform1f,
                        mh: _glUniform1fv,
                        m: _glUniform1i,
                        ph: _glUniform2f,
                        i: _glUniform2fv,
                        oh: _glUniform3f,
                        lh: _glUniform3fv,
                        nh: _glUniform4f,
                        kh: _glUniform4fv,
                        fh: _glUniformMatrix4fv,
                        y: _glUseProgram,
                        ch: _glVertexAttribPointer,
                        q: _glViewport,
                        ka: invoke_i,
                        h: invoke_ii,
                        s: invoke_iii,
                        r: invoke_iiii,
                        hh: invoke_iiiii,
                        ba: invoke_iiiiii,
                        Pg: invoke_iiiiiii,
                        l: invoke_v,
                        e: invoke_vi,
                        a: invoke_vii,
                        J: invoke_viii,
                        la: invoke_viiii
                    };
                    var wasmExports = await createWasm();
                    var ___wasm_call_ctors = wasmExports["vh"];
                    var _free = Module["_free"] = wasmExports["xh"];
                    var _cmd_take_screenshot = Module["_cmd_take_screenshot"] = wasmExports["yh"];
                    var _get_current_frame_count = Module["_get_current_frame_count"] = wasmExports["zh"];
                    var _save_file_path = Module["_save_file_path"] = wasmExports["Ah"];
                    var _toggleMainLoop = Module["_toggleMainLoop"] = wasmExports["Bh"];
                    var _load_state = Module["_load_state"] = wasmExports["Ch"];
                    var _system_restart = Module["_system_restart"] = wasmExports["Dh"];
                    var _get_disk_count = Module["_get_disk_count"] = wasmExports["Eh"];
                    var _set_current_disk = Module["_set_current_disk"] = wasmExports["Fh"];
                    var _get_current_disk = Module["_get_current_disk"] = wasmExports["Gh"];
                    var _toggle_fastforward = Module["_toggle_fastforward"] = wasmExports["Hh"];
                    var _set_ff_ratio = Module["_set_ff_ratio"] = wasmExports["Ih"];
                    var _toggle_slow_motion = Module["_toggle_slow_motion"] = wasmExports["Jh"];
                    var _set_sm_ratio = Module["_set_sm_ratio"] = wasmExports["Kh"];
                    var _toggle_rewind = Module["_toggle_rewind"] = wasmExports["Lh"];
                    var _set_rewind_granularity = Module["_set_rewind_granularity"] = wasmExports["Mh"];
                    var _malloc = Module["_malloc"] = wasmExports["Nh"];
                    var _ejs_set_variable = Module["_ejs_set_variable"] = wasmExports["Oh"];
                    var _get_core_options = Module["_get_core_options"] = wasmExports["Ph"];
                    var _set_video_rotation = Module["_set_video_rotation"] = wasmExports["Qh"];
                    var _get_video_dimensions = Module["_get_video_dimensions"] = wasmExports["Rh"];
                    var _shader_enable = Module["_shader_enable"] = wasmExports["Sh"];
                    var _save_state_info = Module["_save_state_info"] = wasmExports["Th"];
                    var _supports_states = Module["_supports_states"] = wasmExports["Uh"];
                    var _refresh_save_files = Module["_refresh_save_files"] = wasmExports["Vh"];
                    var _ejs_set_keyboard_enabled = Module["_ejs_set_keyboard_enabled"] = wasmExports["Wh"];
                    var _simulate_input = Module["_simulate_input"] = wasmExports["Xh"];
                    var _cmd_savefiles = Module["_cmd_savefiles"] = wasmExports["Yh"];
                    var _cmd_save_state = Module["_cmd_save_state"] = wasmExports["Zh"];
                    var _set_cheat = Module["_set_cheat"] = wasmExports["_h"];
                    var _reset_cheat = Module["_reset_cheat"] = wasmExports["$h"];
                    var _set_vsync = Module["_set_vsync"] = wasmExports["ai"];
                    var _platform_emscripten_update_canvas_dimensions_cb = wasmExports["bi"];
                    var _platform_emscripten_update_window_hidden_cb = wasmExports["ci"];
                    var _platform_emscripten_update_power_state_cb = wasmExports["di"];
                    var _platform_emscripten_update_memory_usage_cb = wasmExports["ei"];
                    var _platform_emscripten_update_fullscreen_state_cb = wasmExports["fi"];
                    var _platform_emscripten_gl_context_lost_cb = wasmExports["gi"];
                    var _platform_emscripten_gl_context_restored_cb = wasmExports["hi"];
                    var _platform_emscripten_command_raise_flag = wasmExports["ii"];
                    var _main = Module["_main"] = wasmExports["ji"];
                    var _htons = wasmExports["ki"];
                    var _ntohs = wasmExports["li"];
                    var _htonl = wasmExports["mi"];
                    var _setThrew = wasmExports["ni"];
                    var __emscripten_stack_restore = wasmExports["oi"];
                    var __emscripten_stack_alloc = wasmExports["pi"];
                    var _emscripten_stack_get_current = wasmExports["qi"];
                    var dynCall_v = Module["dynCall_v"] = wasmExports["ri"];
                    var dynCall_viiii = Module["dynCall_viiii"] = wasmExports["si"];
                    var dynCall_i = Module["dynCall_i"] = wasmExports["ti"];
                    var dynCall_ii = Module["dynCall_ii"] = wasmExports["ui"];
                    var dynCall_vii = Module["dynCall_vii"] = wasmExports["vi"];
                    var dynCall_iiii = Module["dynCall_iiii"] = wasmExports["wi"];
                    var dynCall_iiiiii = Module["dynCall_iiiiii"] = wasmExports["xi"];
                    var dynCall_vi = Module["dynCall_vi"] = wasmExports["yi"];
                    var dynCall_viii = Module["dynCall_viii"] = wasmExports["zi"];
                    var dynCall_iiiii = Module["dynCall_iiiii"] = wasmExports["Ai"];
                    var dynCall_iii = Module["dynCall_iii"] = wasmExports["Bi"];
                    var dynCall_viiiii = Module["dynCall_viiiii"] = wasmExports["dynCall_viiiii"];
                    var dynCall_iiiiiii = Module["dynCall_iiiiiii"] = wasmExports["Ci"];
                    var dynCall_j = Module["dynCall_j"] = wasmExports["dynCall_j"];
                    var dynCall_fii = Module["dynCall_fii"] = wasmExports["dynCall_fii"];
                    var dynCall_ji = Module["dynCall_ji"] = wasmExports["dynCall_ji"];
                    var dynCall_jiji = Module["dynCall_jiji"] = wasmExports["dynCall_jiji"];
                    var dynCall_jiij = Module["dynCall_jiij"] = wasmExports["dynCall_jiij"];
                    var dynCall_jij = Module["dynCall_jij"] = wasmExports["dynCall_jij"];
                    var dynCall_iijii = Module["dynCall_iijii"] = wasmExports["dynCall_iijii"];
                    var dynCall_iijijii = Module["dynCall_iijijii"] = wasmExports["dynCall_iijijii"];
                    var dynCall_iiiiiiiiiii = Module["dynCall_iiiiiiiiiii"] = wasmExports["dynCall_iiiiiiiiiii"];
                    var dynCall_fiii = Module["dynCall_fiii"] = wasmExports["dynCall_fiii"];
                    var dynCall_iiiiijiii = Module["dynCall_iiiiijiii"] = wasmExports["dynCall_iiiiijiii"];
                    var dynCall_fffff = Module["dynCall_fffff"] = wasmExports["dynCall_fffff"];
                    var dynCall_iif = Module["dynCall_iif"] = wasmExports["dynCall_iif"];
                    var dynCall_viiiiii = Module["dynCall_viiiiii"] = wasmExports["dynCall_viiiiii"];
                    var dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] = wasmExports["dynCall_viiiiiiiii"];
                    var dynCall_iiiif = Module["dynCall_iiiif"] = wasmExports["dynCall_iiiif"];
                    var dynCall_iidii = Module["dynCall_iidii"] = wasmExports["dynCall_iidii"];
                    var dynCall_iji = Module["dynCall_iji"] = wasmExports["dynCall_iji"];
                    var dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = wasmExports["dynCall_iiiiiiii"];
                    var dynCall_viiiiiii = Module["dynCall_viiiiiii"] = wasmExports["dynCall_viiiiiii"];
                    var dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] = wasmExports["dynCall_iiiiiiiii"];
                    var dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = wasmExports["dynCall_viiiiiiii"];
                    var dynCall_viiiiiiiiii = Module["dynCall_viiiiiiiiii"] = wasmExports["dynCall_viiiiiiiiii"];
                    var dynCall_iiifi = Module["dynCall_iiifi"] = wasmExports["dynCall_iiifi"];
                    var dynCall_viiffff = Module["dynCall_viiffff"] = wasmExports["dynCall_viiffff"];
                    var dynCall_viif = Module["dynCall_viif"] = wasmExports["dynCall_viif"];
                    var dynCall_fi = Module["dynCall_fi"] = wasmExports["dynCall_fi"];
                    var dynCall_viiiiif = Module["dynCall_viiiiif"] = wasmExports["dynCall_viiiiif"];
                    var dynCall_jiiii = Module["dynCall_jiiii"] = wasmExports["dynCall_jiiii"];
                    var dynCall_vffff = Module["dynCall_vffff"] = wasmExports["dynCall_vffff"];
                    var dynCall_vf = Module["dynCall_vf"] = wasmExports["dynCall_vf"];
                    var dynCall_vff = Module["dynCall_vff"] = wasmExports["dynCall_vff"];
                    var dynCall_vfi = Module["dynCall_vfi"] = wasmExports["dynCall_vfi"];
                    var dynCall_vif = Module["dynCall_vif"] = wasmExports["dynCall_vif"];
                    var dynCall_viff = Module["dynCall_viff"] = wasmExports["dynCall_viff"];
                    var dynCall_vifff = Module["dynCall_vifff"] = wasmExports["dynCall_vifff"];
                    var dynCall_viffff = Module["dynCall_viffff"] = wasmExports["dynCall_viffff"];
                    var dynCall_vfff = Module["dynCall_vfff"] = wasmExports["dynCall_vfff"];
                    var dynCall_viiiiiiiiiii = Module["dynCall_viiiiiiiiiii"] = wasmExports["dynCall_viiiiiiiiiii"];
                    var dynCall_viifi = Module["dynCall_viifi"] = wasmExports["dynCall_viifi"];
                    var dynCall_iidiiii = Module["dynCall_iidiiii"] = wasmExports["dynCall_iidiiii"];
                    var _asyncify_start_unwind = wasmExports["Di"];
                    var _asyncify_stop_unwind = wasmExports["Ei"];
                    var _asyncify_start_rewind = wasmExports["Fi"];
                    var _asyncify_stop_rewind = wasmExports["Gi"];
                    function invoke_i(index) {
                        var sp = stackSave();
                        try {
                            return dynCall_i(index)
                        } catch (e) {
                            stackRestore(sp);
                            if (e !== e + 0)
                                throw e;
                            _setThrew(1, 0)
                        }
                    }
                    function invoke_ii(index, a1) {
                        var sp = stackSave();
                        try {
                            return dynCall_ii(index, a1)
                        } catch (e) {
                            stackRestore(sp);
                            if (e !== e + 0)
                                throw e;
                            _setThrew(1, 0)
                        }
                    }
                    function invoke_vii(index, a1, a2) {
                        var sp = stackSave();
                        try {
                            dynCall_vii(index, a1, a2)
                        } catch (e) {
                            stackRestore(sp);
                            if (e !== e + 0)
                                throw e;
                            _setThrew(1, 0)
                        }
                    }
                    function invoke_iiii(index, a1, a2, a3) {
                        var sp = stackSave();
                        try {
                            return dynCall_iiii(index, a1, a2, a3)
                        } catch (e) {
                            stackRestore(sp);
                            if (e !== e + 0)
                                throw e;
                            _setThrew(1, 0)
                        }
                    }
                    function invoke_v(index) {
                        var sp = stackSave();
                        try {
                            dynCall_v(index)
                        } catch (e) {
                            stackRestore(sp);
                            if (e !== e + 0)
                                throw e;
                            _setThrew(1, 0)
                        }
                    }
                    function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
                        var sp = stackSave();
                        try {
                            return dynCall_iiiiii(index, a1, a2, a3, a4, a5)
                        } catch (e) {
                            stackRestore(sp);
                            if (e !== e + 0)
                                throw e;
                            _setThrew(1, 0)
                        }
                    }
                    function invoke_vi(index, a1) {
                        var sp = stackSave();
                        try {
                            dynCall_vi(index, a1)
                        } catch (e) {
                            stackRestore(sp);
                            if (e !== e + 0)
                                throw e;
                            _setThrew(1, 0)
                        }
                    }
                    function invoke_viii(index, a1, a2, a3) {
                        var sp = stackSave();
                        try {
                            dynCall_viii(index, a1, a2, a3)
                        } catch (e) {
                            stackRestore(sp);
                            if (e !== e + 0)
                                throw e;
                            _setThrew(1, 0)
                        }
                    }
                    function invoke_iiiii(index, a1, a2, a3, a4) {
                        var sp = stackSave();
                        try {
                            return dynCall_iiiii(index, a1, a2, a3, a4)
                        } catch (e) {
                            stackRestore(sp);
                            if (e !== e + 0)
                                throw e;
                            _setThrew(1, 0)
                        }
                    }
                    function invoke_iii(index, a1, a2) {
                        var sp = stackSave();
                        try {
                            return dynCall_iii(index, a1, a2)
                        } catch (e) {
                            stackRestore(sp);
                            if (e !== e + 0)
                                throw e;
                            _setThrew(1, 0)
                        }
                    }
                    function invoke_viiii(index, a1, a2, a3, a4) {
                        var sp = stackSave();
                        try {
                            dynCall_viiii(index, a1, a2, a3, a4)
                        } catch (e) {
                            stackRestore(sp);
                            if (e !== e + 0)
                                throw e;
                            _setThrew(1, 0)
                        }
                    }
                    function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
                        var sp = stackSave();
                        try {
                            return dynCall_iiiiiii(index, a1, a2, a3, a4, a5, a6)
                        } catch (e) {
                            stackRestore(sp);
                            if (e !== e + 0)
                                throw e;
                            _setThrew(1, 0)
                        }
                    }
                    function callMain(args=[]) {
                        var entryFunction = _main;
                        args.unshift(thisProgram);
                        var argc = args.length;
                        var argv = stackAlloc((argc + 1) * 4);
                        var argv_ptr = argv;
                        args.forEach(arg=>{
                            HEAPU32[argv_ptr >> 2] = stringToUTF8OnStack(arg);
                            argv_ptr += 4
                        }
                        );
                        HEAPU32[argv_ptr >> 2] = 0;
                        try {
                            var ret = entryFunction(argc, argv);
                            exitJS(ret, true);
                            return ret
                        } catch (e) {
                            return handleException(e)
                        }
                    }
                    function run(args=arguments_) {
                        if (runDependencies > 0) {
                            dependenciesFulfilled = run;
                            return
                        }
                        preRun();
                        if (runDependencies > 0) {
                            dependenciesFulfilled = run;
                            return
                        }
                        function doRun() {
                            Module["calledRun"] = true;
                            if (ABORT)
                                return;
                            initRuntime();
                            preMain();
                            readyPromiseResolve(Module);
                            Module["onRuntimeInitialized"]?.();
                            var noInitialRun = Module["noInitialRun"] || false;
                            if (!noInitialRun)
                                callMain(args);
                            postRun()
                        }
                        if (Module["setStatus"]) {
                            Module["setStatus"]("Running...");
                            setTimeout(()=>{
                                setTimeout(()=>Module["setStatus"](""), 1);
                                doRun()
                            }
                            , 1)
                        } else {
                            doRun()
                        }
                    }
                    function preInit() {
                        if (Module["preInit"]) {
                            if (typeof Module["preInit"] == "function")
                                Module["preInit"] = [Module["preInit"]];
                            while (Module["preInit"].length > 0) {
                                Module["preInit"].shift()()
                            }
                        }
                    }
                    preInit();
                    run();
                    moduleRtn = readyPromise;

                    return moduleRtn;
                }
                );
            }
            )();
            if (typeof exports === 'object' && typeof module === 'object') {
                module.exports = EJS_Runtime;
                // This default export looks redundant, but it allows TS to import this
                // commonjs style module.
                module.exports.default = EJS_Runtime;
            } else if (typeof define === 'function' && define['amd'])
                define([], ()=>EJS_Runtime);

            //# sourceURL=blob:https://examples.testfreelog.com/9a3687bc-6cf2-4f64-a4bb-438da62ea906
        }
        ).call(proxyWindow, window, self, globalThis, document, Document, Array, Object, String, Boolean, Math, Number, Symbol, Date, Function, Proxy, WeakMap, WeakSet, Set, Map, Reflect, Element, Node, RegExp, Error, TypeError, JSON, isNaN, parseFloat, parseInt, performance, console, decodeURI, encodeURI, decodeURIComponent, encodeURIComponent, navigator, undefined, location, history)
    }
}
)(window.__MICRO_APP_PROXY_WINDOW__);
