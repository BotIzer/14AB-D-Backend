const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('../../../index.js')
const User = require('../../../models/userModel.js')

chai.use(chaiHttp)

before((done) => {
    User.deleteMany({}).then(() => {
        done()
    })
})

let userToken

describe('/register route test with valid data', () => {
    it('should return with 201 statuscode and a token', (done) => {
        chai.request(server)
            .post('/register')
            .send({
                username: 'randomTestUser',
                email: 'randomTestUser@randomTestUser.com',
                password: 'StrongTestPassword1234!',
            })
            .end((err, res) => {
                res.should.have.status(201)
                res.body.should.be.a('object')
                res.body.should.have.property('token')
                res.body.should.have.property('success')
                expect(res.body.success).to.be.equal(true)
                done()
            })
    })
})
describe('/register route test with invalid data (user already exists)', () => {
    it('should return with 409 and error message', (done) => {
        chai.request(server)
            .post('/register')
            .send({
                username: 'randomTestUser',
                email: 'randomTestUser@randomTestUser.com',
                password: 'StrongTestPassword1234!',
            })
            .end((err, res) => {
                res.should.have.status(409)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                expect(res.body.message).to.be.equal('User already exists with: randomTestUser')
                done()
            })
    })
})
describe('/register route test with invalid data, (too long username)', () => {
    it('should return with 409 and error message', (done) => {
        chai.request(server)
            .post('/register')
            .send({
                username: 'randomTestUserrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',
                email: 'randomTestUser@randomTestUser.com',
                password: 'StrongTestPassword1234!',
            })
            .end((err, res) => {
                res.should.have.status(409)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                expect(res.body.message).to.be.equal('Username is too long')
                done()
            })
    })
})
describe('/register route test with invalid data, (too short username)', () => {
    it('should return with 409 and error message', (done) => {
        chai.request(server)
            .post('/register')
            .send({
                username: 'r',
                email: 'randomTestUser@randomTestUser.com',
                password: 'StrongTestPassword1234!',
            })
            .end((err, res) => {
                res.should.have.status(409)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                expect(res.body.message).to.be.equal('Username is too short')
                done()
            })
    })
})
describe('/register route test with invalid data, (invalid username)', () => {
    it('should return with 409 and error message', (done) => {
        chai.request(server)
            .post('/register')
            .send({
                username: 'deletedUser',
                email: 'randomTestUser@randomTestUser.com',
                password: 'StrongTestPassword1234!',
            })
            .end((err, res) => {
                res.should.have.status(409)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                expect(res.body.message).to.be.equal('You cannot register with deletedUser username')
                done()
            })
    })
})
describe('/register route test with invalid data, (invalid username)', () => {
    it('should return with 409 and error message', (done) => {
        chai.request(server)
            .post('/register')
            .send({
                username: 'deletedUser_1',
                email: 'randomTestUser@randomTestUser.com',
                password: 'StrongTestPassword1234!',
            })
            .end((err, res) => {
                res.should.have.status(409)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                expect(res.body.message).to.be.equal('You cannot register with deletedUser username')
                done()
            })
    })
})
describe('/user/:username route test with an invalid username', () => {
    it("should return with 404 statuscode and 'No user found with: testuser' error message", (done) => {
        chai.request(server)
            .get('/user/testuser')
            .end((err, res) => {
                res.should.have.status(404)
                res.body.should.be.a('object')
                const message = res.body.message
                expect(message).to.be.equal('No user found with: testuser')
                done()
            })
    })
})
describe('/user/:username route test with a valid username', () => {
    it('should return with 200 statuscode and the properties of that specific user', (done) => {
        chai.request(server)
            .get('/user/randomTestUser')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('user')
                res.body.user.should.have.property('chats')
                res.body.user.should.have.property('profile_image')
                res.body.user.should.have.property('custom_ui')
                res.body.user.should.have.property('roles')
                res.body.user.should.have.property('username')
                res.body.user.should.have.property('friends')
                res.body.user.should.have.property('friend_requests')
                res.body.user.should.have.property('sent_friend_requests')
                res.body.user.should.have.property('hobbies')
                res.body.user.should.have.property('notifications')
                res.body.user.should.have.property('created_at')
                expect(res.body.user.username).to.be.a('string')
                expect(res.body.user.username).to.be.equal('randomTestUser')
                expect(res.body.user.chats).to.be.a('array').that.is.empty
                expect(res.body.user.profile_image).to.be.a('string')
                expect(res.body.user.profile_image).to.be.equal('default')
                expect(res.body.user.custom_ui).to.be.a('boolean')
                expect(res.body.user.custom_ui).to.be.equal(false)
                expect(res.body.user.roles).to.be.a('string')
                expect(res.body.user.roles).to.be.equal('user')
                expect(res.body.user.friends).to.be.a('array').that.is.empty
                expect(res.body.user.friend_requests).to.be.a('array').that.is.empty
                expect(res.body.user.sent_friend_requests).to.be.a('array').that.is.empty
                expect(res.body.user.hobbies).to.be.a('array').that.is.empty
                expect(res.body.user.notifications).to.be.a('array').that.is.empty
                expect(res.body.user.created_at).to.be.a('string')
                done()
            })
    })
})
describe('/login route with invalid credentials', () => {
    it('should return with 401 and error message', (done) => {
        chai.request(server)
            .post('/login')
            .send({
                username: 'sanyiiiii',
                password: 'iNVALIDpASSWORD4312!',
            })
            .end((err, res) => {
                res.should.have.status(401)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                expect(res.body.message).to.be.equal('Email or password is wrong!')
                done()
            })
    })
})
describe('/login route with valid credentials', () => {
    it('should return with 200 and an object with properties: success, userInfo and token', (done) => {
        chai.request(server)
            .post('/login')
            .send({
                email: 'randomTestUser@randomTestUser.com',
                password: 'StrongTestPassword1234!',
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('token')
                expect(res.body.token).to.be.a('string')
                userToken = res.body.token
                res.body.should.have.property('success')
                expect(res.body.success).to.be.equal(true)
                res.body.should.have.property('userInfo')
                res.body.userInfo.should.have.property('profile_image').that.is.a('string')
                res.body.userInfo.should.have.property('custom_ui').that.is.a('boolean')
                res.body.userInfo.should.have.property('roles').that.is.a('string')
                res.body.userInfo.should.have.property('username').that.is.a('string')
                res.body.userInfo.should.have.property('created_at').that.is.a('string')
                done()
            })
    })
})
describe('/login route when you are already logged in', () => {
    it('should return with 403 and error message', (done) => {
        chai.request(server)
            .post('/login')
            .set({
                authorization: 'Bearer fjisdfhbolgkjhsdlfkgjhsldkfjghblskdfjb',
            })
            .send({
                email: 'randomTestUser@randomTestUser.com',
                password: 'StrongTestPassword1234!',
            })
            .end((err, res) => {
                res.should.have.status(403)
                res.body.should.be.a('object')
                res.body.should.have.property('message')
                expect(res.body.message).to.be.equal('User is already logged in!')
                done()
            })
    })
})
describe('/chats route test with a valid token', () => {
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

