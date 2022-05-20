# This assumes that the environmental variable CLANG has bin set to the clang binary
CC= $(CLANG)

# compiler flags
CFLAGS= --target=wasm32 -Oz -flto -nostdlib

STACK_SIZE=$$(( 8 * 1024 * 1024 ))

# linker flags
LFLAGS= -Wl,--no-entry -Wl,--lto-O3 -Wl,--export-dynamic -Wl,--import-memory

# no builins. See https://github.com/robrohan/wefx/blob/main/Makefile
NO_BUILT_INS=-fno-builtin-sin -fno-builtin-cos

all:
	$(CC) $(CFLAGS) $(LFLAGS) $(NO_BUILT_INS) -o main.wasm main.c walloc.c random.c

clean:
	rm -f main.wasm
