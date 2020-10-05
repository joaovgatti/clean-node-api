import request from 'supertest'
import app from "../config/app";
import {MongoHelper} from "../../infra/db/mongodb/helpers/mongo-helper";

describe('SignUp Routes',() => {

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        const accountCollection = MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    test('should return an account on success', async () => {
         request(app)
            .post('/api/signup')
            .send({
                name:'joao',
                email:'joao@gmail.com',
                password:'123',
                passwordConfirmation: '123'
            })
            .expect(200)
    })
})