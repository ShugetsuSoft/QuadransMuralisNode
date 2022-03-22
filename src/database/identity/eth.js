const IdentityProvider = require('orbit-db-identity-provider/src/identity-provider-interface')
const { verifyMessage } = require('@ethersproject/wallet')
const type = "EtherIdentity"

class EtherIdentityProvider extends IdentityProvider {
    constructor (options = {}) {
        super()
        this.id = options.id
        this.signCall = options.sign
    }

    static get type () { return type }

    setId (newId) {
        this.id = newId
    }

    setSign(call) {
        this.signCall = call
    }

    async getId (options = {}) {
        return this.id
    }

    async signIdentity (data, options = {}) {
        return await this.signCall(data)
    }

    static async verifyIdentity (identity) {
        const signerAddress = verifyMessage(identity.publicKey + identity.signatures.id, identity.signatures.publicKey)
        return (signerAddress === identity.id)
    }
}

module.exports = EtherIdentityProvider
