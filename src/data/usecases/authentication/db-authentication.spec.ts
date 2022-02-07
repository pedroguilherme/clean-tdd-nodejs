import { DbAuthentication } from './db-authentication'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-acces-token-repository'

const accountModel: AccountModel = {
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
}

const authModel: AuthenticationModel = {
  email: 'any_email@mail.com',
  password: 'any_password'
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (): Promise<AccountModel | null> {
      const account: AccountModel = accountModel
      return await new Promise<AccountModel>(resolve => resolve(account))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return true
    }
  }

  return new HashComparerStub()
}

const makeTokenGenaretor = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (value: string): Promise<string> {
      return 'any_token'
    }
  }

  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

const makeSut = (): {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
} => {
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenaretor()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase', function () {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(authModel)
    expect(loadSpy).toHaveBeenCalledWith(authModel.email)
  })
  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const accessToken = sut.auth(authModel)
    await expect(accessToken).rejects.toThrow(new Error())
  })
  it('should return if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const accessToken = await sut.auth(authModel)
    expect(accessToken).toBeNull()
  })
  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(authModel)
    expect(compareSpy).toHaveBeenCalledWith(authModel.password, accountModel.password)
  })
  it('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const accessToken = sut.auth(authModel)
    await expect(accessToken).rejects.toThrow(new Error())
  })
  it('should return if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const accessToken = await sut.auth(authModel)
    expect(accessToken).toBeNull()
  })
  it('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(authModel)
    expect(generateSpy).toHaveBeenCalledWith(accountModel.id)
  })
  it('should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const accessToken = sut.auth(authModel)
    await expect(accessToken).rejects.toThrow(new Error())
  })
  it('should call TokenGenerator with correct id', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(authModel)
    expect(accessToken).toBe('any_token')
  })
  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(authModel)
    expect(updateSpy).toHaveBeenCalledWith(accountModel.id, 'any_token')
  })
  it('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const accessToken = sut.auth(authModel)
    await expect(accessToken).rejects.toThrow(new Error())
  })
})
