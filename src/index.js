const mitt = require('mitt')
const { WebSocketServer } = require('ws')
const msgpack = require('msgpack')
const handler = require('./handler')
const IPFS = require('ipfs-core')
const OrbitDB = require('orbit-db')
const AccessControllers = require('orbit-db-access-controllers')
const Identities = require('orbit-db-identity-provider')
const Stores = require('./database/stores')
const EtherIdentityProvider = require('./database/identity/eth')
const Keystore = require('orbit-db-keystore')

const wss = new WebSocketServer({ port: 20223 });

var states = {}
Identities.addIdentityProvider(EtherIdentityProvider)

async function init() {
    states.ipfs = await IPFS.create({ repo: "./data/files" })
    let identity = await Identities.createIdentity({
        type: "EtherIdentity",
        id: "0x0",
        sign: (data) => {
            return "0x0"
        },
        keystore: new Keystore("./data/database/keys")
    })
    states.orbitdb = await OrbitDB.createInstance(states.ipfs, {
        directory: "./data/database",
        identity: identity,
        AccessControllers: AccessControllers
    })
    states.stores = new Stores(states.orbitdb)
}

init().then(() => {
    wss.on('connection', ws => {
        let bus = mitt()
        let state = {
            localId: "",
            bus: bus
        }
        handler(bus, states, state)
        bus.on("send", payload => {
            let data = msgpack.pack(payload)
            ws.send(data)
        })
        ws.on('message', data => {
            let payload = msgpack.unpack(data)
            bus.emit(payload["type"], payload)
        })
    })
})
