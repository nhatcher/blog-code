# This assumes that the environmental variable CLANG has bin set to the clang binary
CC= $(CLANG)

# compiler flags
CFLAGS= --target=wasm32 -Oz -flto -nostdlib -fno-builtin-sin

STACK_SIZE=$$(( 8 * 1024 * 1024 ))

# linker flags
LFLAGS= -Wl,--no-entry -Wl,--lto-O3 -Wl,--export-dynamic -Wl,--import-memory -Wl,-z,stack-size=$(STACK_SIZE)

# no builins. See https://github.com/robrohan/wefx/blob/main/Makefile
NO_BUILT_INS=-fno-builtin-sin -fno-builtin-cos \
	-fno-builtin-ceil -fno-builtin-floor \
	-fno-builtin-pow -fno-builtin-round  \
	-fno-builtin-abs -fno-builtin-malloc \
	-fno-builtin-rand -fno-builtin-srand

all:
	$(CC) $(CFLAGS) $(LFLAGS) $(NO_BUILT_INS) -o main.wasm main.c walloc.c

clean:
	rm -f main.wasm
