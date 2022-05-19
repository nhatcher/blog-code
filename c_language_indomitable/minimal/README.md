# Minimal Wasm module written in C

You will need clang version 13 or higher.

If you have `make` installed to compile just write

```
make
```

Otherwise:

```
clang --target=wasm32 -Oz -nostdlib -Wl,--no-entry -Wl,--export-dynamic -o main.wasm main.c
```

You can serve it with almost any webserver you like. For instance:

```
python -m http.server
```

Then head to (http://localhost:8000)