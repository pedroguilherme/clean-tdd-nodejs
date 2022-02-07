import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashed_value'))
  },

  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Aapter', function () {
  test('Should call hash with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', 12)
  })
  test('Should return a valid hash on hash success', async () => {
    const sut = makeSut()
    const hashValue = await sut.hash('any_value')
    expect(hashValue).toEqual('hashed_value')
  })
  test('Should throw if hash bcrypt throw', async () => {
    const sut = new BcryptAdapter(12)
    jest.spyOn(bcrypt, 'hash')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const hashValue = sut.hash('any_value')
    await expect(hashValue).rejects.toThrow()
  })
  test('Should call compare with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(hashSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })
})
