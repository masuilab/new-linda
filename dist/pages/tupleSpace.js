"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_dom_1 = __importDefault(require("react-dom"));
var linda_client_1 = __importDefault(require("../linda-client"));
var tupleSpaceName = location.pathname.substring(1);
var watchingTuple = {};
var url = process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:7777'
    : 'http://new-linda.herokuapp.com';
location.search
    .substring(1)
    .split('&')
    .forEach(function (value) {
    var element = value.split('=');
    watchingTuple[element[0]] = element[1];
});
var lindaClient = new linda_client_1.default(url, tupleSpaceName);
var TupleSpace = function () {
    var _a = react_1.useState([]), tuples = _a[0], setTuples = _a[1];
    react_1.useEffect(function () {
        lindaClient.watch(watchingTuple, function (resData) {
            setTuples(function (tuples) { return [resData._payload].concat(tuples); });
        });
    }, []);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h1", null, tupleSpaceName + "/" + JSON.stringify(watchingTuple)),
        react_1.default.createElement("h2", null, 'write'),
        react_1.default.createElement("div", null,
            react_1.default.createElement("button", { onClick: function () { return lindaClient.write(watchingTuple); } }, JSON.stringify(watchingTuple))),
        react_1.default.createElement("div", null, "%curl -d 'tuple=" + JSON.stringify(watchingTuple) + "' " + location.host),
        react_1.default.createElement("h2", null, 'watch'),
        react_1.default.createElement("div", null, tuples.map(function (tuple, index) {
            return react_1.default.createElement("ul", { key: index }, JSON.stringify(tuple));
        }))));
};
react_dom_1.default.render(react_1.default.createElement(TupleSpace, null), document.getElementById('content'));
