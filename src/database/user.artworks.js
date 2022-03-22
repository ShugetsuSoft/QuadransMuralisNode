class UserArtworks {
    constructor(store, userid) {
        this.store = store
        this.id = userid
    }

    static async init(states, userAddr) {
        let store = await states.stores.obatinBy(userAddr + ".artworks", "docstore", {
            accessController: {
                write: [
                    userAddr
                ]
            },
        })
        await store.load()

        return new UserArtworks(store, userAddr)
    }

    fetchAll() {
        return this.store.query((doc) => true)
    }

    exportJSON() {
        return JSON.stringify(this.fetchAll())
    }
}

module.exports = UserArtworks