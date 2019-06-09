"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var socket_io_1 = __importDefault(require("socket.io"));
var http_1 = require("http");
var linda_1 = __importDefault(require("./linda"));
var routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
var PORT = Number(process.env.PORT) || 7777;
var options = {
    cookie: false,
    serveClient: false,
    pingTimeout: 15000,
    pingInterval: 13000,
};
var app = express_1.default();
var server = http_1.createServer(app);
var linda = new linda_1.default();
exports.linda = linda;
var io = socket_io_1.default(server, options);
app.set('views', 'views/');
app.set('view engine', 'pug');
app.use(express_1.default.static('public/'));
linda.listen(server, io);
server.listen(PORT, function () {
    console.log('server listeninig at port:' + PORT);
});
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use(cookie_parser_1.default());
//catch 404 and forward to error handler
app.use(function (err, req, res, next) {
    err.status = 404;
    next(err);
});
//error handling
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
app.use('/', routes_1.default);
app.set('linda', linda);
exports.default = app;
