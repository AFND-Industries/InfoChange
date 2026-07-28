/**
 * Variables minimas para que `env()` valide. No se conecta a esta URL: los
 * tests corren contra PGlite, un Postgres real compilado a WebAssembly que vive
 * en el propio proceso.
 */
process.env.NODE_ENV = "test";
process.env.DATABASE_URL ??= "postgres://test:test@localhost:5432/test";
process.env.SESSION_SECRET ??= "clave-de-pruebas-suficientemente-larga-000000";
