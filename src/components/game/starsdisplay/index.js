import React from "react";
import Utils from "../utils.js";

const StarDisplay = props => (
    <>
        {Utils.range(1, props.count).map(starId =>
            <div key={starId} className="star" />
        )}
    </>
);

export default StarDisplay;