import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount } from './signup-protocols-exp'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, created, serverError } from '../../helpers/http'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const body = httpRequest.body

      if (!body || !Object.keys(body).length) {
        return badRequest(new MissingParamError('no values provided'))
      }

      // Validação dos campos
      for (const key in body) {
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

      const account = await this.addAccount.add({
        name: body.name,
        email: body.email,
        password: body.password
      })

      return created(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
