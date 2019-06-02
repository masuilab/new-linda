import memoryDB from '../db/memoryDB';
import isMatch from '../util/isMatch';
export default class storageClient {
    constructor(tupleSpaceName) {
        this.tupleSpaceName = tupleSpaceName;
        if (memoryDB[tupleSpaceName]) {
            this.tupleSpace = memoryDB[tupleSpaceName];
            console.log(tupleSpaceName + ' is already exist');
        }
        else {
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
    async insert(operation) {
        const time = Date.now();
        const insertData = {
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
    async get(operation) {
        for (const t of this.tupleSpace) {
            let result = isMatch(t._payload, operation._payload);
            // TODO: テスト あとで消す
            // console.log(JSON.stringify(diff(t._payload, operation._payload)));
            //  console.log(JSON.stringify(diff));
            // const diff = observableDiff(t._payload, operation._payload);
            // console.log(JSON.stringify(diff));
            // const notMatchedDiff = diff.filter(ele => {
            //   if (ele.kind === 'N' || ele.kind === 'A') {
            //     return true;
            //   } else if (ele.kind === 'E' && Object.keys(ele.rhs).length !== 0) {
            //     return true;
            //   }
            //   return false;
            // });
            // console.log(JSON.stringify(notMatchedDiff));
            console.log(result);
            if (result.isMatched) {
                // if (notMatchedDiff.length === 0) {
                let resData = Object.assign(t, {
                    _isMatched: true,
                });
                return resData;
            }
        }
        return {
            _isMatched: false,
            _id: null,
            _payload: null,
            _time: null,
            _where: this.tupleSpaceName,
        };
    }
    async delete(id) {
        this.tupleSpace.splice(id, 1);
    }
}
