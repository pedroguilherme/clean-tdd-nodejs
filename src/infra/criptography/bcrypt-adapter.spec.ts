import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashed_value'))
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adpter', function () {
  test('Should call bcrypt with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', 12)
  })
  test('Should return a hash on success', async () => {
    const sut = makeSut()
    const hashValue = await sut.encrypt('any_value')
    expect(hashValue).toEqual('hashed_value')
  })
  test('Should throw if bcrypt throw', async () => {
    const sut = new BcryptAdapter(12)
    jest.spyOn(bcrypt, 'hash')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const hashValue = sut.encrypt('any_value')
    await expect(hashValue).rejects.toThrow()
  })
})
