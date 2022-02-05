import { HttpResponse } from '../protocols'
import { ServerError } from '../errors'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverRequest = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
