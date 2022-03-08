import { HttpRequest, Middleware } from '@/presentation/protocols'
import { NextFunction, Request, Response } from 'express'

export const expressMiddlewareAdapter = (middleware: Middleware) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    void middleware.handle(httpRequest).then(httpResponse => {
      if (httpResponse.statusCode === 200) {
        Object.assign(req, httpResponse.body)
        next()
      } else {
        res.status(httpResponse.statusCode).json(httpResponse.body)
      }
    })
  }
}
