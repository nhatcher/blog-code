const memory = new WebAssembly.Memory({ initial: 10 });
const importObject = {
    env: {
        memory: memory,
    },
    math: {
        sin: Math.sin,
        cos: Math.cos
    }
  };
// const env = { memory: memory, sqrt: (x) => Math.sqrt(x) };
const { instance } = await WebAssembly.instantiateStreaming(fetch("./main.wasm"), importObject);
const {malloc, free, vector_norm} = instance.exports;


export function vectorNorm(v1, n) {
    // allocate the memory
    
    // A C double is 64 bits or 8 bytes
    const sizeOFDouble = 8;
    // We need to allocate memory for `n` doubles by vector
    const vectorSize = n * sizeOFDouble;

    const pointer1 = malloc(vectorSize);

    // Set the vectors in the memory
    const c1 = new Float64Array(memory.buffer, pointer1, n);
    c1.set(v1);

    // do the wasm call
    const result = vector_norm(pointer1, n);

    free(vectorSize);

    // and we are done
    return result;
}
