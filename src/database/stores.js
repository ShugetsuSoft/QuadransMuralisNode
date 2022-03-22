const LRU = require('lru-cache')

class Stores {
    constructor(orbitdb, size = 50000) {
        this.orbitdb = orbitdb
        this.stores = new LRU({
            max: size
        })
    }
    
    get(addr) {
        return this.stores.get(addr)
    }

    async obatinBy(name, type, options=undefined) {
        let addr = await this.orbitdb.determineAddress(name, type, options)
        return this.obtain(addr)
    }

    async obtain(addr) {
        let store = this.get(addr)
        if (store) {
            return store
        }
        store = await this.orbitdb.open(addr)
        this.put(store)
        return store
    }

    put(store) {
        this.stores.set(store.address.toString(), store)
    }

    clear() {
        this.stores.clear()
    }
}

module.exports = Stores