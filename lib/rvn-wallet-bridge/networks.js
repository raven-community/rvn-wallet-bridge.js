"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Network_1 = require("./entities/Network");
const Network_2 = require("./entities/Network");
const networks = new Map([
    [0x4e564152, Network_2.NetworkType.MAINNET],
    [0x544e5652, Network_2.NetworkType.TESTNET]
]);
exports.findNetwork = (magic) => {
    const type = networks.get(magic);
    if (type) {
        return new Network_1.default(magic, type);
    }
    return new Network_1.default(magic, Network_2.NetworkType.UNKNOWN);
};
