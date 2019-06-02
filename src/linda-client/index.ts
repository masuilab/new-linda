import io from 'socket.io-client';
import {
  Tuple,
  Callback,
  ConnectCallback,
  LindaOperation,
  LindaResponse,
} from '../interfaces';

export default class LindaClient {
  socket?: SocketIOClient.Socket;
  tupleSpaceName: string;
  constructor() {
    this.tupleSpaceName = '';
  }

  async connect(url: string, tsName: string) {
    this.socket = io(url);
    this.tupleSpaceName = tsName;
  }

  read(tuple: Tuple): Promise<LindaResponse> {
    let readOperation: LindaOperation = {
      _payload: tuple,
      _where: this.tupleSpaceName,
      _type: 'read',
    };
    return new Promise((resolve, reject) => {
      if (this.socket) {
        this.socket.on('_read_response', (resData: LindaResponse) => {
          resolve(resData);
        });
        this.socket.emit('_operation', readOperation);
      } else {
        reject();
      }
    });
  }

  write(tuple: Tuple): Promise<LindaResponse> {
    let writeOperation: LindaOperation = {
      _payload: tuple,
      _where: this.tupleSpaceName,
      _type: 'write',
      _from:
        tuple._from && typeof tuple._from === 'string'
          ? tuple._from
          : undefined,
    };
    return new Promise((resolve, reject) => {
      if (this.socket) {
        this.socket.on('_write_response', (resData: LindaResponse) => {
          resolve(resData);
        });
        this.socket.emit('_operation', writeOperation);
      } else {
        reject();
      }
    });
  }

  take(tuple: Tuple): Promise<LindaResponse> {
    let takeOperation: LindaOperation = {
      _payload: tuple,
      _where: this.tupleSpaceName,
      _type: 'take',
    };
    return new Promise((resolve, reject) => {
      if (this.socket) {
        this.socket.on('_take_response', (resData: LindaResponse) => {
          resolve(resData);
        });
        this.socket.emit('_operation', takeOperation);
      } else {
        reject();
      }
    });
  }

  watch(tuple: Tuple, callback: Callback) {
    let watchOperation: LindaOperation = {
      _payload: tuple,
      _where: this.tupleSpaceName,
      _type: 'watch',
    };
    if (this.socket) {
      this.socket.on('_watch_response', (resData: LindaResponse) => {
        callback(resData);
      });
      this.socket.emit('_operation', watchOperation);
    }
  }

  onDisconnected(callback: ConnectCallback) {
    if (this.socket) {
      this.socket.on('disconnect', callback);
    }
  }
}
