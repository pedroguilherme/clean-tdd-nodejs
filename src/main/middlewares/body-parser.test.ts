import supertest from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', function () {
  test('Should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await supertest(app)
      .post('/test_body_parser')
      .send({ name: 'Pedro' })
      .expect({ name: 'Pedro' })
  })
})
