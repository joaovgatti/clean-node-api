import { Router } from 'express'
import {adaptRoute} from "../adapters/express/express-route-adapter";
import {makeSignUpController} from "../factories/controllers/login/signup/signup-controller-factory";
import {makeAddSurveyController} from "../factories/controllers/survey/add-survey/add-survey-controller-factory";


export default (router: Router): void => {
        router.post('/surveys',adaptRoute(makeAddSurveyController()))

}


