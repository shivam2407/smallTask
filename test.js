const request = require('supertest')
const app = require('./server');
const expect = require('chai').expect;

describe('USER ROUTE TESTS', function() {
    let token = null;
    it('should insert new user and than fetch the same user by id', function(done) {
        request(app)
            .post('/user/register')
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
                expect(res.body).have.property('token');
                expect(res.body.auth).equals(true);
                token=res.body.token;
                done();
            })
    });
    it('should return object of user', function(done){
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .set('x-access-token',token)
            .expect('Content-Type',/json/)
            .expect(200)
            .end(function(err,res) {
                if (err) throw err;
                expect(res.body).to.be.an('object');
                expect(res.body).does.not.have.property('password');
                done();
            })
    });
    it('should return token after login', function(done){
        request(app)
            .get('/user/login')
            .set('Accept', 'application/json')
            .send({
                email: 'shivarawat24@gmail.com',
                password: '123',
            })
            .expect('Content-Type',/json/)
            .expect(200)
            .end(function(err,res) {
                if (err) throw err;
                expect(res.body).to.be.an('object');
                expect(res.body.auth).equals(true);
                expect(res.body.token).to.be.an('string');
                done();
            })
    });
    it('should change firstName from Shivam to Luke', function(done) {
        request(app)
            .patch('/user/'+token)
            .send({
                op:"update",
                field:"firstName",
                value:"Luke"
            })
            .expect(200)
            .end(function(err,res) {
                if (err) throw err;
                expect(res.body.firstName).equals("Luke");
                done();
            })
    });
    it('should return 200 status showing succ. deletion', function(done) {
        request(app)
            .delete('/user/'+token)
            .expect(200)
            .end(function(err,res) {
                if (err) throw err;
                done();
            })
    });
});
