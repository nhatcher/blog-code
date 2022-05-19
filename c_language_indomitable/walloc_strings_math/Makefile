# This assumes that the environmental variable CLANG has bin set to the clang binary
CC= $(CLANG)
# compiler flags
CFLAGS= --target=wasm32 -Oz -nostdlib
# linker flags
LFLAGS= -Wl,--no-entry -Wl,--export-dynamic -Wl,--import-memory

all:
	$(CC) $(CFLAGS) $(LFLAGS) -o main.wasm main.c walloc.c

clean:
	rm -f main.wasm
