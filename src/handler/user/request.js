const UserProfile = require('../../database/user.profile')
const UserArtworks = require('../../database/user.artworks')

module.exports = (states, state) => async request => {
    let userAddr = request["id"]
    let profile = await UserProfile.init(states, userAddr)
    console.log(profile.exportJSON())
    state.bus.emit("send", {
        "type": "user/profile",
        "id": userAddr,
        "info": profile.fetchAll()
    })

    let artworks = await UserArtworks.init(states, userAddr)
    console.log(artworks.exportJSON())
    state.bus.emit("send", {
        "type": "user/artworks",
        "id": userAddr,
        "info": artworks.fetchAll()
    })

}