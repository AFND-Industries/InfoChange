/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * URL base de la API. Por defecto `/api`, es decir, el mismo origen: asi
   * funciona tanto en Vercel como en desarrollo con el proxy de Vite, sin
   * configurar nada. Solo hace falta definirla si el frontend se aloja aparte.
   */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
