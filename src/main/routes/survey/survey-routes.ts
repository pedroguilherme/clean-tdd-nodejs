import { Router } from 'express'
import { expressRouteAdapter } from '../../adapters/express-route-adapter'
import { makeAddSurveyController } from '../../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeAuthMiddleware } from '../../factories/middlewares/add-survey-controller-factory'
import { expressMiddlewareAdapter } from '../../adapters/express-middleware-adapter'
import { makeLoadSurveyController } from '../../factories/controllers/survey/load-survey/load-survey-controller-factory'

export default (router: Router): void => {
  const adminAuth = expressMiddlewareAdapter(makeAuthMiddleware('admin'))
  const auth = expressMiddlewareAdapter(makeAuthMiddleware(''))
  router.post('/surveys', adminAuth, expressRouteAdapter(makeAddSurveyController()))
  router.get('/surveys', auth, expressRouteAdapter(makeLoadSurveyController()))
}
