import tupleSpace from './tupleSpace';
export default class Linda {
    constructor() {
        this.tupleSpaces = {};
    }
    tupleSpace(tupleSpaceName) {
        if (!this.tupleSpaces[tupleSpaceName]) {
            this.tupleSpaces[tupleSpaceName] = new tupleSpace(tupleSpaceName);
        }
        return this.tupleSpaces[tupleSpaceName];
    }
    listen(server, io) {
        console.log('linda-listening');
        io.sockets.on('connection', (socket) => {
            socket.on('_operation', (data) => {
                switch (data._type) {
                    case 'read':
                        this.tupleSpace(data._where).read(data, (resData) => {
                            socket.emit('_read_response', resData);
                        });
                        break;
                    case 'write':
                        this.tupleSpace(data._where).write(data, (resData) => {
                            socket.emit('_write_response', resData);
                        });
                        break;
                    case 'take':
                        this.tupleSpace(data._where).take(data, (resData) => {
                            socket.emit('_take_response', resData);
                        });
                        break;
                    case 'watch':
                        this.tupleSpace(data._where).watch(data, (resData) => {
                            socket.emit('_watch_response', resData);
                        });
                        break;
                    default:
                        break;
                }
            });
        });
    }
}
