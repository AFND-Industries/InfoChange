interface ImportMetaEnv {
    readonly VITE_SERVER_URL:  string;
    // Otras variables de entorno que uses pueden ser declaradas aquí...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}