#include <wasm_simd128.h>

#include "walloc.h"

#define WASM_EXPORT __attribute__((visibility("default")))
#define LANES_32 4

WASM_EXPORT
void multiply_simd(const float* matrix1,
                   const float* matrix2,
                   float* result,
                   int size) {

  int size_bound = (size / LANES_32) * LANES_32;

  for (int i = 0; i < size; i += 1) {
    for (int j = 0; j < size; j += 1) {
      v128_t value_4 = wasm_f32x4_splat(0.0);
      for (int k = 0; k < size_bound; k += 4) {

        // load four elements of row i in matrix1
        // Since they are contiguous in memory we can do that in one token.
        v128_t row_4 = wasm_v128_load(&(matrix1[i * size + k * LANES_32]));

        // load four elements of column j in matrix2
        v128_t column_4 = wasm_f32x4_make(matrix2[k * size + j],
                                          matrix2[(k + 1) * size + j],
                                          matrix2[(k + 2) * size + j],
                                          matrix2[(k + 3) * size + j]);

        // multiply the batch and add
        value_4 = wasm_f32x4_add(value_4, wasm_f32x4_mul(row_4, column_4));
      }
      // We add the four numbers
      float value = wasm_f32x4_extract_lane(value_4, 0);
      value += wasm_f32x4_extract_lane(value_4, 1);
      value += wasm_f32x4_extract_lane(value_4, 2);
      value += wasm_f32x4_extract_lane(value_4, 3);

      // And do the remaining bit
      for (int k = size_bound; k < size; k++) {
        value += matrix1[i * size + k] * matrix2[k * size + j];
      }
      result[i * size + j] = value;
    }
  }
}

WASM_EXPORT
void multiply_stock(const float* matrix1,
                    const float* matrix2,
                    float* result,
                    int size) {

  for (int i = 0; i < size; i += 1) {
    for (int j = 0; j < size; j += 1) {
      float value = 0;
      for (int k = 0; k < size; k++) {
        value += matrix1[i * size + k] * matrix2[k * size + j];
      }
      result[i * size + j] = value;
    }
  }
}

WASM_EXPORT
void multiply_cache(const float* matrix1,
                    const float* matrix2,
                    float* result,
                    int size) {
  for (int i = 0; i < size * size; i += 1) {
    result[i] = 0;
  }

  for (int i = 0; i < size; i += 1) {
    for (int k = 0; k < size; k++) {
      for (int j = 0; j < size; j += 1) {
        result[i * size + j] += matrix1[i * size + k] * matrix2[k * size + j];
      }
    }
  }
}

WASM_EXPORT
void multiply_simd_cache(const float* matrix1,
                         const float* matrix2,
                         float* result,
                         int size) {

  int size_bound = (size / LANES_32) * LANES_32;

  for (int i = 0; i < size * size; i += 1) {
    result[i] = 0;
  }

  for (int i = 0; i < size; i += 1) {
    for (int k = 0; k < size; k += 1) {
      // load an element (i, k) four times in matrix1
      v128_t a_4 = wasm_f32x4_splat(matrix1[i * size + k]);
      for (int j = 0; j < size_bound; j += 4) {
        // load four elements of row k in matrix2
        v128_t row_4 = wasm_v128_load(&(matrix2[k * size + j]));
        
        // multiply the batch and add to whatever was in j of result
        v128_t product_4 = wasm_f32x4_mul(a_4, row_4);
        v128_t value_4 = wasm_v128_load(&(result[i * size + j]));

        // wasm_v128_store(&result[i * size + j],  wasm_f32x4_add(value_4, product_4));
        *((v128_t *)&result[i * size + j]) = wasm_f32x4_add(value_4, product_4);
      }
      // Remaining bit
      for (int j = size_bound; j < size; j += 1) {
        result[i * size + j] += matrix1[i * size + k] * matrix2[k * size + j];
      }
    }
  }
}