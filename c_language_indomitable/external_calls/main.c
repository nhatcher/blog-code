#define WASM_EXPORT __attribute__((visibility("default")))
// https://clang.llvm.org/docs/AttributeReference.html#import-module
#define WASM_IMPORT(namespace, name) __attribute__((import_module(namespace), import_name(name))) 


#include "walloc.h"

WASM_IMPORT("math", "sin")
double sin(double x);

WASM_IMPORT("math", "sin")
double sin(double x);

WASM_IMPORT("canvas", "circle")
void circle(double x, double y, double r);

WASM_IMPORT("canvas", "line")
void line(double x0, double y0, double x1, double y1);

WASM_IMPORT("debug", "print")
void _print(unsigned char *p, int len);

WASM_IMPORT("debug", "double_to_string")
unsigned char *double_to_string(double t);

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


void print(uint8_t *c) {
    int len = byte_length(c);
    _print(c, len);
}


WASM_EXPORT
double vector_norm(const double *a, int n) {
    double norm = 0;
    for (int i=0; i<n; i++) {
        norm += a[i];
    }
    print((uint8_t *)"Hi ho!");
    print(double_to_string(2.333333e-5));
    return sin(norm);
};