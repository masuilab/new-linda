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
            const result = isMatch(t._payload, operation._payload);
            if (result.isMatched) {
                const resData = Object.assign(t, {
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
