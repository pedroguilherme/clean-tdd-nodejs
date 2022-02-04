import { HttpRequest, HttpResponse, Controller, SignUp, EmailValidator, AddAccount } from './signup-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverRequest } from '../../helpers/http'

export class SignUpController implements Controller<SignUp> {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {
  }

  handle (httpRequest: HttpRequest<SignUp>): HttpResponse {
    try {
      const body = httpRequest.body as SignUp
      // Validação dos campos
      let key: keyof SignUp
      for (key in body) {
        if (!body[key]) {
          return badRequest(new MissingParamError(key))
        }
      }

      // Validação de senhas iguais
      if (body.password !== body.passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      // Validação do e-mail
      if (!this.emailValidator.isValid(body.email)) {
        return badRequest(new InvalidParamError('email'))
      }

      this.addAccount.add({
        name: body.name,
        email: body.email,
        password: body.password
      })

      return {
        statusCode: 200,
        body: {}
      }
    } catch (error) {
      return serverRequest()
    }
  }
}
