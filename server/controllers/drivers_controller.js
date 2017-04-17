const Driver = require('../models/driver')

module.exports = {
  greeting(req, res) {
    res.send({ hello: "there"})
  },
  index(req, res, next) {
    const { lat, lng } = req.query
    Driver.geoNear(
      { type: 'Point', coordinates: [parseFloat(lat), parseFloat(lng)]},
      { spherical: true, maxDistance: 200000 }
    )
      .then(drivers => res.json(drivers))
      .catch(next)
  },
  create(req, res, next) {
    const driverProps = req.body
    Driver.create(driverProps)
      .then(driver => res.json(driver))
      .catch(next)
  },
  edit(req, res, next) {
    const driverId = req.params.id
    const driverProps = req.body
    Driver.findByIdAndUpdate(driverId, driverProps)
      .then(() => Driver.findById(driverId))
      .then(driver => res.send(driver))
      .catch(next)
  },
  delete(req, res, next) {
    const driverId = req.params.id
    Driver.findByIdAndRemove(driverId)
      .then(driver => res.status(204).send(driver))
      .catch(next)
  }
}
