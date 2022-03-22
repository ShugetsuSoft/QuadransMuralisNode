const WebSocket = require('ws')
const msgpack = require('msgpack')

const ws = new WebSocket('ws://localhost:20223', {
  perMessageDeflate: false
});
ws.on('open', function open() {
    ws.send(msgpack.pack({
        "type": "user/request"
    }))
    ws.close()
})
