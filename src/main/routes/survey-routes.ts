import { Router } from 'express'
import {adaptRoute} from "../adapters/express/express-route-adapter";
import {makeSignUpController} from "../factories/controllers/login/signup/signup-controller-factory";
import {makeAddSurveyController} from "../factories/controllers/survey/add-survey/add-survey-controller-factory";
import {makeAuthMiddleware} from "../factories/middlewares/auth-middleare-factory";
import {adaptMiddleware} from "../adapters/express/express-middleware-adapter";


export default (router: Router): void => {
        const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
        router.post('/surveys',adminAuth,adaptRoute(makeAddSurveyController()))

}


