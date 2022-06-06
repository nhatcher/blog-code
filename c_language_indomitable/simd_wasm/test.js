import {
  multiplySimd,
  multiplyStock,
  multiplyCache,
  multiplySimdCache,
  multiplyJs,
} from "./main.js";

function assertEqual(matrix1, matrix2) {
  console.assert(
    matrix1.length === matrix2.length,
    `Failed. Matrices of different size`
  );
  for (let i = 0; i < matrix1.length; i++) {
    console.assert(
      matrix1[i] == matrix2[i],
      `Failed comparison at ${i}: ${matrix1[i]} != ${matrix2[i]}`
    );
  }
}

function test_matrices(matrix1, matrix2, result, d) {
  assertEqual(multiplySimd(matrix1, matrix2, d), result);
  assertEqual(multiplyStock(matrix1, matrix2, d), result);
  assertEqual(multiplyJs(matrix1, matrix2, d), result);
  assertEqual(multiplyCache(matrix1, matrix2, d), result);
  assertEqual(multiplySimdCache(matrix1, matrix2, d), result);
}

function test_1x1() {
  test_matrices([4], [-6], [-24], 1);
}

function test_3x3() {
  const matrix1 = [-1, 2, 5, -4, 2, -2, -7, 3, 1];
  const matrix2 = [1, -2, 6, 3, 3, 3, 5, -3, -1];
  const result = [30, -7, -5, -8, 20, -16, 7, 20, -34];
  test_matrices(matrix1, matrix2, result, 3);
}

function test_4x4() {
  const matrix1 = [3, 9, 1, 0, 3, 7, 5, 5, 6, 9, 8, 7, 5, 4, 4, 6];
  const matrix2 = [3, 7, 3, 0, 2, 3, 9, 2, 3, 9, 3, 1, 2, 1, 0, 4];
  const result = [
    30, 57, 93, 19, 48, 92, 87, 39, 74, 148, 123, 54, 47, 89, 63, 36,
  ];
  test_matrices(matrix1, matrix2, result, 4);
}

export function runTests() {
  test_1x1();
  test_3x3();
  test_4x4();
}
