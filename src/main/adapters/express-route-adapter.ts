import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request, Response } from 'express'

export const expressRouteAdapter = (controller: Controller) => {
  return (req: Request, res: Response): void => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    void controller.handle(httpRequest).then(httpResponse => {
      const errorsCode = /^[4,5]\d{2}$/
      if (errorsCode.test(httpResponse.statusCode.toString())) {
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
