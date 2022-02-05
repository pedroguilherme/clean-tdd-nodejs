import supertest from 'supertest'
import app from '../config/app'

describe('SignUp Routes', function () {
  test('Should return an account on success', async () => {
    await supertest(app)
      .post('/api/signup')
      .send({
        name: 'Pedro',
        email: 'pedro@teste.com.br',
        password: '12345',
        passwordConfirmation: '12345'
      })
      .expect(200)
  })
})
