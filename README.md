# veinteseptiveinti

Carta digital estática lista para [GitHub Pages](https://pages.github.com/).

## URL publicada

Tras activar Pages: `https://bakugod777.github.io/veinteseptiveinti/`

## Desarrollo local

```bash
npx pnpm@9.15.0 install
npx pnpm@9.15.0 dev
```

Abre: `http://localhost:3000/veinteseptiveinti/`

## Subir a GitHub Pages

1. Sube el código a la rama `main`.
2. En GitHub: **Settings → Pages → Source: GitHub Actions**.
3. El workflow `.github/workflows/nextjs.yml` publica en cada push.

## Build estático

```bash
npx pnpm@9.15.0 build
```

La salida queda en la carpeta `out/`.
