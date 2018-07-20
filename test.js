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
    let userId = null;
    it('should insert new user and than fetch the same user by id', function(done) {
        request(app)
            .post('/user')
            .set('Accept','application/json')
            .send({
                firstName:'Shivam',
                lastName: 'Rawat',
                email:'shivarawat24@gmail.com',
                password: '123',
            })
            .expect(200)
            .end(function(err,res) {
                expect(res.body).to.be.an('object');
                userId=res.body._id;
                done();
            })
    });
    it('should return new created user', function(done) {
                request(app)
                .get('/user/'+userId)
                .set('Accept','application/json')
                .expect(200)
                .end(function(err,res) {
                    if (err) throw err;
                    expect(res.body).to.be.an('object');
                    expect(res.body.firstName).eqls('Shivam');
                    done();
                })
    });
    it('should return 200 status showing succ. deletion', function(done) {
        request(app)
            .delete('/user/'+userId)
            .expect(200)
            .end(function(err,res) {
                if (err) throw err;
                done();
            })
    });
});
