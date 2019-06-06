import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import LindaClient from '../linda-client';
import { Tuple } from '../interfaces';

type Props = {};

const TupleSpace = (props: Props) => {
  const tupleSpaceName = location.pathname.substring(1);
  const watchingTuple: Tuple = {};
  location.search
    .substring(1)
    .split('&')
    .forEach((value: string) => {
      const element = value.split('=');
      watchingTuple[element[0]] = element[1];
    });
  const lindaClient = new LindaClient();
  const [tuples, setTuples] = useState<(Tuple | null)[]>([]);
  const tsName = location.pathname.substring(1);
  lindaClient.connect('http://new-linda.herokuapp.com', tsName);
  useEffect(() => {
    lindaClient.watch(watchingTuple, resData => {
      const newTuples = [resData._payload, ...tuples];
      tuples.push(resData._payload);
      setTuples(newTuples);
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
