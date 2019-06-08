import * as express from 'express';
const router: express.Router = express.Router();

import * as fs from 'fs';
import * as path from 'path';
import { ResponseTuple, LindaOperation } from '../interfaces';
import app from '../app';
import Linda from '../linda';

router.get(
  '/:tupleSpaceName/:operation',
  (req: express.Request, res: express.Response) => {
    if (req.params.tupleSpaceName === '_js') {
      switch (req.params.operation) {
        case 'linda-client.js':
          fs.readFile(
            path.join(__dirname, '../../public/js/lindaClient.js'),
            (err, data) => {
              if (err) throw 'fs read error';
              res.setHeader('Content-Type', 'application/javascript');
              res.writeHead(200);
              res.end(data);
            },
          );
          break;
        default:
          res.send('no match file');
          break;
      }
    } else {
      const linda = app.get('linda');
      const ts = linda.tupleSpace(req.params.tupleSpaceName);
      const operation: LindaOperation = {
        _payload: req.query,
        _type: req.params.operation,
        _where: req.params.tupleSpaceName,
      };
      switch (req.params.operation) {
        case 'read':
          ts.read(operation, (Data: ResponseTuple) => {
            res.send(Data);
          });
          break;
        case 'take':
          ts.take(operation, (Data: ResponseTuple) => {
            res.send(Data);
          });
          break;
        case 'write':
          ts.write(operation, (Data: ResponseTuple) => {
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
  },
);

router.get('/', (req: express.Request, res: express.Response) => {
  res.render('index');
});

router.get(
  '/:tupleSpaceName',
  (req: express.Request, res: express.Response) => {
    if (req.params.tupleSpaceName === '_js') {
      // 配布する静的ファイルの説明ページ
      res.render('jsIndex');
    } else {
      res.render('tupleSpace', {
        tupleSpaceName: req.params.tupleSpaceName,
        watchTuple: req.query,
      });
    }
  },
);

const isValidLindaOperation = (operation: any): operation is LindaOperation => {
  const keys = Object.keys(operation);
  if (!operation) return false;
  if (
    !keys.includes('_payload') ||
    !keys.includes('_where') ||
    !keys.includes('_type')
  ) {
    return false;
  }
  return (
    typeof operation._where === 'string' &&
    ['read', 'write', 'take'].includes(operation._type)
  );
};

router.post('/', (req: express.Request, res: express.Response) => {
  const linda: Linda = app.get('linda');
  if (isValidLindaOperation(req.body)) {
    let ts = linda.tupleSpace(req.body._where);
    switch (req.body._type) {
      case 'write':
        ts.write(req.body, resData => {
          res.send({ status: 'ok', resData });
        });
        break;
      case 'read':
        ts.read(req.body, resData => {
          res.send({ status: 'ok', resData });
        });
        break;
      case 'take':
        ts.take(req.body, resData => {
          res.send({ status: 'ok', resData });
        });
        break;
      default:
        res.send({ status: 'invalid operation' });
        break;
    }
  } else {
    console.log(req.body);
    res.send({ status: 'invalid operation' });
  }
});

export default router;
