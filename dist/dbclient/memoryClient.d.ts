import { LindaOperation, TupleInfo, LindaResponse } from '../interfaces';
export default class storageClient {
    tupleSpace: Array<TupleInfo>;
    tupleSpaceName: string;
    constructor(tupleSpaceName: string);
    insert(operation: LindaOperation): Promise<LindaResponse>;
    get(operation: LindaOperation): Promise<LindaResponse>;
    delete(id: number): Promise<void>;
}
