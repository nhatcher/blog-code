/**
 * Compile with
 * clang --target=wasm32 -Oz -nostdlib -Wl,--no-entry -Wl,--export-dynamic -o main.wasm main.c 
 */

__attribute__((visibility("default")))
double multiply_add(double a, double b) {
  return a*b + a;
}
