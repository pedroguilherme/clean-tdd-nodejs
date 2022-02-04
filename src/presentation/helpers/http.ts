import { HttpResponse } from '../protocols'
import { ServerError } from '../errors'

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  body: error
})

export const serverRequest = (): HttpResponse<ServerError> => ({
  statusCode: 500,
  body: new ServerError()
})
