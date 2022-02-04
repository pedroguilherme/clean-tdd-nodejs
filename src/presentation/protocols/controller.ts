import { HttpRequest, HttpResponse } from './http'

export interface Controller<T> {
  handle (httpRequest: HttpRequest<T>): HttpResponse<T>
}
