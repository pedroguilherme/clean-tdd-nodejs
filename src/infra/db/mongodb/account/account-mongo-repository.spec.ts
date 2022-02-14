import { AddAccountModel } from '../../../../domain/usecases/account/add-account'
import { MongoHelper } from '../helpers/mongodb'
import { AccountMongoRepository } from './account-mongo-repository'
import { Collection } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

const addAccountModel: AddAccountModel = {
  name: 'any_name',
  email: 'any_email@mail.com',
  password: '12345'
}

describe('Account Mongo Repository', function () {
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add(addAccountModel)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(addAccountModel.name)
    expect(account.email).toBe(addAccountModel.email)
    expect(account.password).toBe(addAccountModel.password)
  })
  test('Should return an account on loadByEmail success', async () => {
    await accountCollection.insertOne(addAccountModel)
    const sut = makeSut()
    const account = (await sut.loadByEmail('any_email@mail.com')) as AccountModel
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(addAccountModel.name)
    expect(account.email).toBe(addAccountModel.email)
    expect(account.password).toBe(addAccountModel.password)
  })
  test('Should return null if loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeNull()
  })
  test('Should update the accessToken on updateAccessToken success', async () => {
    const result = await accountCollection.insertOne(addAccountModel)
    const sut = makeSut()
    let account = await accountCollection.findOne({ _id: result.insertedId })
    expect(account?.accessToken).toBeFalsy()
    await sut.updateAccessToken(result.insertedId.toString(), 'any_token')
    account = await accountCollection.findOne({ _id: result.insertedId })
    expect(account).toBeTruthy()
    expect(account?.accessToken).toBe('any_token')
  })
  test('Should return null if updateAccessToken fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeNull()
  })
  it('Should return an account on loadByToken without role', async () => {
    await accountCollection.insertOne({
      ...addAccountModel,
      accessToken: 'any_token'
    })
    const sut = makeSut()
    const account = (await sut.loadByToken('any_token')) as AccountModel
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(addAccountModel.name)
    expect(account.email).toBe(addAccountModel.email)
    expect(account.password).toBe(addAccountModel.password)
  })
  it('Should return an account on loadByToken with role', async () => {
    await accountCollection.insertOne({
      ...addAccountModel,
      accessToken: 'any_token',
      role: 'any_role'
    })
    const sut = makeSut()
    const account = (await sut.loadByToken('any_token', 'any_role')) as AccountModel
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(addAccountModel.name)
    expect(account.email).toBe(addAccountModel.email)
    expect(account.password).toBe(addAccountModel.password)
  })
  test('Should return null if loadByToken fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByToken('any_token')
    expect(account).toBeNull()
  })
})
