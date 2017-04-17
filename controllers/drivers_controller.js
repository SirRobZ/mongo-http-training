module.exports = {
  greeting(req, res) {
    res.send({ hello: "there"})
  },
  create(req, res) {
    res.json(req.body)
  }
}
