import React from "react";
import BizumAdminItem from "./BizumAdminItem";

const BizumList = ({ items }) => (
    <div className="col-md-12 col-lg-7">
        <div className="card shadow-sm h-100" role="region" aria-labelledby="bizum-list" tabIndex="0">
            <div className="card-body">
                <h2 id="bizum-list" className="card-title h5">Últimos bizums</h2>
                <ul className="list-group list-group-flush">
                    {items.map((item, index) => (
                        <BizumAdminItem key={index} item={item} />
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

export default BizumList;
