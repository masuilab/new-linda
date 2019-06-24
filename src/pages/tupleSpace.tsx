import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import LindaClient from '../linda-client';
import { Tuple } from '../interfaces';

const tupleSpaceName = location.pathname.substring(1);
const watchingTuple: Tuple = {};
const url =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:7777'
    : 'http://new-linda.herokuapp.com';
location.search
  .substring(1)
  .split('&')
  .forEach((value: string) => {
    const element = value.split('=');
    watchingTuple[element[0]] = element[1];
  });
const lindaClient = new LindaClient(url, tupleSpaceName);

const TupleSpace = () => {
  const [tuples, setTuples] = useState<(Tuple | null)[]>([]);
  useEffect(() => {
    lindaClient.watch(watchingTuple, resData => {
      setTuples(tuples => [resData._payload, ...tuples]);
    });
  }, []);
  return (
    <div>
      <h1>{`${tupleSpaceName}/${JSON.stringify(watchingTuple)}`}</h1>
      <h2>{'write'}</h2>
      <div>
        <button onClick={() => lindaClient.write(watchingTuple)}>
          {JSON.stringify(watchingTuple)}
        </button>
      </div>
      <div>
        {`%curl -d 'tuple=${JSON.stringify(watchingTuple)}' ${location.host}`}
      </div>
      <h2>{'watch'}</h2>
      <div>
        {tuples.map((tuple, index) => {
          return <ul key={index}>{JSON.stringify(tuple)}</ul>;
        })}
      </div>
    </div>
  );
};

ReactDOM.render(<TupleSpace />, document.getElementById('content'));
