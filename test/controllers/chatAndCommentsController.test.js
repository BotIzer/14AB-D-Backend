const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('../../index.js')
const User = require('../../models/userModel.js')

chai.use(chaiHttp)

describe("/chat controller's tests", () => {
    let userToken
    let chatId
    let commentId
    before(async () => {
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
            chatId = res.body.roomId
        })
    })
    describe('/chat/:chatId route test', () => {
        it("should return with 200 status code and an object with the chat's info", async () => {
            const res = await chai
                .request(server)
                .get(`/chat/${chatId}`)
                .set({
                    authorization: 'Bearer ' + userToken,
                })
            res.should.have.status(200)
            res.body.should.have.property('chat')
            res.body.chat.should.have
                .property('time_to_live')
                .that.is.a('object')
                .that.have.property('is_ttl')
                .that.is.equal(false)
            res.body.chat.should.have.property('is_private').that.is.equal(true)
            res.body.chat.should.have.property('name').that.is.equal('randomTestChat')
            res.body.chat.should.have.property('users').that.is.an('array').that.have.lengthOf(1)
            res.body.chat.should.have.property('owner').that.is.a('string').lengthOf(24)
            res.body.chat.should.have.property('common_topics').that.is.an('array').and.is.empty
        })
    })
    describe('/chat/:chatId/comments route test', () => {
        it('should return with 200 status code and an empty array', async () => {
            const res = await chai
                .request(server)
                .get(`/chat/${chatId}/comments`)
                .set({
                    authorization: 'Bearer ' + userToken,
                })
            res.should.have.status(200)
            res.body.should.have.property('comments').that.is.an('array').and.is.empty
        })
    })
    describe('/comments POST route test', () => {
        it('should return with 201 status code and', async () => {
            const res = await chai
                .request(server)
                .post('/comment')
                .set({
                    authorization: 'Bearer ' + userToken,
                })
                .send({
                    room_id: chatId,
                    text: 'randomTestComment1234',
                    is_reply: false,
                })
            res.should.have.status(201)
            res.body.should.have.property('success').that.is.a('boolean').that.is.equal(true)
        })
    })
    describe('/chat/:chatId/comments route test', () => {
        it('should return with 200 status code and an array with one comment object element', async () => {
            const res = await chai
                .request(server)
                .get(`/chat/${chatId}/comments`)
                .set({
                    authorization: 'Bearer ' + userToken,
                })
            res.should.have.status(200)
            res.body.should.have.property('comments').that.is.an('array').and.have.lengthOf(1)
            res.body.comments[0].should.have.property('text').that.is.a('string').that.is.equal('randomTestComment1234')
            res.body.comments[0].should.have.property('likes').that.is.a('number').that.is.equal(0)
            res.body.comments[0].should.have.property('dislikes').that.is.a('number').that.is.equal(0)
            res.body.comments[0].should.have
                .property('creator_name')
                .that.is.a('string')
                .that.is.equal('randomTestUser')
            res.body.comments[0].should.have
                .property('_id')
                .that.is.an('object')
                .that.have.property('room_id')
                .that.is.a('string')
                .lengthOf(24)
            res.body.comments[0].should.have
                .property('_id')
                .that.is.an('object')
                .that.have.property('message_id')
                .that.is.a('string')
                .lengthOf(24)
            res.body.comments[0].should.have
                .property('reply')
                .that.is.an('object')
                .that.have.property('is_reply')
                .that.is.a('boolean')
                .that.is.equal(false)
            res.body.comments[0].should.have
                .property('reply')
                .that.is.an('object')
                .that.have.property('parent_comment_id')
                .that.is.equal(null)
            res.body.comments[0].should.have
                .property('reply')
                .that.is.an('object')
                .that.have.property('sequential_number')
                .that.is.an('number')
                .and.is.equal(0)
                commentId = res.body.comments[0]._id.message_id
                console.log(commentId)              //COMMENTID FIX NEEDED!!!!!!
        })
    })
    describe('/comment/:commentId PATCH route test', () => {
        it('should return with 200 status code and an object with the updated comment', async () => {
            const res = await chai
                .request(server)
                .patch('/comment/' + commentId)
                .set({
                    authorization: 'Bearer ' + userToken,
                })
                .send({
                    text: 'randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345randomTestComment12345',
                })
                console.log(res.body)
        })
    })
})
