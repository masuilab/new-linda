"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var ReactDOM = __importStar(require("react-dom"));
var Home = function (props) { return (React.createElement("div", null,
    React.createElement("h1", null, "Welcome to Linda"),
    React.createElement("a", { href: "https://github.com/saji-ryu/Linda/tree/master/modules/Linda-server" }, "github"))); };
ReactDOM.render(React.createElement(Home, null), document.getElementById('content'));
