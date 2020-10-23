import request from 'supertest'
import app from "../config/app";
import {MongoHelper} from "../../infra/db/mongodb/helpers/mongo-helper";
import {Collection} from "mongodb";



let SurveyCollection: Collection

describe('Login Routes',() => {

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        SurveyCollection = await MongoHelper.getCollection('surveys')
        await SurveyCollection.deleteMany({})
    })


    describe('POST /surveys',() => {
        test('should return 204 on addSurvey success', async () => {
               request(app)
                .post('/api/surveys')
                .send({
                   question:'question',
                   answers: [{
                        answers:'answer 1',
                        image:'image'
                   },{
                       answers: 'answers 2'
                   }]
                })
                .expect(204)
        })
        test('should return 403 on addSurvey success', async () => {

                request(app)
                .post('/api/surveys')
                .send({
                    question:'question',
                    answers: [{
                        answers:'answer 1',
                        image:'image'
                    },{
                        answers: 'answers 2'
                    }]
                })
                .expect(403)
        })

    })
})