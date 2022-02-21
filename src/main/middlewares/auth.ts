import { expressMiddlewareAdapter } from '../adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/add-survey-controller-factory'

export const auth = expressMiddlewareAdapter(makeAuthMiddleware())
export const adminAuth = expressMiddlewareAdapter(makeAuthMiddleware('admin'))
