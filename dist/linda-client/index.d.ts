import { Tuple, Callback, ConnectCallback } from '../interfaces';
export default class LindaClient {
    socket?: SocketIOClient.Socket;
    tupleSpaceName: string;
    constructor();
    connect(url: string, tsName: string): Promise<void>;
    read(tuple: Tuple): Promise<void>;
    write(tuple: Tuple): Promise<void>;
    take(tuple: Tuple): Promise<void>;
    watch(tuple: Tuple, callback: Callback): void;
    onDisconnected(callback: ConnectCallback): void;
}
