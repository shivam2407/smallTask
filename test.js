const request = require('supertest')
const app = require('./server');
const expect = require('chai').expect;

describe('USER ROUTE TESTS', function() {
    it('should return array of users', function(done){
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .expect('Content-Type',/json/)
            .expect(200)
            .end(function(err,res) {
                if (err) throw err;
                expect(res.body).to.be.an('array');
                done();
            })
    });
    it('should return an object of user', function(done) {
        request(app)
            .post('/user')
            .set('Accept','application/json')
            .send({
                firstName:'Shivam',
                lastName: 'Rawat',
            })
            .expect(200)
            .end(function(err,res) {
                if (err) throw err;
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id');
                done();
            })
    });
});
