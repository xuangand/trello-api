const express = require ('express')

const app = express()

const hostname = 'localhost'

const port = 8017

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(port, hostname, () => {
  console.log(`testing server xuangand. The server name is http://${hostname}:${port}/`)
})