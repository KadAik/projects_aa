import {useState} from "react";

export default function Button({code, buttonState}){

    function handleClick(){
         buttonState({... code, open: !code.open});
    }
    
    return(
        <button onClick={handleClick}>
            {code.open ? code.on : code.off}
        </button>
    );
}