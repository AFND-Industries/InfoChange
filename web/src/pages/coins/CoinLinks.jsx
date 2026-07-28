/**
 * Enlaces oficiales del activo.
 *
 * Antes el icono y el nombre de cada enlace se elegian por la posicion de la
 * clave dentro del objeto `urls`, de modo que a un activo sin sitio web se le
 * etiquetaba el explorador de bloques como "Sitio Web". Ahora se buscan por
 * clave.
 */
const LINK_TYPES = {
  website: { icon: "bi bi-globe2", label: "Sitio Web" },
  twitter: { icon: "bi bi-twitter-x", label: "Twitter" },
  message_board: { icon: "bi bi-envelope-fill", label: "Mensajes" },
  chat: { icon: "bi bi-chat", label: "Chat" },
  facebook: { icon: "bi bi-facebook", label: "Facebook" },
  explorer: { icon: "bi bi-info-square-fill", label: "Info" },
  reddit: { icon: "bi bi-reddit", label: "Reddit" },
  technical_doc: { icon: "bi bi-file-earmark", label: "Docs" },
  source_code: { icon: "bi bi-github", label: "Github" },
  announcement: { icon: "bi bi-megaphone-fill", label: "Anuncios" },
};

export default function CoinLinks({ urls }) {
  if (!urls) return null;

  return Object.entries(LINK_TYPES).map(([key, { icon, label }]) => {
    const url = urls[key]?.[0];
    if (!url) return null;

    return (
      <div className="col-4 mb-1" key={key}>
        <a
          className="btn btn-light col d-flex align-items-center url-card"
          style={{
            maxWidth: "18rem",
            maxHeight: "5rem",
            backgroundColor: "#f8f9fa",
          }}
          href={url}
          aria-label={`Enlace a ${label}`}
        >
          <div className="col-auto mx-1 d-flex justify-content-center align-items-center">
            <i className={`url-icon ${icon}`} aria-hidden="true" />
          </div>
          <div className="col d-flex align-items-center">
            <p className="fs-6 text-dark m-0 url-name">{label}</p>
          </div>
        </a>
      </div>
    );
  });
}
