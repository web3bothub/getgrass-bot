const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const { getUser } = require('../recorder')
const root = __dirname
const port = 80

app.use(express.static(path.join(__dirname, 'public')))

// respond with "hello world" when a GET request is made to the homepage
app.get('/api/users', (req, res) => {
  const users = fs.readdirSync(`${root}/users`).map(file => {
    return getUser(file.replace('.json', ''))
  })

  return res.json(users)
})

app.get('/api/users/:userId', (req, res) => {
  const user = getUser(req.params.userId)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  return res.json(user)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
