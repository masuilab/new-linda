import io from 'socket.io-client';
import {
  Tuple,
  Callback,
  ConnectCallback,
  LindaOperation,
  LindaResponse,
} from '../interfaces';
import axios from 'axios';

export default class LindaClient {
  socket: SocketIOClient.Socket | null;
  tupleSpaceName: string;
  url: string;
  constructor(url: string, tupleSpaceName: string) {
    this.socket = null;
    this.tupleSpaceName = tupleSpaceName;
    this.url = url;
  }

  async read(tuple: Tuple): Promise<LindaResponse> {
    const readOperation: LindaOperation = {
      _payload: tuple,
      _type: 'read',
      _where: this.tupleSpaceName,
    };
    const res = await axios.post(this.url, readOperation);
    return res.data;
  }

  async write(tuple: Tuple): Promise<LindaResponse> {
    let writeOperation: LindaOperation = {
      _payload: tuple,
      _where: this.tupleSpaceName,
      _type: 'write',
      _from:
        tuple._from && typeof tuple._from === 'string'
          ? tuple._from
          : undefined,
    };
    const res = await axios.post(this.url, writeOperation);
    return res.data;
  }

  async take(tuple: Tuple): Promise<LindaResponse> {
    let takeOperation: LindaOperation = {
      _payload: tuple,
      _where: this.tupleSpaceName,
      _type: 'take',
    };
    const res = await axios.post(this.url, takeOperation);
    return res.data;
  }

  watch(tuple: Tuple, callback: Callback) {
    this.socket = null;
    let watchOperation: LindaOperation = {
      _payload: tuple,
      _where: this.tupleSpaceName,
      _type: 'watch',
    };
    this.socket = io(this.url);
    if (this.socket) {
      this.socket.on('_watch_response', (resData: LindaResponse) => {
        callback(resData);
      });
      this.socket.emit('_operation', watchOperation);
    }
  }

  removeLinstener() {
    this.socket = null;
  }

  onDisconnected(callback: ConnectCallback) {
    if (this.socket) {
      this.socket.on('disconnect', callback);
    }
  }
}
