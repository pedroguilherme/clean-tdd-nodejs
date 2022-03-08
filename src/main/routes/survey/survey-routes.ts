import { Router } from 'express'
import { expressRouteAdapter } from '@/main/adapters/express-route-adapter'
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveyController } from '@/main/factories/controllers/survey/load-survey/load-survey-controller-factory'
import { adminAuth, auth } from '@/main/middlewares/auth'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, expressRouteAdapter(makeAddSurveyController()))
  router.get('/surveys', auth, expressRouteAdapter(makeLoadSurveyController()))
}
