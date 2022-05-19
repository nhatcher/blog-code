#define WASM_EXPORT __attribute__((visibility("default")))

// Memory management (stupid bump allocator)
// Taken from the excellent: https://surma.dev/things/c-to-webassembly/

extern unsigned char __heap_base;
unsigned int bump_pointer = (int) &__heap_base;

WASM_EXPORT
void *allocate_memory(int n) {
  unsigned int r = bump_pointer;
  bump_pointer += n;
  return (void *)r;
};

WASM_EXPORT
void free_memory(int n) {
  bump_pointer -= n;
};

WASM_EXPORT
void add_vectors(const double *a, const double *b, double *c, int n) {
  for (int i=0; i<n; i++) {
      c[i] = a[i] + b[i];
  }
};
