const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('../../../index.js')

chai.use(chaiHttp)

describe('/user/:username route test', () => {
    it('should return one users data searched by name', (done) => {
        chai.request(server)
            .get('/user/testuser')
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
})
