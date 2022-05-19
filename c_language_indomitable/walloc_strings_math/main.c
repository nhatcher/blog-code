#define WASM_EXPORT __attribute__((visibility("default")))

#include "walloc.h"

// this is a byte, same as unsigned char
typedef __UINT8_TYPE__ uint8_t;
typedef __INT32_TYPE__ int32_t;
typedef __SIZE_TYPE__  size_t;


// computes the byte length of a null terminated utf-8 string
size_t byte_length(uint8_t *str) {
    for (int i=0; ; i++) {
        if (str[i] == '\0') {
            return i;
        };
    }
}

// Computes the length of a unicode string of n bytes
WASM_EXPORT
int string_length(const uint8_t *src, size_t n) {
    size_t si = 0;
    uint8_t c;
    int count = 0;
    while (si < n) {
        c = src[si];
        count++;
        if ((~c) & 0b10000000) {
            si++;
        } else {
            switch (c>>4) {
                case 0b1100:
                case 0b1101:
                    si += 2;
                    break;
                case 0b1110:
                    si += 3;
                    break;
                case 0b1111:
                    si += 4;
                    break;
                default:
                    // error
                    return -1;
            }
        }
    }
    return count;
}

WASM_EXPORT
void say_hello(const uint8_t *name, size_t n,  size_t *p_result, int32_t *size) {
    uint8_t *hello = (uint8_t *)"你好";
    size_t l = byte_length(hello);
    uint8_t *result = malloc(n + l);
    for (int i = 0; i < l; i++) {
        result[i] = hello[i];
    }
    for (int i = 0; i < n; i++) {
        result[l + i] = name[i];
    };
    size[0] = n + l;
    p_result[0] = (size_t)&result[0];
}


WASM_EXPORT
int string_reverse(uint8_t *src, uint8_t * dest, size_t len) {
    size_t si = 0, di = len;
    uint8_t c;

    while (si < len) {
        c = src[si];
        // The condition is non zero only if c is 0b0xxxxxxx
        // This is call a mask bit
        if ((~c) & 0b10000000) {
            di--;
            dest[di] = c;
            si++;
        } else {
            // c>>4 mean drop the last 4 bits of the byte
            // It's called bit-shifting
            switch (c>>4) {
                case 0b1100:
                case 0b1101:
                    di -= 2;
                    dest[di] = src[si];
                    dest[di+1] = src[si+1];
                    // We can short-hand this by:
                    // *((int16_t*)&dest[di]) = *((int16_t*)&src[si]);
                    si += 2;
                    break;
                case 0b1110:
                    di -= 3;
                    dest[di] = src[si];

                    dest[di+1] = src[si+1];
                    dest[di+2] = src[si+2];
                    // We can short hand this (only the last two) by:
                    // *((int16_t*)&dest[di+1]) = *((int16_t*)&src[si+1]);
                    si += 3;
                    break;
                case 0b1111:
                    di -= 4;

                    dest[di] = src[si];
                    dest[di+1] = src[si+1];
                    dest[di+2] = src[si+2];
                    dest[di+3] = src[si+3];
                    // We can short hand this by:
                    // *((int32_t*)&dest[di]) = *((int32_t*)&src[si]);
                    si += 4;
                    break;
                default:
                    // error
                    return 1;
            }
        }
    }
    return 0;
}
