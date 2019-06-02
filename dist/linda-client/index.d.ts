import { Tuple, Callback, ConnectCallback, LindaResponse } from '../interfaces';
export default class LindaClient {
    socket?: SocketIOClient.Socket;
    tupleSpaceName: string;
    constructor();
    connect(url: string, tsName: string): Promise<void>;
    read(tuple: Tuple): Promise<LindaResponse>;
    write(tuple: Tuple): Promise<LindaResponse>;
    take(tuple: Tuple): Promise<LindaResponse>;
    watch(tuple: Tuple, callback: Callback): void;
    onDisconnected(callback: ConnectCallback): void;
}
