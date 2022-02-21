import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'
import env from '../../../main/config/env'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashed_value'))
  },

  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const salt = env.salt

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', function () {
  test('Should call hash with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
  test('Should return a valid hash on hash success', async () => {
    const sut = makeSut()
    const hashValue = await sut.hash('any_value')
    expect(hashValue).toEqual('hashed_value')
  })
  test('Should throw if hash bcrypt throw', async () => {
    const sut = new BcryptAdapter(salt)
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
  test('Should return true if compare succeeds', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(true)
  })
  test('Should return false on compare fails', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(
      () => {
        return false
      }
    )
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBe(false)
  })
  test('Should throw if compare bcrypt throw', async () => {
    const sut = new BcryptAdapter(salt)
    jest.spyOn(bcrypt, 'compare')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const hashValue = sut.compare('any_value', 'any_hash')
    await expect(hashValue).rejects.toThrow()
  })
})
