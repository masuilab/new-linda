"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tupleSpace_1 = __importDefault(require("./tupleSpace"));
var Linda = /** @class */ (function () {
    function Linda() {
        this.tupleSpaces = {};
    }
    Linda.prototype.tupleSpace = function (tupleSpaceName) {
        if (!this.tupleSpaces[tupleSpaceName]) {
            this.tupleSpaces[tupleSpaceName] = new tupleSpace_1.default(tupleSpaceName);
        }
        return this.tupleSpaces[tupleSpaceName];
    };
    Linda.prototype.listen = function (server, io) {
        var _this = this;
        console.log('linda-listening');
        io.sockets.on('connection', function (socket) {
            socket.on('_operation', function (data) {
                switch (data._type) {
                    case 'read':
                        _this.tupleSpace(data._where).read(data, function (resData) {
                            socket.emit('_read_response', resData);
                        });
                        break;
                    case 'write':
                        _this.tupleSpace(data._where).write(data, function (resData) {
                            socket.emit('_write_response', resData);
                        });
                        break;
                    case 'take':
                        _this.tupleSpace(data._where).take(data, function (resData) {
                            socket.emit('_take_response', resData);
                        });
                        break;
                    case 'watch':
                        _this.tupleSpace(data._where).watch(data, function (resData) {
                            socket.emit('_watch_response', resData);
                        });
                        break;
                    default:
                        break;
                }
            });
        });
    };
    return Linda;
}());
exports.default = Linda;
