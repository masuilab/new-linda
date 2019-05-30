/// <reference types="node" />
import tupleSpace from './tupleSpace';
import { Server } from 'http';
export default class Linda {
    tupleSpaces: {
        [key: string]: tupleSpace;
    };
    constructor();
    tupleSpace(tupleSpaceName: string): tupleSpace;
    listen(server: Server, io: SocketIO.Server): void;
}
