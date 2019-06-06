"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var eventemitter2_1 = require("eventemitter2");
var memoryClient_1 = __importDefault(require("./dbclient/memoryClient"));
var isMatch_1 = __importDefault(require("./util/isMatch"));
var tupleSpace = /** @class */ (function () {
    function tupleSpace(tupleSpaceName) {
        this.emitter = new eventemitter2_1.EventEmitter2({
            wildcard: true,
            delimiter: '::',
            newListener: false,
            maxListeners: 20,
            verboseMemoryLeak: false,
        });
        this.tupleSpaceName = tupleSpaceName;
        this.storage = new memoryClient_1.default(tupleSpaceName);
    }
    Object.defineProperty(tupleSpace.prototype, "db", {
        get: function () {
            return this.storage.tupleSpace;
        },
        enumerable: true,
        configurable: true
    });
    tupleSpace.prototype.write = function (operation, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var resData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.insert(operation)];
                    case 1:
                        resData = _a.sent();
                        this.emitter.emit('_writeData', resData);
                        callback(resData);
                        return [2 /*return*/];
                }
            });
        });
    };
    tupleSpace.prototype.read = function (operation, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var resData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.get(operation)];
                    case 1:
                        resData = _a.sent();
                        callback(resData);
                        return [2 /*return*/];
                }
            });
        });
    };
    tupleSpace.prototype.take = function (operation, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var resData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.get(operation)];
                    case 1:
                        resData = _a.sent();
                        if (!resData._isMatched) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.storage.delete(resData._id)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        callback(resData);
                        return [2 /*return*/];
                }
            });
        });
    };
    tupleSpace.prototype.watch = function (operation, callback) {
        var _this = this;
        this.emitter.on('_writeData', function (eventTuple) {
            console.log(eventTuple);
            var result = isMatch_1.default(eventTuple._payload, operation._payload);
            if (result.isMatched && result.res) {
                var resData = {
                    _time: Date.now(),
                    _payload: result.res,
                    _where: _this.tupleSpaceName,
                    _id: eventTuple._id,
                };
                if (eventTuple._from) {
                    resData._from = eventTuple._from;
                }
                callback(resData);
            }
        });
    };
    return tupleSpace;
}());
exports.default = tupleSpace;
