const path = require('path');
const server = require(path.join(__dirname, '../../', '/src/server.js'));
const request = require('supertest');

const testData = {
  email: "admin@tealbook.com",
  password: "password"
};

describe('Test /login route', function () {
  it('Success Login', function (done) {
    const payload = { ...testData };
    request(server)
      .post('/login')
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('jwt');
        return done();
       });
  });
  it('Fail Login', function (done) {
    const payload = { email: 'wrong@site.com', password: 'wrong' };
    request(server)
      .post('/login')
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function (err) {
        if (err) return done(err);
        return done();
      });
  });
});

afterAll(async () => {
  // close DB connection here
});