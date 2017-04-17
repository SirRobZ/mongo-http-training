const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')

chai.should()
chai.use(chaiHttp)

describe('The express app', () => {
  it('handles a GET request to /api', (done) => {
    chai.request(app)
      .get('/api')
      .end((err, res) => {
        res.body.hello.should.equal('there')
        done()
      })
  })
})
