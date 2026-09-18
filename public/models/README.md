# Background Remover models (same-origin)

Populated by `npm run models:fetch` / `prebuild`.

- `birefnet-lite-512/` — BiRefNet_lite 512 fp16 ONNX (MIT)
- Served at `/models/birefnet-lite-512/`
- Large `.onnx` files are gitignored; CI/Vercel downloads them on build
