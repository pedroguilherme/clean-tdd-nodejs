import { HttpRequest, HttpResponse, Controller, EmailValidator, SignUpBody } from '../protocols'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest } from '../helpers/http'

export class SignUpController implements Controller<SignUpBody> {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {
  }

  handle (httpRequest: HttpRequest<SignUpBody>): HttpResponse {
    const body = httpRequest.body as SignUpBody
    // Validação dos campos
    let key: keyof SignUpBody
    for (key in body) {
      if (!body[key]) {
        return badRequest(new MissingParamError(key))
      }
    }
    // Validação do e-mail
    if (!this.emailValidator.isValid(body.email)) {
      return badRequest(new InvalidParamError('email'))
    }

    return {
      statusCode: 200,
      body: {}
    }
  }
}
