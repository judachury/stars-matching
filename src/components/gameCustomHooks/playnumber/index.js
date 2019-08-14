import React from "react";


const PlayNumber = (props) => {
    return (
        <button 
            key={props.number} className="number" 
            onClick={() => props.onClick(props.number, props.status)}
            style={{backgroundColor: props.colors[props.status]}}>
                {props.number}
        </button>
    );
};

export default PlayNumber;