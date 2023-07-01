const express = require('express')
const app = express()
const port = 8080

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get('/', (req, response) => {
  response.send('404 Not Found?')
})

app.post('/', (req, response) => {
  response.send('You got to the right place, ' + req.body.name)
  console.log(req.body)
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})