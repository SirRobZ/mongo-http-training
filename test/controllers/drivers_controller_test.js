const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const expect = chai.expect
const app = require('../../server')
const Driver = require('../../server/models/driver')
chai.should()
chai.use(chaiHttp)

describe('The drivers controller', () => {
  it('handles a POST request to /api/drivers', (done) => {
    Driver.count().then(count => {
      chai.request(app)
        .post('/api/drivers')
        .send({ email: 'new-driver@muber.com' })
        .end((err, res) => {
          if (err) { return done(err) }

          Driver.count()
            .then(newCount => {
              newCount.should.equal(count + 1)
              done()
            })
            .catch(err => done(err))
      })
    })
  })
  it('handles a PUT request to /api/drivers/:id', (done) => {
    Driver.create({ email: 'test@test.com' }).then(driver => {
      chai.request(app)
        .put(`/api/drivers/${driver._id}`)
        .send({ driving: true })
        .end((err, res) => {
          if (err) { return done(err) }

          Driver.findById(driver._id)
            .then(updatedDriver => {
              updatedDriver.driving.should.equal(true)
              done()
            })
            .catch(err => done(err))
      })
    })
  })
  it('handles a DELETE request to /api/drivers/:id', (done) => {
    Driver.create({ email: 'test@test.com' }).then(driver => {
      chai.request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end((err, res) => {
          if (err) { return done(err) }

          Driver.findById(driver._id)
            .then(deletedDriver => {
              expect(deletedDriver).to.be.null
              done()
            })
            .catch(err => done(err))
      })
    })
  })
  it('handles a GET request to /api/drivers', (done) => {
    const seattleDriver = new Driver({
      email: 'seattle-driver@muber.com',
      geometry: { type: 'Point', coordinates: [-122.475, 47.614]}
    })
    const miamiDriver = new Driver({
      email: 'miami-driver@muber.com',
      geometry: { type: 'Point', coordinates: [-80.253, 25.791]}
    })
    Promise.all([seattleDriver.save(), miamiDriver.save()])
      .then(drivers => {
        chai.request(app)
          .get('/api/drivers?lat=-80.251&lng=25.790')
          .end((err, res) => {
            if (err) { return done(err) }
            res.body.length.should.equal(1)
            res.body[0].obj.email.should.equal('miami-driver@muber.com')
            done()
          })
      })
      .catch(err => done(err))
  })

})
