class UserProfile {
    constructor(store, userid) {
        this.store = store
        this.id = userid
    }

    static async init(states, userAddr) {
        let store = await states.stores.obatinBy(userAddr + ".profile", "keyvalue", {
            accessController: {
                write: [
                    userAddr
                ]
            },
        })
        await store.load()

        return new UserProfile(store, userAddr)
    }

    fetchAll() {
        return this.store.all
    }

    get name() {
        return this.fetchAll()["name"]
    }

    get bio() {
        return this.fetchAll()["bio"]
    }

    get avatar() {
        return this.fetchAll()["avatar"]
    }

    get links() {
        return this.fetchAll()["links"]
    }

    get following() {
        return this.fetchAll()["following"]
    }

    exportJSON() {
        return JSON.stringify(this.fetchAll())
    }
}

module.exports = UserProfile