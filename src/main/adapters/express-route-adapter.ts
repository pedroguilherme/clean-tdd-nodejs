import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request, Response } from 'express'

export const expressRouteAdapter = (controller: Controller) => {
  return (req: Request, res: Response): void => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    void controller.handle(httpRequest)
      .then(httpResponse => {
        res.status(httpResponse.statusCode).json(httpResponse.body)
      })
  }
}
