import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import LindaClient from '../linda-client';
const TupleSpace = (props) => {
    const tupleSpaceName = location.pathname.substring(1);
    const watchingTuple = {};
    location.search
        .substring(1)
        .split('&')
        .forEach((value) => {
        const element = value.split('=');
        watchingTuple[element[0]] = element[1];
    });
    const lindaClient = new LindaClient();
    const [tuples, setTuples] = useState([]);
    lindaClient.connect('http://new-linda.herokuapp.com', 'masuilab');
    useEffect(() => {
        lindaClient.watch(watchingTuple, resData => {
            const newTuples = [resData._payload, ...tuples];
            tuples.push(resData._payload);
            setTuples(newTuples);
        });
    }, []);
    return (React.createElement("div", null,
        React.createElement("h1", null, `${tupleSpaceName}/${JSON.stringify(watchingTuple)}`),
        React.createElement("h2", null, 'write'),
        React.createElement("div", null,
            React.createElement("button", { onClick: () => lindaClient.write(watchingTuple) }, JSON.stringify(watchingTuple))),
        React.createElement("div", null, `%curl -d 'tuple=${JSON.stringify(watchingTuple)}' ${location.host}`),
        React.createElement("h2", null, 'watch'),
        React.createElement("div", null, tuples.map((tuple, index) => {
            return React.createElement("ul", { key: index }, JSON.stringify(tuple));
        }))));
};
ReactDOM.render(React.createElement(TupleSpace, null), document.getElementById('content'));
