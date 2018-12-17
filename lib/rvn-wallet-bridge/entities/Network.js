"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NetworkType;
(function (NetworkType) {
    NetworkType["MAINNET"] = "Mainnet";
    NetworkType["TESTNET"] = "Testnet";
    NetworkType["UNKNOWN"] = "Unknown";
})(NetworkType = exports.NetworkType || (exports.NetworkType = {}));
class Network {
    constructor(magic, name) {
        this.magic = magic;
        this.name = name;
    }
}
exports.default = Network;
