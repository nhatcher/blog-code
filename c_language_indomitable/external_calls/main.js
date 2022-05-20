const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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
            ctx.arc(x, y, r, 0, 2 * Math.PI);
        },
        line: (x0, y0, x1, y1) => {
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
        },
        begin_draw: () => {
            ctx.beginPath();
        },
        end_draw: () => {
            ctx.stroke();
        },
    },
    debug: {
        print: (pointer, len) => {
            const result = new Uint8Array(memory.buffer, pointer, len);
            const decoder = new TextDecoder();
            console.log(decoder.decode(result));
        },
        double_to_string: (value) => {
            // Add the null C-string termination and convert value to utf-8 byte array
            const txt = `${value}\0`;
            const encoder = new TextEncoder();
            const val_utf8 = encoder.encode(txt);
            const len = val_utf8.length;
            
            // We allocate the string somewhere in memory
            const pResult = malloc(len);
            const result = new Uint8Array(memory.buffer, pResult, len);
            result.set(val_utf8);

            return pResult;
        }
    }
};

const { instance } = await WebAssembly.instantiateStreaming(fetch("./main.wasm"), importObject);
const {malloc, set_seed, draw_crazy} = instance.exports;

export function drawCrazy(x, y, r, n, delta) {
    set_seed( Math.floor(Math.random()* (2**32)));
    ctx.clearRect(0, 0, 600, 480);
    return draw_crazy(x, y, r, n, delta);
}
