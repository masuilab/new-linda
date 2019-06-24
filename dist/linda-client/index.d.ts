import { Tuple, Callback, ConnectCallback, LindaResponse } from '../interfaces';
export default class LindaClient {
    socket: SocketIOClient.Socket | null;
    tupleSpaceName: string;
    url: string;
    constructor(url: string, tupleSpaceName: string);
    read(tuple: Tuple): Promise<LindaResponse>;
    write(tuple: Tuple): Promise<LindaResponse>;
    take(tuple: Tuple): Promise<LindaResponse>;
    watch(tuple: Tuple, callback: Callback): void;
    removeLinstener(): void;
    onDisconnected(callback: ConnectCallback): void;
}
