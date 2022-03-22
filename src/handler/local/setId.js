module.exports = (states, state) => async request => {
    console.log("Id set to", request.id)
    state.localId = request.id
}