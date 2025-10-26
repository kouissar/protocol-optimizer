import React from "react";


function Message() {
    const name = '';
    if (name)
        return <h1>Hello from {name}</h1>;
    return <h1>Hello World</h1>;

}

export default Message;