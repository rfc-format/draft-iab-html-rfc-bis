const express = require('express')

function send(obj) {
  if (process.send) {
    process.send(obj)
  } else {
    console.log('SEND', obj)
  }
}

let app = express()
app.use(express.static('localhost'))
let listener = app.listen(parseInt(process.argv[2]),
                                   'localhost',
                                   () => {
  send({name: 'listen', addr: listener.address()})
})

listener.on('error', (er) => {
  send({name: 'error', error: er})
})

process.on('message', (msg) => {
  switch (msg) {
    case 'stop':
      listener.close()
      process.exit(0)
      break
  }
})
