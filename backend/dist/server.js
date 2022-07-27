"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
exports.__esModule = true;
BigInt.prototype.toJSON = function () {
    return this.toString();
};
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var web3_js_1 = require("@solana/web3.js");
var spl_token_1 = require("@solana/spl-token");
var cors = require('cors');
var app = (0, express_1["default"])();
var payer = web3_js_1.Keypair.generate();
var mintAuthority = web3_js_1.Keypair.generate();
var freezeAuthority = web3_js_1.Keypair.generate();
var connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('devnet'), 'confirmed');
var friend = web3_js_1.Keypair.generate();
app.use(body_parser_1["default"].urlencoded({ extended: true }));
app.use(body_parser_1["default"].json());
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var myKey, friendKey;
    return __generator(this, function (_a) {
        myKey = __assign(__assign({}, payer), { address: payer.publicKey });
        friendKey = __assign(__assign({}, friend), { address: friend.publicKey });
        res.json({ myKey: myKey, friendKey: friendKey });
        return [2 /*return*/];
    });
}); });
app.post('/mint', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var key, secret, pubKey, sign, mint, mintInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = req.body.key;
                secret = new Uint8Array(Object.values(key._keypair.secretKey));
                pubKey = new web3_js_1.PublicKey(key.address);
                sign = {
                    publicKey: pubKey,
                    secretKey: secret
                };
                return [4 /*yield*/, (0, spl_token_1.createMint)(connection, sign, mintAuthority.publicKey, freezeAuthority.publicKey, 9)];
            case 1:
                mint = _a.sent();
                return [4 /*yield*/, (0, spl_token_1.getMint)(connection, mint)];
            case 2:
                mintInfo = _a.sent();
                res.json(mintInfo);
                return [2 /*return*/];
        }
    });
}); });
app.post('/get-token-account', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, key, mint, pubKey, secret, tokenAccount, tokenAccountInfo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, key = _a.key, mint = _a.mint;
                pubKey = new web3_js_1.PublicKey(key.address);
                secret = new Uint8Array(Object.values(key._keypair.secretKey));
                return [4 /*yield*/, (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, payer, new web3_js_1.PublicKey(mint.address), pubKey)];
            case 1:
                tokenAccount = _b.sent();
                return [4 /*yield*/, (0, spl_token_1.getAccount)(connection, tokenAccount.address)];
            case 2:
                tokenAccountInfo = _b.sent();
                console.log(tokenAccountInfo);
                res.json(tokenAccountInfo);
                return [2 /*return*/];
        }
    });
}); });
app.post('/mint-to', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, key, mint, tokenAccountAddr, amount, pubKey, secret, sign, mintInfo, tokenAccountInfo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, key = _a.key, mint = _a.mint, tokenAccountAddr = _a.tokenAccountAddr, amount = _a.amount;
                pubKey = new web3_js_1.PublicKey(key.address);
                secret = new Uint8Array(Object.values(key._keypair.secretKey));
                sign = {
                    publicKey: pubKey,
                    secretKey: secret
                };
                return [4 /*yield*/, (0, spl_token_1.mintTo)(connection, sign, new web3_js_1.PublicKey(mint.address), new web3_js_1.PublicKey(tokenAccountAddr), mintAuthority, Number(amount))];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, spl_token_1.getMint)(connection, new web3_js_1.PublicKey(mint.address))];
            case 2:
                mintInfo = _b.sent();
                return [4 /*yield*/, (0, spl_token_1.getAccount)(connection, new web3_js_1.PublicKey(tokenAccountAddr))];
            case 3:
                tokenAccountInfo = _b.sent();
                res.json({ mintInfo: mintInfo, tokenAccountInfo: tokenAccountInfo });
                return [2 /*return*/];
        }
    });
}); });
app.post('/transfer', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, key, fromTokenAcc, toTokenAcc, amount, pubKey, secret, sign, signiture, fromTokenAccInfo, toTokenAccInfo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, key = _a.key, fromTokenAcc = _a.fromTokenAcc, toTokenAcc = _a.toTokenAcc, amount = _a.amount;
                pubKey = new web3_js_1.PublicKey(key.address);
                secret = new Uint8Array(Object.values(key._keypair.secretKey));
                sign = {
                    publicKey: pubKey,
                    secretKey: secret
                };
                return [4 /*yield*/, (0, spl_token_1.transfer)(connection, sign, new web3_js_1.PublicKey(fromTokenAcc.address), new web3_js_1.PublicKey(toTokenAcc.address), 
                    // payer.publicKey,
                    pubKey, amount)];
            case 1:
                signiture = _b.sent();
                console.log(signiture);
                return [4 /*yield*/, (0, spl_token_1.getAccount)(connection, new web3_js_1.PublicKey(fromTokenAcc.address))];
            case 2:
                fromTokenAccInfo = _b.sent();
                return [4 /*yield*/, (0, spl_token_1.getAccount)(connection, new web3_js_1.PublicKey(toTokenAcc.address))];
            case 3:
                toTokenAccInfo = _b.sent();
                res.json({ fromTokenAccInfo: fromTokenAccInfo, toTokenAccInfo: toTokenAccInfo });
                return [2 /*return*/];
        }
    });
}); });
app.listen(3001, function () {
    return __awaiter(this, void 0, void 0, function () {
        var airdropSignature, mint, tokenAccount, mintInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.requestAirdrop(payer.publicKey, 
                    // friend.publicKey,
                    web3_js_1.LAMPORTS_PER_SOL)];
                case 1:
                    airdropSignature = _a.sent();
                    return [4 /*yield*/, connection.confirmTransaction(airdropSignature)];
                case 2:
                    _a.sent();
                    console.log("starting app on: 3001");
                    return [4 /*yield*/, (0, spl_token_1.createMint)(connection, payer, mintAuthority.publicKey, freezeAuthority.publicKey, 9 // We are using 9 to match the CLI decimal default exactly
                        )];
                case 3:
                    mint = _a.sent();
                    return [4 /*yield*/, (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, payer, mint, payer.publicKey)];
                case 4:
                    tokenAccount = _a.sent();
                    return [4 /*yield*/, (0, spl_token_1.mintTo)(connection, payer, mint, tokenAccount.address, mintAuthority, 100000000000 // because decimals for the mint are set to 9 
                        )];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, spl_token_1.getMint)(connection, mint)];
                case 6:
                    mintInfo = _a.sent();
                    console.log(mintInfo.supply);
                    return [2 /*return*/];
            }
        });
    });
});
exports["default"] = app;
