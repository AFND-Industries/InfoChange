/**
 * Reduce el volcado original de CoinMarketCap (4,3 MB) a dos artefactos:
 *
 *   server/src/data/tokens.ts          catalogo ligero (nombre, logo, slug) que la
 *                                     API sirve en /api/market/tokens.
 *   web/public/data/token-details.json descripcion, enlaces y etiquetas; solo lo pide
 *                                     la ficha de una moneda, asi que viaja aparte.
 *
 * Es un script de un solo uso: la fuente ya no vive en el repositorio. Se conserva
 * para documentar como se derivaron los ficheros y poder repetirlo si algun dia se
 * vuelve a descargar el volcado de CoinMarketCap.
 *
 * Uso: node scripts/build-token-data.mjs <ruta-al-volcado-cmc.json>
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = process.argv[2];

if (!source) {
  console.error("Uso: node scripts/build-token-data.mjs <volcado-cmc.json>");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(source, "utf8"));
const entries = Object.entries(raw.data ?? {});

const catalog = {};
const details = {};

for (const [symbol, records] of entries) {
  const token = Array.isArray(records) ? records[0] : records;
  if (!token) continue;

  catalog[symbol] = {
    name: token.name,
    logo: token.logo,
    slug: token.slug,
  };

  // Los enlaces llegan como listas y la mayoria vienen vacias.
  const links = {};
  for (const [kind, urls] of Object.entries(token.urls ?? {})) {
    if (Array.isArray(urls) && urls.length > 0) links[kind] = urls;
  }

  details[symbol] = {
    description: token.description ?? "",
    urls: links,
    tags: token["tag-names"] ?? token.tags ?? [],
  };
}

const write = (relativePath, contents, count) => {
  const target = resolve(root, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents);
  const kb = (Buffer.byteLength(contents) / 1024).toFixed(1);
  console.log(`${relativePath}: ${count} tokens, ${kb} kB`);
};

// El catalogo se emite como modulo TypeScript para que se empaquete igual con
// tsx, con esbuild en Vercel y con vitest, sin depender de import attributes.
const module = `/**
 * Catalogo de activos: nombre legible, logo y slug para cada simbolo.
 *
 * Generado por \`scripts/build-token-data.mjs\`. No editar a mano.
 */
export interface TokenInfo {
  name: string;
  logo: string;
  slug: string;
}

export const tokenCatalog: Record<string, TokenInfo> = ${JSON.stringify(catalog, null, 2)};
`;

write("server/src/data/tokens.ts", module, Object.keys(catalog).length);
write(
  "web/public/data/token-details.json",
  JSON.stringify(details),
  Object.keys(details).length,
);
