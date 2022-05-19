#define WASM_EXPORT __attribute__((visibility("default")))
// https://clang.llvm.org/docs/AttributeReference.html#import-module
#define WASM_IMPORT(namespace, name) __attribute__((import_module(namespace), import_name(name))) 

WASM_IMPORT("math", "sin")
double sin(double);


WASM_EXPORT
double vector_norm(const double *a, int n) {
    double norm = 0;
    for (int i=0; i<n; i++) {
        norm += a[i];
    }
    return sin(norm);
};