import { AddAccount,AddAccountModel,AccountModel,Encrypter, AddAccountRepository } from './db-add-account-protocols'


export class DbAddAccount{
    private readonly encrypter: Encrypter
    private readonly addAccountRepository: AddAccountRepository

    constructor(encrypter: Encrypter,addAccountRepostitory: AddAccountRepository){
        this.encrypter = encrypter
        this.addAccountRepository = addAccountRepostitory
    }

    async add(accountData: AddAccountModel): Promise<AccountModel>{
        const hashedPassword = await this.encrypter.encrypt(accountData.password)
        const account = this.addAccountRepository.add(Object.assign({},accountData,{password:hashedPassword}))
        return new Promise(resolve=>resolve(account))
    }
}