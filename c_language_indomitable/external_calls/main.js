const memory = new WebAssembly.Memory({ initial: 10 });
const importObject = {
    env: {
        memory: memory,
    },
    math: {
        sin: (x) => Math.sin(x),
        cos: (x) => Math.cos(x)
    },
    canvas: {
        circle: (x, y, r) => {

        },
        line: (x0, y0, x1, y1) => {

        }
    },
    debug: {
        print: (pointer, len) => {
            const result = new Uint8Array(memory.buffer, pointer, len);
            const decoder = new TextDecoder();
            const txt =  decoder.decode(result);
            console.log(txt);
        },
        // double_to_string: (value, ppResult, pLen) => {
        //     // convert value to utf-8 byte array
        //     const txt = `${value}`;
        //     const encoder = new TextEncoder();
        //     const val_utf8 = encoder.encode(txt);
        //     const len = val_utf8.length;
            
        //     // We allocate the string somewhere in memory
        //     const pResult = malloc(len);
        //     const result = new Uint8Array(memory.buffer, pResult, len);
        //     result.set(val_utf8);

        //     // ppResult points to a number that points to result
        //     const c = new Uint8Array(memory.buffer, ppResult, 1);
        //     c.set(pResult);

        //     // pLen points to the length
        //     const d = new Uint8Array(memory.buffer, pLen, 1);
        //     d.set(len);
        // }
        double_to_string: (value, pLen) => {
            // convert value to utf-8 byte array
            const txt = `${value}\0`;
            const encoder = new TextEncoder();
            const val_utf8 = encoder.encode(txt);
            const len = val_utf8.length;
            
            // We allocate the string somewhere in memory
            const pResult = malloc(len);
            const result = new Uint8Array(memory.buffer, pResult, len);
            result.set(val_utf8);

            // pLen points to the length
            const d = new Uint8Array(memory.buffer, pLen, 1);
            d.set(len);
            return pResult;
        }
    }
};

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
