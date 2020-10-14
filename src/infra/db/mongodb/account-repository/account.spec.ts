import {MongoHelper} from "../helpers/mongo-helper";
import {AccountMongoRepository} from "./account";
import {Collection} from "mongodb";
import exp from "constants";



let accountCollection: Collection

describe('Account Mongo Repos itory',() => {

    beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
    await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
    }

    test('should return an account on add success',async () => {
    const sut = makeSut()
    const account = await sut.add({
        name:'any_name',
        email:'any_mail',
        password:'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_mail')
    expect(account.password).toBe('any_password')
    })

    test('should return an account on loadByEmail success',async () => {
        const sut = makeSut()
        await accountCollection.insertOne({
            name:'any_name',
            email:'any_mail@mail.com',
            password: 'any_password'
        })
        const account = await sut.loadByEmail('any_mail@mail.com')
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe('any_name')
        expect(account.email).toBe('any_mail@mail.com')
        expect(account.password).toBe('any_password')

    })

    test('should return null if loadByEmail fails',async () => {
        const sut = makeSut()
        const account = await sut.loadByEmail('any_mail@mail.com')
        expect(account).toBeFalsy()
    })

})
