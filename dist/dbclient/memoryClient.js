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
var memoryDB_1 = __importDefault(require("../db/memoryDB"));
var isMatch_1 = __importDefault(require("../util/isMatch"));
var storageClient = /** @class */ (function () {
    function storageClient(tupleSpaceName) {
        this.tupleSpaceName = tupleSpaceName;
        if (memoryDB_1.default[tupleSpaceName]) {
            this.tupleSpace = memoryDB_1.default[tupleSpaceName];
            console.log(tupleSpaceName + ' is already exist');
        }
        else {
            this.tupleSpace = memoryDB_1.default[tupleSpaceName] = [
                {
                    _id: 0,
                    _time: Date.now(),
                    _payload: { type: 'init' },
                    _from: tupleSpaceName,
                    _where: tupleSpaceName,
                },
            ];
            console.log(tupleSpaceName + ' is created');
        }
    }
    storageClient.prototype.insert = function (operation) {
        return __awaiter(this, void 0, void 0, function () {
            var time, insertData;
            return __generator(this, function (_a) {
                time = Date.now();
                insertData = {
                    _time: time,
                    _where: this.tupleSpaceName,
                    _payload: operation._payload,
                    _id: this.tupleSpace.length,
                };
                if (operation._from) {
                    insertData._from = operation._from;
                }
                this.tupleSpace.unshift(insertData);
                return [2 /*return*/, insertData];
            });
        });
    };
    storageClient.prototype.get = function (operation) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, t, result, resData;
            return __generator(this, function (_b) {
                for (_i = 0, _a = this.tupleSpace; _i < _a.length; _i++) {
                    t = _a[_i];
                    result = isMatch_1.default(t._payload, operation._payload);
                    if (result.isMatched) {
                        resData = Object.assign(t, {
                            _isMatched: true,
                        });
                        return [2 /*return*/, resData];
                    }
                }
                return [2 /*return*/, {
                        _isMatched: false,
                        _id: null,
                        _payload: null,
                        _time: null,
                        _where: this.tupleSpaceName,
                    }];
            });
        });
    };
    storageClient.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.tupleSpace.splice(id, 1);
                return [2 /*return*/];
            });
        });
    };
    return storageClient;
}());
exports.default = storageClient;
