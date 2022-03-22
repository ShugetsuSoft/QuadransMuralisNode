module.exports = (bus, states, state) => {
    bus.on("user/request", require('./user/request')(states, state))
    bus.on("local/setId", require('./local/setId')(states, state))
}