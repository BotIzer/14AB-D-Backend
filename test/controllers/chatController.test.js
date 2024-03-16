const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('../../index.js')
const User = require('../../models/userModel.js')

chai.use(chaiHttp)

describe("/chat controller's tests", () => {
    let userToken

    beforeEach(async () => {
        await User.deleteMany({})
        await chai.request(server).post('/register').send({
            username: 'randomTestUser',
            email: 'randomTestUser@randomTestUser.com',
            password: 'StrongTestPassword1234!',
        })
        await chai.request(server).post('/register').send({
            username: 'otherTestUser',
            email: 'otherTestUser@otherTestUser.com',
            password: 'StrongTestPassword1234!',
        })
        const loginRes = await chai.request(server).post('/login').send({
            email: 'randomTestUser@randomTestUser.com',
            password: 'StrongTestPassword1234!',
        })
        userToken = loginRes.body.token
    })

    describe('/chats route test', () => {
        it('should return with 200 status code and an empty array', async () => {
            const res = await chai
                .request(server)
                .get('/chats')
                .set({
                    authorization: 'Bearer ' + userToken,
                })

            res.should.have.status(200)
            res.body.should.have.property('returnArray').that.is.an('array').and.is.empty
        })
    })

    describe('/chat POST route test', () => {
        it("should return with 201 status code and the chat's id", async () => {
            const res = await chai
                .request(server)
                .post('/chat')
                .set({
                    authorization: 'Bearer ' + userToken,
                })
                .send({
                    name: 'randomTestChat',
                    is_ttl: false,
                    is_private: true,
                    usernames: ['otherTestUser'],
                })
            res.should.have.status(201)
            res.body.should.have.property('roomId')
        })
    })
})
