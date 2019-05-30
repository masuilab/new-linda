export type LindaOperation = {
  _payload: Tuple;
  _where: string;
  _type: 'read' | 'write' | 'watch' | 'take';
  _from?: string;
};

export type LindaResponse = LindaMatchedResponse | LindaNotMatchedResponse;

export interface LindaMatchedResponse {
  _payload: Tuple;
  _where: string;
  _time: number;
  _id: number;
  _isMuched?: true;
  _from?: string;
}

export interface LindaNotMatchedResponse {
  _payload: null;
  _where: string;
  _time: null;
  _id: null;
  _isMuched?: false;
  _from?: string;
}

export interface LindaCallback {
  (res: LindaResponse): void;
}

export type MemoryDB = {
  [tsName: string]: Array<TupleInfo>;
};

export type TupleInfo = {
  _payload: Tuple;
  _where: string;
  _from?: string;
  _time: number;
  _id: number | any;
};
export type Tuple = {
  [key: string]: number | string | boolean | Object;
};

export type IsMuchResponse = {
  isMuched: boolean;
  res: Tuple | null;
};

export type InsertData = {
  _time: number;
  _from: string;
  _payload: Object;
  _id?: number;
};

//FIXME: 以下順次廃止予定
export type SavedData = {
  _time: number;
  _from: string;
  _id: number;
  _payload: Object;
};

export type ResponseTuple = {
  _isMuched: boolean;
  _time: number;
  _from: string;
  _id: number;
  _payload: Object;
};

export type WatchResponseTuple = {
  _time: number;
  _from: string;
  _payload: Object;
};

export type LindaSubscribeOperation = {
  tsName: string;
  payload: Tuple;
  from: string;
};

export interface DeleteWriteOpResultObject {
  result: {
    ok?: number;
    n?: number;
  };
  connection?: any;
  deletedCount?: number;
}

export interface WatchCallback {
  (resData: WatchResponseTuple): void;
}

export interface WriteCallback {
  (resData: InsertData): void;
}

export interface ReadTakeCallback {
  (resData: ResponseTuple): void;
}

export interface ConnectCallback {
  (): void;
}

export interface Callback {
  (resData: LindaResponse): void;
}
