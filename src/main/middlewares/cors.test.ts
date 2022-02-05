import supertest from 'supertest'
import app from '../config/app'

describe('CORS Middleware', function () {
  test('Should enable cors', async () => {
    app.get('/test_cors', (req, res) => {
      res.send()
    })
    await supertest(app)
      .get('/test_body_parser')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*')
  })
})
