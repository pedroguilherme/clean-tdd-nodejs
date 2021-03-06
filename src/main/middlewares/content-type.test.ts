import supertest from 'supertest'
import app from '@/main/config/app'

describe('Content Type Middleware', function () {
  test('Should return default content type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })
    await supertest(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })
  test('Should return xml when forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await supertest(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
