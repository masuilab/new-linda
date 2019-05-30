import {
  IsMuchResponse,
  Tuple,
  LindaOperation,
  TupleInfo,
  LindaResponse,
} from '../interfaces';
import memoryDB from '../db/memoryDB';

export default class storageClient {
  tupleSpace: Array<TupleInfo>;
  tupleSpaceName: string;
  constructor(tupleSpaceName: string) {
    this.tupleSpaceName = tupleSpaceName;
    if (memoryDB[tupleSpaceName]) {
      this.tupleSpace = memoryDB[tupleSpaceName];
      console.log(tupleSpaceName + ' is already exist');
    } else {
      this.tupleSpace = memoryDB[tupleSpaceName] = [
        {
          _id: 0,
          _time: Date.now(),
          _payload: { type: 'init' },
          _from: tupleSpaceName,
          _where: tupleSpaceName,
        },
      ];
      console.log(tupleSpaceName + ' is created');
    }
  }

  async insert(operation: LindaOperation): Promise<LindaResponse> {
    const time = Date.now();
    const insertData: LindaResponse= {
      _time: time,
      _where: this.tupleSpaceName,
      _payload: operation._payload,
      _id: this.tupleSpace.length,
    };
    if (operation._from) {
      insertData._from = operation._from;
    }
    this.tupleSpace.unshift(insertData);
    return insertData;
  }

  async get(operation: LindaOperation): Promise<LindaResponse> {
    for (const t of this.tupleSpace) {
      let result = this.isMuch(t._payload, operation._payload);
      if (result.isMuched) {
        let resData: LindaResponse = Object.assign(t, {
          _isMuched: true,
        });
        return resData;
      }
    }
    return {
      _isMuched: false,
      _id: null,
      _payload: null,
      _time: null,
      _where: this.tupleSpaceName,
    };
  }

  async delete(id: number): Promise<void> {
    this.tupleSpace.splice(id, 1);
  }

  isMuch(targetTuple: Tuple, searchTuple: Tuple): IsMuchResponse {
    for (let operationKey in searchTuple) {
      if (!targetTuple[operationKey]) {
        return { isMuched: false, res: null };
      } else if (targetTuple[operationKey] != searchTuple[operationKey]) {
        return { isMuched: false, res: null };
      }
    }
    return { isMuched: true, res: targetTuple };
  }
}
