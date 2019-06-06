"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __importStar(require("express"));
var router = express.Router();
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var app_1 = __importDefault(require("../app"));
router.get('/:tupleSpaceName/:operation', function (req, res) {
    if (req.params.tupleSpaceName === '_js') {
        switch (req.params.operation) {
            case 'linda-client.js':
                fs.readFile(path.join(__dirname, '../../public/js/lindaClient.js'), function (err, data) {
                    if (err)
                        throw 'fs read error';
                    res.setHeader('Content-Type', 'application/javascript');
                    res.writeHead(200);
                    res.end(data);
                });
                break;
            default:
                res.send('no match file');
                break;
        }
    }
    else {
        var linda = app_1.default.get('linda');
        var ts = linda.tupleSpace(req.params.tupleSpaceName);
        var operation = {
            _payload: req.query,
            _type: req.params.operation,
            _where: req.params.tupleSpaceName,
        };
        switch (req.params.operation) {
            case 'read':
                ts.read(operation, function (Data) {
                    res.send(Data);
                });
                break;
            case 'take':
                ts.take(operation, function (Data) {
                    res.send(Data);
                });
                break;
            case 'write':
                ts.write(operation, function (Data) {
                    res.send(Data);
                });
                break;
            case 'db':
                res.send(ts.db);
                break;
            default:
                res.send('There is no operation like "' + req.params.operation + '"');
                break;
        }
    }
});
router.get('/', function (req, res) {
    res.render('index');
});
router.get('/:tupleSpaceName', function (req, res) {
    if (req.params.tupleSpaceName === '_js') {
        // 配布する静的ファイルの説明ページ
        res.render('jsIndex');
    }
    else {
        res.render('tupleSpace', {
            tupleSpaceName: req.params.tupleSpaceName,
            watchTuple: req.query,
        });
    }
});
var isValidLindaOperation = function (operation) {
    var keys = Object.keys(operation);
    if (!operation)
        return false;
    if (!keys.includes('_payload') ||
        !keys.includes('_where') ||
        !keys.includes('_type')) {
        return false;
    }
    return (typeof operation._where === 'string' &&
        ['read', 'write', 'take'].includes(operation._type));
};
router.post('/', function (req, res) {
    var linda = app_1.default.get('linda');
    if (isValidLindaOperation(req.body)) {
        var ts = linda.tupleSpace(req.body._where);
        switch (req.body._type) {
            case 'write':
                ts.write(req.body, function (resData) {
                    res.send({ status: 'ok', resData: resData });
                });
                break;
            case 'read':
                ts.read(req.body, function (resData) {
                    res.send({ status: 'ok', resData: resData });
                });
                break;
            case 'take':
                ts.take(req.body, function (resData) {
                    res.send({ status: 'ok', resData: resData });
                });
                break;
            default:
                res.send({ status: 'invalid operation' });
                break;
        }
    }
    else {
        res.send({ status: 'invalid operation' });
    }
});
exports.default = router;
