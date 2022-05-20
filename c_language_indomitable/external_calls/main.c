#define WASM_EXPORT __attribute__((visibility("default")))
// https://clang.llvm.org/docs/AttributeReference.html#import-module
#define WASM_IMPORT(namespace, name) __attribute__((import_module(namespace), import_name(name))) 


#include "walloc.h"
#include "random.h"

WASM_IMPORT("math", "sin")
double sin(double x);

WASM_IMPORT("math", "cos")
double cos(double x);

WASM_IMPORT("canvas", "circle")
void circle(double x, double y, double r);

WASM_IMPORT("canvas", "line")
void line(double x0, double y0, double x1, double y1);

WASM_IMPORT("canvas", "begin_draw")
void begin_draw(void);

WASM_IMPORT("canvas", "end_draw")
void end_draw(void);

WASM_IMPORT("debug", "print")
void _print(unsigned char *p, int len);

WASM_IMPORT("debug", "double_to_string")
unsigned char *double_to_string(double t);


// this is a byte, same as unsigned char
typedef __UINT8_TYPE__ uint8_t;
typedef __INT32_TYPE__ int32_t;
typedef __SIZE_TYPE__  size_t;

#define PI  3.141592653589793

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

double min(double a, double b) {
    return a > b ? b : a;
}

WASM_EXPORT
void set_seed(double s) {
    seed(s);
}

WASM_EXPORT
void draw_crazy(double width, double height, int n, double delta) {
    double radius = min(width, height)*0.8/2;
    double center_x = width/2;
    double center_y = height/2;
    begin_draw();
    circle(center_x, center_y, radius);
    double delta_rad = delta*PI/180;
    for (int i=0; i<n; i++) {
        double phi = 2*PI*i/n;
        double x0 = center_x + radius * sin(phi);
        double y0 = center_y + radius * cos(phi);
        double x1 = center_x + radius * sin(delta_rad + phi);
        double y1 = center_y + radius * cos(delta_rad + phi);
        line(x0, y0, x1, y1);
    }
    end_draw();
}