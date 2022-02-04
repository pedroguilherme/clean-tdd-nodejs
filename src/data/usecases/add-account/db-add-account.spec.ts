import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

const makeEncryptStub = (): Encrypter => {
  class EncryptStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncryptStub()
}

const makeSut = (): {
  sut: DbAddAccount
  encryptStub: Encrypter
} => {
  const encryptStub = makeEncryptStub()
  const sut = new DbAddAccount(encryptStub)
  return {
    sut,
    encryptStub
  }
}

describe('DbAddAccount Usecase', function () {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encryptStub } = makeSut()
    const encryptSpy = jest.spyOn(encryptStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
