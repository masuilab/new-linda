import {
  IsMuchResponse,
  LindaCallback,
  LindaOperation,
  LindaResponse,
  LindaMatchedResponse,
} from './interfaces';
import { EventEmitter2 } from 'eventemitter2';
import storageClient from './dbclient/memoryClient';

export default class tupleSpace {
  emitter: EventEmitter2;
  storage: storageClient;
  tupleSpaceName: string;
  constructor(tupleSpaceName: string) {
    this.emitter = new EventEmitter2({
      wildcard: true,
      delimiter: '::',
      newListener: false,
      maxListeners: 20,
      verboseMemoryLeak: false,
    });
    this.tupleSpaceName = tupleSpaceName;
    this.storage = new storageClient(tupleSpaceName);
  }

  get db() {
    return this.storage.tupleSpace;
  }

  async write(
    operation: LindaOperation,
    callback: LindaCallback,
  ): Promise<void> {
    const resData: LindaResponse = await this.storage.insert(operation);
    // this.emitter.emit("_writeData", operation);
    this.emitter.emit('_writeData', resData);
    callback(resData);
  }

  async read(
    operation: LindaOperation,
    callback: LindaCallback,
  ): Promise<void> {
    let resData: LindaResponse = await this.storage.get(operation);
    callback(resData);
  }

  async take(
    operation: LindaOperation,
    callback: LindaCallback,
  ): Promise<void> {
    let resData: LindaResponse = await this.storage.get(operation);
    if (resData._isMuched) {
      await this.storage.delete(resData._id);
    }
    callback(resData);
  }

  watch(operation: LindaOperation, callback: LindaCallback): void {
    this.emitter.on('_writeData', (eventTuple: LindaMatchedResponse) => {
      let result: IsMuchResponse = this.storage.isMuch(
        eventTuple._payload,
        operation._payload,
      );
      if (result.isMuched && result.res) {
        const resData: LindaMatchedResponse = {
          _time: Date.now(),
          _payload: result.res,
          _where: this.tupleSpaceName,
          _id: eventTuple._id,
        };
        if (eventTuple._from) {
          resData._from = eventTuple._from;
        }
        callback(resData);
      }
    });
  }
}
