import { LindaCallback, LindaOperation } from './interfaces';
import { EventEmitter2 } from 'eventemitter2';
import storageClient from './dbclient/memoryClient';
export default class tupleSpace {
    emitter: EventEmitter2;
    storage: storageClient;
    tupleSpaceName: string;
    constructor(tupleSpaceName: string);
    readonly db: import("./interfaces").TupleInfo[];
    write(operation: LindaOperation, callback: LindaCallback): Promise<void>;
    read(operation: LindaOperation, callback: LindaCallback): Promise<void>;
    take(operation: LindaOperation, callback: LindaCallback): Promise<void>;
    watch(operation: LindaOperation, callback: LindaCallback): void;
}
