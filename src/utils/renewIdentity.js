const Identities = require('orbit-db-identity-provider')
const EtherIdentityProvider = require('./database/identity/eth')
const Keystore = require('orbit-db-keystore')
Identities.addIdentityProvider(EtherIdentityProvider)

module.exports = (stores, state) => {
    let identity = await Identities.createIdentity({
        type: "EtherIdentity",
        id: state.localId,
        sign: (data) => {
            return new Promise((resolve, reject) => {
                state.bus.emit("send", {"type": "sign", "data": data})
                let timeoutId = setTimeout(() => {
                    state.bus.off("signature", receiveHandler)
                    reject("Timed Out")
                }, 10000)
                const receiveHandler = result => {
                    if (result["data"] == data) {
                        state.bus.off("signature", receiveHandler)
                        clearTimeout(timeoutId)
                        resolve(result["sign"])
                    }
                }
                state.bus.on("signature", receiveHandler)
            })
        },
        keystore: new Keystore("./data/database/keys")
    })
    return Promise.all(stores.map(store => {
        return new Promise(resolve => {
            store.setIdentity(identity)
            resolve()
        })
    }))
}