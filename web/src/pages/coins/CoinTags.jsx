import { useState } from "react";
import Modal from "react-bootstrap/Modal";

const TAG_STYLE = {
  maxWidth: "18rem",
  maxHeight: "5rem",
  backgroundColor: "#f8f9fa",
  whiteSpace: "nowrap",
};

function Tag({ children, style }) {
  return (
    <span
      className="btn btn-light col d-flex align-items-center justify-content-center url-card"
      style={style}
    >
      {children}
    </span>
  );
}

/** Etiquetas del activo: hasta tres a la vista y el resto en una ventana. */
export default function CoinTags({ name, tags }) {
  const [showAll, setShowAll] = useState(false);

  if (!tags || tags.length === 0) return null;

  if (tags.length <= 3) {
    return tags.map((tag) => (
      <div className="col mb-1" key={tag}>
        <Tag style={TAG_STYLE}>{tag}</Tag>
      </div>
    ));
  }

  return (
    <>
      {tags.slice(0, 3).map((tag) => (
        <div className="col" key={tag}>
          <Tag
            style={{
              maxWidth: "10rem",
              maxHeight: "5rem",
              backgroundColor: "#f8f9fa",
            }}
          >
            {tag}
          </Tag>
        </div>
      ))}

      <div className="col">
        <button
          type="button"
          className="btn col d-flex align-items-center justify-content-center url-card fs-6"
          style={{
            maxWidth: "18rem",
            maxHeight: "5rem",
            color: "blue",
            whiteSpace: "nowrap",
          }}
          onClick={() => setShowAll(true)}
          aria-label="Ver todas las etiquetas"
        >
          <strong>Ver todo</strong>
        </button>
      </div>

      <Modal show={showAll} onHide={() => setShowAll(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{`${name} etiquetas`}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}>
          <div className="row my-2">
            {tags.map((tag) => (
              <div className="col m-1" key={tag}>
                <Tag style={{ backgroundColor: "#f8f9fa", whiteSpace: "nowrap" }}>
                  {tag}
                </Tag>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
