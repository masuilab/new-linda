import * as React from 'react';
import * as ReactDOM from 'react-dom';
const Home = (props) => (React.createElement("div", null,
    React.createElement("h1", null, "Welcome to Linda"),
    React.createElement("a", { href: "https://github.com/saji-ryu/Linda/tree/master/modules/Linda-server" }, "github")));
ReactDOM.render(React.createElement(Home, null), document.getElementById('content'));
