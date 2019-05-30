import io from 'socket.io-client';
export default class LindaClient {
    constructor() {
        this.tupleSpaceName = '';
    }
    async connect(url, tsName) {
        this.socket = io(url);
        this.tupleSpaceName = tsName;
    }
    async read(tuple) {
        let readOperation = {
            _payload: tuple,
            _where: this.tupleSpaceName,
            _type: 'read',
        };
        if (this.socket) {
            this.socket.on('_read_response', (resData) => {
                return resData;
            });
            await this.socket.emit('_operation', readOperation);
        }
    }
    async write(tuple) {
        let writeOperation = {
            _payload: tuple,
            _where: this.tupleSpaceName,
            _type: 'write',
            _from: tuple._from && typeof tuple._from === 'string'
                ? tuple._from
                : undefined,
        };
        if (this.socket) {
            this.socket.on('_write_response', (resData) => {
                return resData;
            });
            await this.socket.emit('_operation', writeOperation);
        }
    }
    async take(tuple) {
        let takeOperation = {
            _payload: tuple,
            _where: this.tupleSpaceName,
            _type: 'take',
        };
        if (this.socket) {
            this.socket.on('_take_response', (resData) => {
                return resData;
            });
            await this.socket.emit('_operation', takeOperation);
        }
    }
    watch(tuple, callback) {
        let watchOperation = {
            _payload: tuple,
            _where: this.tupleSpaceName,
            _type: 'watch',
        };
        if (this.socket) {
            this.socket.on('_watch_response', (resData) => {
                callback(resData);
            });
            this.socket.emit('_operation', watchOperation);
        }
    }
    onDisconnected(callback) {
        if (this.socket) {
            this.socket.on('disconnect', callback);
        }
    }
}
