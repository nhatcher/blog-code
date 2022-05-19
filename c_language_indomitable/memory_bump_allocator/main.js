// This is a simple wrapper over the Wasm module.
// Normally tools like emscripten or wasm-pack would create this glue code for you

// This means we are assigning 1 page (64kb)
// That is very little memory (8192 doubles), but more than enough for our use case
// memory.buffer is a byte array
const memory = new WebAssembly.Memory({ initial: 1 });
const env = { memory: memory };
const { instance } = await WebAssembly.instantiateStreaming(fetch("./main.wasm"), { env });
const {allocate_memory, free_memory, add_vectors} = instance.exports;


// This is a wrapper over the raw wasm function `add_vectors` that takes care of the memory issues
export function addVectors(v1, v2, n) {
    // allocate the memory
    
    // A C double is 64 bits or 8 bytes
    const sizeOFDouble = 8;
    // We need to allocate memory for `n` doubles by vector
    const vectorSize = n * sizeOFDouble;

    const pointer1 = allocate_memory(vectorSize);
    const pointer2 = allocate_memory(vectorSize);
    const pointer3 = allocate_memory(vectorSize);

    // Set the vectors in the memory
    const c1 = new Float64Array(memory.buffer, pointer1, n);
    c1.set(v1);

    const c2 = new Float64Array(memory.buffer, pointer2, n);
    c2.set(v2);

    const c3 = new Float64Array(memory.buffer, pointer3, n);

    // do the wasm call
    add_vectors(pointer1, pointer2, pointer3, n);

    // Copy the result
    const result = new Float64Array(c3);

    // Free all used memory
    free_memory(vectorSize);
    free_memory(vectorSize);
    free_memory(vectorSize);

    // and we are done
    return result;
}
