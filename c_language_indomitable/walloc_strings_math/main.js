
const memory = new WebAssembly.Memory({ initial: 10 });
const env = { memory: memory };
const { instance } = await WebAssembly.instantiateStreaming(fetch("./main.wasm"), { env });
const {malloc, free, string_length, string_reverse, say_hello} = instance.exports;


// This is a wrapper over the raw wasm function `add_vectors` that takes care of the memory issues
export function stringLength(str) {
    const encoder = new TextEncoder();
    const v = encoder.encode(str);
    const n = v.length;
    const pointer = malloc(n);
    
    const c = new Uint8Array(memory.buffer, pointer, n);
    c.set(v);

    const l = string_length(pointer, n);
    free(pointer);
    return l;
}

export function sayHello(name) {
    const encoder = new TextEncoder();
    const v = encoder.encode(name);
    const n = v.length;
    const pointerName = malloc(n);
    const c = new Uint8Array(memory.buffer, pointerName, n);
    c.set(v);
    const pResult = malloc(1 * 4);
    const pSize = malloc(1 * 4);
    const cResult = new Int32Array(memory.buffer, pResult, 1);
    const cSize = new Int32Array(memory.buffer, pSize, 1);

    say_hello(pointerName, n, pResult, pSize);
    
    const result = new Uint8Array(memory.buffer, cResult[0], cSize[0]);

    const decoder = new TextDecoder();
    const say =  decoder.decode(result);

    free(cResult[0]);
    free(pResult);
    free(pSize);

    return say;
}

export function stringReverse(str) {
    const encoder = new TextEncoder();
    const v = encoder.encode(str);
    const n = v.length;
    const pointer = malloc(n);
    const pointerReverse = malloc(n);

    const c = new Uint8Array(memory.buffer, pointer, n);
    c.set(v);
    const cReverse = new Uint8Array(memory.buffer, pointerReverse, n);

    string_reverse(pointer, pointerReverse, n);

    const result = new Uint8Array(n);
    result.set(cReverse);
    free(pointer);
    free(pointerReverse);

    const decoder = new TextDecoder();
    return decoder.decode(result);
}