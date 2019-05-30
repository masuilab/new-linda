import tupleSpace from './tupleSpace';
import { Server } from 'http';
import { LindaOperation, LindaResponse } from './interfaces';

export default class Linda {
  tupleSpaces: { [key: string]: tupleSpace };
  constructor() {
    this.tupleSpaces = {};
  }
  tupleSpace(tupleSpaceName: string) {
    if (!this.tupleSpaces[tupleSpaceName]) {
      this.tupleSpaces[tupleSpaceName] = new tupleSpace(tupleSpaceName);
    }
    return this.tupleSpaces[tupleSpaceName];
  }
  listen(server: Server, io: SocketIO.Server) {
    console.log('linda-listening');
    io.sockets.on('connection', (socket: SocketIO.Socket) => {
      socket.on('_operation', (data: LindaOperation) => {
        switch (data._type) {
          case 'read':
            this.tupleSpace(data._where).read(
              data,
              (resData: LindaResponse) => {
                socket.emit('_read_response', resData);
              },
            );
            break;
          case 'write':
            this.tupleSpace(data._where).write(
              data,
              (resData: LindaResponse) => {
                socket.emit('_write_response', resData);
              },
            );
            break;
          case 'take':
            this.tupleSpace(data._where).take(
              data,
              (resData: LindaResponse) => {
                socket.emit('_take_response', resData);
              },
            );
            break;
          case 'watch':
            this.tupleSpace(data._where).watch(
              data,
              (resData: LindaResponse) => {
                socket.emit('_watch_response', resData);
              },
            );
            break;
          default:
            break;
        }
      });
    });
  }
}
