const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('../../index.js')
chai.use(chaiHttp)
const User = require('../../models/userModel.js')
const Forum = require('../../models/forumModel.js')

describe('forumController tests', () => {
    let userToken
    let otherUserToken
    let forumId
    before(async () => {
        await User.deleteMany({})
        await Forum.deleteMany({})
        await chai.request(server).post('/register').send({
            username: 'randomTestUser',
            email: 'randomTestUser@randomTestUser.com',
            password: 'StrongTestPassword1234!',
        })
        const loginRes = await chai.request(server).post('/login').send({
            email: 'randomTestUser@randomTestUser.com',
            password: 'StrongTestPassword1234!',
        })
        userToken = loginRes.body.token
        await chai.request(server).post('/register').send({
            username: 'otherTestUser',
            email: 'otherTestUser@otherTestUser.com',
            password: 'StrongTestPassword1234!',
        })
        const otherLoginRes = await chai.request(server).post('/login').send({
            email: 'otherTestUser@otherTestUser.com',
            password: 'StrongTestPassword1234!',
        })
        otherUserToken = otherLoginRes.body.token
    })
    describe('/forum GET route tests while the DB is empty', () => {
        it('should return with 200 status code and an empty array', (done) => {
            chai.request(server)
                .get('/forum')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.an('array').and.is.empty
                    done()
                })
        })
    })
    describe('/forum POST route tests', () => {
        it('should return with 400 status code and an error message', (done) => {
            chai.request(server)
                .post('/forum')
                .set({ authorization: 'Bearer ' + userToken })
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be
                        .an('object')
                        .that.has.property('message')
                        .that.is.a('string')
                        .that.is.equal('Please provide a forum name')
                    done()
                })
        })
        it('should return with 201 status code and success true', (done) => {
            chai.request(server)
                .post('/forum')
                .set({ authorization: 'Bearer ' + userToken })
                .send({ forum_name: 'testForum' })
                .end((err, res) => {
                    res.should.have.status(201)
                    res.body.should.be.an('object').that.has.property('success').that.is.a('boolean').that.equals(true)
                    done()
                })
        })
    })
    describe('/forum GET route tests while the DB is not empty', () => {
        it('should return with 200 status code and an empty array', (done) => {
            chai.request(server)
                .get('/forum')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.an('array').lengthOf(1)
                    res.body[0].should.be
                        .an('object')
                        .that.has.property('forum_name')
                        .that.is.a('string')
                        .that.equals('testForum')
                    res.body[0].should.be.an('object').that.has.property('blacklist').that.is.a('array').that.is.empty
                    res.body[0].should.be.an('object').that.has.property('users').that.is.a('array').that.is.empty
                    res.body[0].should.be.an('object').that.has.property('tags').that.is.a('array').that.is.empty
                    res.body[0].should.be.an('object').that.has.property('rating').that.is.a('number').that.is.equal(0)
                    res.body[0].should.be
                        .an('object')
                        .that.has.property('_id')
                        .that.is.a('object')
                        .that.has.property('creator_id')
                    res.body[0].should.be
                        .an('object')
                        .that.has.property('_id')
                        .that.is.a('object')
                        .that.has.property('forum_id')
                    forumId = res.body[0]._id.forum_id
                    done()
                })
        })
    })
    describe('/forum/:forumId GET route tests', () => {
        it('should return with 200 status code and an array with the forum', (done) => {
            chai.request(server)
                .get('/forum/' + forumId)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.an('array').lengthOf(1)
                    done()
                })
        })
    })
    describe('/forum/getAllThreads/:forumId GET route tests while the forum has no threads', () => {
        it('should return with 200 status code and an empty array', (done) => {
            chai.request(server)
                .get('/forum/getAllThreads/' + forumId)
                .set({ authorization: 'Bearer ' + userToken })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.an('array').and.is.empty
                    done()
                })
        })
    })
    describe('/thread POST route tests', () => {
        it('should return with 201 status code', (done) => {
            chai.request(server)
                .post('/thread')
                .set({ authorization: 'Bearer ' + userToken })
                .send({ forum_name: 'testForum', name: 'testThread', images: [], content: 'Some random text' })
                .end((err, res) => {
                    res.should.have.status(201)
                    res.body.should.be.an('object').that.has.property('success').that.is.a('boolean').that.equals(true)
                    done()
                })
        })
    })
    describe('/forum/:forumId PUT update forum test', () => {
        it('should return with 200 status code and success true', (done) => {
            chai.request(server)
                .put('/forum/' + forumId)
                .set({ authorization: 'Bearer ' + userToken })
                .send({ forum_name: 'testForumUpdated', tags: ['testTag'] })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be
                        .an('object')
                        .that.has.property('message')
                        .that.is.a('string')
                        .that.equals('Forum updated')
                    done()
                })
        })
    })
    describe('/forum/:forumId GET route tests', () => {
        it('should return with 200 status code and an array with the updated forum', (done) => {
            chai.request(server)
                .get('/forum/' + forumId)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.an('array').lengthOf(1)
                    res.body[0].should.have.property('forum_name').that.is.a('string').that.equals('testForumUpdated')
                    done()
                })
        })
    })
    describe('/forum/getForumsByTag/:tag GET route tests while the forum has threads', () => {
        it('should return with 200 status code and an array with the forum', (done) => {
            chai.request(server)
                .get('/forum/getForumsByTag/testTag')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.an('array').lengthOf(1)
                    done()
                })
        })
        it('should return with 200 status code and an empty array', (done) => {
            chai.request(server)
                .get('/forum/getForumsByTag/testTagg')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.an('array').lengthOf(0)
                    done()
                })
        })
    })
    describe('/forum/ban POST route tests', () => {   
        it('should return with 200 status code and success true', (done) => {
            console.log(userToken)
            chai.request(server)
                .post('/forum/ban')
                .set({ authorization: 'Bearer' + userToken })
                .send({ forum_id: forumId, user_name: 'otherTestUser' })
                .end((err, res) => {
                    console.log(res.body)
                    done()
                })
        })
    })
    describe('forum controller tests while there is no token in the headers', () => {
        describe('/forum POST route tests', () => {
            it('should return with 401 status code and error message', (done) => {
                chai.request(server)
                    .post('/forum')
                    .set({ authorization: 'Bearer ' })
                    .send({ forum_name: 'testForum' })
                    .end((err, res) => {
                        res.should.have.status(401)
                        res.body.should.be
                            .an('object')
                            .that.has.property('message')
                            .that.is.a('string')
                            .equals('You have no permission to use path: /forum')
                        done()
                    })
            })
            it('should return with 401 status code and an error message', (done) => {
                chai.request(server)
                    .get('/forum/getAllThreads/' + forumId)
                    .set({ authorization: 'Bearer ' })
                    .end((err, res) => {
                        res.should.have.status(401)
                        res.body.should.be
                            .an('object')
                            .that.has.property('message')
                            .that.is.a('string')
                            .equals('You have no permission to use path: /forum/getAllThreads/' + forumId)
                        done()
                    })
            })
            it('should return with 401 status code and error message', (done) => {
                chai.request(server)
                    .put('/forum/' + forumId)
                    .set({ authorization: 'Bearer ' })
                    .send({ forum_name: 'testForumUpdated' })
                    .end((err, res) => {
                        res.should.have.status(401)
                        res.body.should.be
                            .an('object')
                            .that.has.property('message')
                            .that.is.a('string')
                            .equals('You have no permission to use path: /forum/' + forumId)
                        done()
                    })
            })
        })
    })
    describe('threadController tests while there is no token in the headers', () => {
        it('should return with 401 status code', (done) => {
            chai.request(server)
                .post('/thread')
                .set({ authorization: 'Bearer ' })
                .send({ forum_name: 'testForum', name: 'testThread', images: [], content: 'Some random text' })
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be
                        .an('object')
                        .that.has.property('message')
                        .that.is.a('string')
                        .equals('You have no permission to use path: /thread')
                    done()
                })
        })
    })
})
