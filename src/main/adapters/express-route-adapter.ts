import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request, Response } from 'express'

export const expressRouteAdapter = (controller: Controller) => {
  return (req: Request, res: Response): void => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    void controller.handle(httpRequest).then(httpResponse => {
      if (httpResponse.statusCode === 500) {
        res.status(httpResponse.statusCode)
          .json({
            error: httpResponse.body.message
          })
      } else {
        res.status(httpResponse.statusCode).json(httpResponse.body)
      }
    })
  }
}
