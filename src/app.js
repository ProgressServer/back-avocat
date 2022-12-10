const express = require('express')
const routes = require('./routes');
require('dotenv').config()
require('./config/database')
const app = express()

var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.PORT || 3000

app.use('/', routes);

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Avocat depoch app listening on port ${port}`)
})