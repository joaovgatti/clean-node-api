import {MongoHelper} from "../helpers/mongo-helper";
import {AccountMongoRepository} from "./account-mongo-repository";
import {Collection} from "mongodb";

let accountCollection: Collection

describe('Account Mongo Repository',() => {

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
    test('should update the account accessToken on updateAccessToken success',async () => {
        const sut = makeSut()
        const res = await accountCollection.insertOne({
            name:'any_name',
            email:'any_mail@mail.com',
            password:'any_password'
        })
        expect(res.ops[0].accessToken).toBeFalsy()
        await sut.updateAccessToken(res.ops[0]._id,'any_token')
        const account = await accountCollection.findOne({_id:res.ops[0]._id})
        expect(account).toBeTruthy()
        expect(account.accessToken).toBe('any_token')

    })

    test('should return an account on loadByToken without role  success',async () => {
          const sut = makeSut()
          await accountCollection.insertOne({
              name:'any_name',
              email:'any_email@mail.com',
              password:'any_password',
              accessToken:'any_token'
          })
          const account = await sut.loadByToken('any_token')
          expect(account).toBeTruthy()
          expect(account.id).toBeTruthy()
          expect(account.name).toBe('any_name')
          expect(account.email).toBe('any_email@mail.com')
          expect(account.password).toBe('any_password')
    })

    test('should return an account on loadByToken with role success',async () => {
        const sut = makeSut()
        await accountCollection.insertOne({
            name:'any_name',
            email:'any_email@mail.com',
            password:'any_password',
            accessToken:'any_token',
            role:'any_role'
        })
        const account = await sut.loadByToken('any_token','any_role')
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe('any_name')
        expect(account.email).toBe('any_email@mail.com')
        expect(account.password).toBe('any_password')
    })

    test('should return null if loadByToken fails',async () => {
        const sut = makeSut()
        const account = await sut.loadByToken('any_token')
        expect(account).toBeFalsy()
    })

})



















