import io from 'socket.io-client';
export default class LindaClient {
    constructor() {
        this.tupleSpaceName = '';
    }
    async connect(url, tsName) {
        this.socket = io(url);
        this.tupleSpaceName = tsName;
    }
    read(tuple) {
        let readOperation = {
            _payload: tuple,
            _where: this.tupleSpaceName,
            _type: 'read',
        };
        return new Promise((resolve, reject) => {
            if (this.socket) {
                this.socket.on('_read_response', (resData) => {
                    resolve(resData);
                });
                this.socket.emit('_operation', readOperation);
            }
            else {
                reject();
            }
        });
    }
    write(tuple) {
        let writeOperation = {
            _payload: tuple,
            _where: this.tupleSpaceName,
            _type: 'write',
            _from: tuple._from && typeof tuple._from === 'string'
                ? tuple._from
                : undefined,
        };
        return new Promise((resolve, reject) => {
            if (this.socket) {
                this.socket.on('_write_response', (resData) => {
                    resolve(resData);
                });
                this.socket.emit('_operation', writeOperation);
            }
            else {
                reject();
            }
        });
    }
    take(tuple) {
        let takeOperation = {
            _payload: tuple,
            _where: this.tupleSpaceName,
            _type: 'take',
        };
        return new Promise((resolve, reject) => {
            if (this.socket) {
                this.socket.on('_take_response', (resData) => {
                    resolve(resData);
                });
                this.socket.emit('_operation', takeOperation);
            }
            else {
                reject();
            }
        });
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
