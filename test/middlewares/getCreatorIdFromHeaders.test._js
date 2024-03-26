const getCreatorIdFromHeaders = require('../../middlewares/getCreatorIdFromHeaders')
const chai = require('chai')
const should = chai.should()
const expect = chai.expect

describe('getCreatorIdFromHeaders middleware tests', () => {
    it('should return the creator id from the headers', async () => {
        getCreatorIdFromHeaders({
            authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOiI2NWNhNTdiZjdiNGYyMjk1YzM4NWI0ZjIifQ.5bK9c8leEkGCcA73H4Okron52yS6nSdPIV7Et8yPFUA',
        }).end((err, res) => {
            expect(userId).to.equal('65ca57bf7b4f2295c385b4f2')
            done()
        })
    })
})
