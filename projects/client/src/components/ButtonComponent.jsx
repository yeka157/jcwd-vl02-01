import React from "react";

export default function ButtonComponent(props) {
  return (
    <button
      className={`py-${props.py} px-${props.px} hover:brightness-${props.brightness} ${props.class}`}
      onClick={props.onclick}
      disabled={props.disabled}
    >
      {props.text}
    </button>
  );
}
