import React from "react";

const SummaryCard = ({ title, value }) => (
    <div className="col-lg-3 col-md-6 mb-4">
        <div className="card shadow-sm h-100" role="region" aria-labelledby={`summary-${title.replace(/\s+/g, '-').toLowerCase()}`} tabIndex="0">
            <div className="card-body text-center d-flex flex-column">
                <span id={`summary-${title.replace(/\s+/g, '-').toLowerCase()}`} className="card-title h5">{title}</span>
                <span className="card-text display-6 fit-text">{value}</span>
            </div>
        </div>
    </div>
);

export default SummaryCard;
