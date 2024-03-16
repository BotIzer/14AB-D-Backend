const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('../../index.js')
const User = require('../../models/userModel.js')
chai.use(chaiHttp)

describe("/chat controller's tests", () => {
    let userToken
    before((done) => {
        User.deleteMany({}).then(() => {
            chai.request(server)
                .post('/register')
                .send({
                    username: 'randomTestUser',
                    email: 'randomTestUser@randomTestUser.com',
                    password: 'StrongTestPassword1234!',
                })
                .then((res) => {
                    chai.request(server)
                        .post('/register')
                        .send({
                            username: 'otherTestUser',
                            email: 'otherTestUser@otherTestUser.com',
                            password: 'StrongTestPassword1234!',
                        })
                        .then((res) => {
                            chai.request(server)
                                .post('/login')
                                .send({
                                    email: 'randomTestUser@randomTestUser.com',
                                    password: 'StrongTestPassword1234!',
                                })
                                .end((err, res) => {
                                    userToken = res.body.token
                                    done()
                                })
                        })
                })
        })
    })
    describe('/chats route test', () => {
        it('should return with 200 statuscode an empty array', (done) => {
            chai.request(server)
                .get('/chats')
                .set({
                    authorization: 'Bearer ' + userToken,
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property('returnArray')
                    expect(res.body.returnArray).to.be.a('array').that.is.empty
                    done()
                })
        })
    })
    // describe('/chat POST route test', () => {
    //     it("should return with 201 statuscode and with the chat's id", (done) => {
    //         chai.request(server)
    //             .post('/chat')
    //             .set({
    //                 authorization: 'Bearer' + userToken,
    //             })
    //             .send({
    //                 name: 'randomTestChat',
    //                 is_ttl: false,
    //                 is_private: true,
    //                 usernames: ['otherTestUser'],
    //             })
    //             .end((err, res) => {
    //                 console.log(res.body)
    //                 res.should.have.status(201)
    //                 // res.body.should.have.property('roomId')
    //                 done()
    //             })
    //     })
    // })
})
