/* eslint-disable */
const request = require('supertest');
const app = require('./server');
const expect = require('chai').expect;

describe('USER ROUTE TESTS', function() {
    let Cookies = null;
    it('should register new user and than send the Auth token in cookie', function(done) {
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
                expect(res.body).have.property('auth');
                expect(res.body.auth).equals(true);
                expect(res.header).has.property('set-cookie');
                Cookies=res.header['set-cookie'].pop().split(';')[0];
                done();
            })
    });
    it('should return object of user', function(done){
        request(app)
            .get('/user')
            .set('Cookie', [Cookies])
            .set('Accept', 'application/json')
            .expect('Content-Type',/json/)
            .expect(200)
            .end(function(err,res) {
                if (err) throw err;
                expect(res.body).to.be.an('object');
                expect(res.body).does.not.have.property('password');
                expect(res.body.firstName).equal('Shivam');
                expect(res.body.lastName).equal('Rawat');
                expect(res.body.email).equal('shivarawat24@gmail.com');
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
                expect(res.header).has.property('set-cookie');
                Cookies = res.header['set-cookie'].pop().split(';')[0];
                done();
            })
    });
    it('should return incorrect username or password', function(done){
        request(app)
            .get('/user/login')
            .set('Accept', 'application/json')
            .send({
                email: 'shivarawat24@gmail.com',
                password: '1234',
            })
            .expect('Content-Type',/json/)
            .expect(401)
            .end(function(err,res) {
                if (err) throw err;
                expect(res.body).to.be.an('object');
                expect(res.body.auth).equals(false);
                expect(res.body.message).equals('incorrect username or password')
                done();
            })
    });
    it('should return incorrect username or password', function(done){
        request(app)
            .get('/user/login')
            .set('Accept', 'application/json')
            .send({
                email: 'shivamrawat24@gmail.com',
                password: '123',
            })
            .expect('Content-Type',/json/)
            .expect(401)
            .end(function(err,res) {
                if (err) throw err;
                expect(res.body).to.be.an('object');
                expect(res.body.auth).equals(false);
                expect(res.body.message).equals('incorrect username or password')
                done();
            })
    });
    
    it('should change firstName from Shivam to Luke', function(done) {
        request(app)
            .patch('/user/')
            .set('Cookie', [Cookies])
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
    it('should return 200 status showing success deletion', function(done) {
        request(app)
            .delete('/user/')
            .set('Cookie', [Cookies])
            .expect(200)
            .end(function(err,res) {
                if (err) throw err;
                done();
            })
    });
    it('should return return status 200', function(done) {
        request(app)
            .get('/user/logout')
            .expect(200)
            .end( function(err,res) {
                if (err) throw err;
                expect(res.body.logout).equal(true);
                done();
            })
    });
});
