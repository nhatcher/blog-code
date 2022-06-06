// Get the wasm and instantiate it.
const memory = new WebAssembly.Memory({ initial: 10 });
const env = { memory: memory };
const { instance } = await WebAssembly.instantiateStreaming(
  fetch("./main.wasm"),
  { env }
);

const {
  malloc,
  free,
  multiply_simd,
  multiply_stock,
  multiply_cache,
  multiply_simd_cache,
} = instance.exports;

const FLOAT_SIZE = 4;

export function multiplySimd(matrix1, matrix2, size) {
  const l = size * size;
  console.assert(matrix1.length === l);
  const pA = malloc(l * FLOAT_SIZE);
  const cA = new Float32Array(memory.buffer, pA, l);
  cA.set(matrix1);
  const pB = malloc(l * FLOAT_SIZE);
  const cB = new Float32Array(memory.buffer, pB, l);
  cB.set(matrix2);
  const pC = malloc(l * FLOAT_SIZE);
  const cC = new Float32Array(memory.buffer, pC, l);
  multiply_simd(pA, pB, pC, size);
  const result = new Float32Array(l);
  result.set(cC);
  free(pA);
  free(pB);
  free(pC);
  return result;
}

export function multiplyStock(matrix1, matrix2, size) {
  const l = size * size;
  console.assert(matrix1.length === l);
  const pA = malloc(l * FLOAT_SIZE);
  const cA = new Float32Array(memory.buffer, pA, l);
  cA.set(matrix1);
  const pB = malloc(l * FLOAT_SIZE);
  const cB = new Float32Array(memory.buffer, pB, l);
  cB.set(matrix2);
  const pC = malloc(l * FLOAT_SIZE);
  const cC = new Float32Array(memory.buffer, pC, l);
  multiply_stock(pA, pB, pC, size);
  const result = new Float32Array(l);
  result.set(cC);
  free(pA);
  free(pB);
  free(pC);
  return result;
}

export function multiplyCache(matrix1, matrix2, size) {
  const l = size * size;
  console.assert(matrix1.length === l);
  const pA = malloc(l * FLOAT_SIZE);
  const cA = new Float32Array(memory.buffer, pA, l);
  cA.set(matrix1);
  const pB = malloc(l * FLOAT_SIZE);
  const cB = new Float32Array(memory.buffer, pB, l);
  cB.set(matrix2);
  const pC = malloc(l * FLOAT_SIZE);
  const cC = new Float32Array(memory.buffer, pC, l);
  multiply_cache(pA, pB, pC, size);
  const result = new Float32Array(l);
  result.set(cC);
  free(pA);
  free(pB);
  free(pC);
  return result;
}

export function multiplySimdCache(matrix1, matrix2, size) {
  const l = size * size;
  console.assert(matrix1.length === l);
  const pA = malloc(l * FLOAT_SIZE);
  const cA = new Float32Array(memory.buffer, pA, l);
  cA.set(matrix1);
  const pB = malloc(l * FLOAT_SIZE);
  const cB = new Float32Array(memory.buffer, pB, l);
  cB.set(matrix2);
  const pC = malloc(l * FLOAT_SIZE);
  const cC = new Float32Array(memory.buffer, pC, l);
  multiply_simd_cache(pA, pB, pC, size);
  const result = new Float32Array(l);
  result.set(cC);
  free(pA);
  free(pB);
  free(pC);
  return result;
}

export function multiplyJs(matrix1, matrix2, size) {
  const l = size * size;
  console.assert(matrix1.length === l);
  const result = new Float32Array(l);
  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      let value = 0;
      for (let k = 0; k < size; k++) {
        value += matrix1[i * size + k] * matrix2[k * size + j];
      }
      result[i * size + j] = value;
    }
  }
  return result;
}
