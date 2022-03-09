import { SignUpController } from './signup'
import { EmailValidator, AddAccount, AddAccountModel,AccountModel } from './signup-protocol'
import { MissingParamError,InvalidParamError, ServerError } from '../../errors'

interface SutTypes{
    sut: SignUpController
    emailValidatorStub: EmailValidator
    addAccountStub: AddAccount
}
const makeEmailValidator =  (): EmailValidator=>{
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean{
            return true
        }
    }
    return new EmailValidatorStub()
}
const makeAddAccount = (): AddAccount =>{
    class AddAccountStub implements AddAccount{
        add(account: AddAccountModel): AccountModel{
            const fakeAccount = {
                id:'valid_id',
                name:'valid_name',
                email: 'valid_email@email.com',
                password: 'valid_password'
            }
            return fakeAccount
        }
    }
    return new AddAccountStub()
}

const makeEmailValidatorWithError = (): EmailValidator=>{
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean{
            throw new Error()
        }
    }
    return new EmailValidatorStub()
}

const makeSut = (): SutTypes =>{
    //EmailValidatorStub implementa o protocolo EmailValidator
    const emailValidatorStub  = makeEmailValidator()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorStub,addAccountStub)
    return {
        sut,
        emailValidatorStub,
        addAccountStub
    }
}

describe('SignUp Controller',()=>{
    test('Should return 400 if no name is provided',()=>{
        //criar um system under test
        const {sut} = makeSut()
        //invocar uma funcao de sut
        const httpRequest = {
            body:{
                email:"any_email@mail.com",
                password:"any_pass",
                password_confirmation:"any_pass"

            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email is provided',()=>{
        //criar um system under test
        const {sut} = makeSut()
        //invocar uma funcao de sut
        const httpRequest = {
            body:{
                name:"any_name",
                password:"any_pass",
                password_confirmation:"any_pass"

            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no email is confirmation fails',()=>{
        //criar um system under test
        const {sut} = makeSut()
        //invocar uma funcao de sut
        const httpRequest = {
            body:{
                name:"any_name",
                email:"any@email.com",
                password:"any_pass",
                password_confirmation:"invalid_password"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
    })

    test('Should return 400 if param is invalid',()=>{
        //criar um system under test
        const {sut,emailValidatorStub} = makeSut()
        //alterar o valor de retorno de uma funcao
        jest.spyOn(emailValidatorStub,'isValid').mockReturnValueOnce(false)
        //invocar uma funcao de sut
        const httpRequest = {
            body:{
                name:"any_name",
                email:"any@any.com",
                password:"any_pass",
                password_confirmation:"any_pass"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('Should call emailValidator with correct email',()=>{
        //criar um system under test
        const {sut,emailValidatorStub} = makeSut()
        //alterar o valor de retorno de uma funcao
        const isValidSpy = jest.spyOn(emailValidatorStub,'isValid').mockReturnValueOnce(false)
        //invocar uma funcao de sut
        const httpRequest = {
            body:{
                name:"any_name",
                email:"any@gmail.com",
                password:"any_pass",
                password_confirmation:"any_pass"
            }
        }
        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith('any@gmail.com')
    })

    test('Should SignupController return 500 if email validator throws',()=>{
        const {sut,emailValidatorStub} = makeSut()
        //sobrescrever um metodo existente em emailValidatorStub
        jest.spyOn(emailValidatorStub,'isValid').mockImplementationOnce(()=>{
            throw new Error()
        })
        const httpRequest = {
            body:{
                name:"any_name",
                email:"any@any.com",
                password:"any_pass",
                password_confirmation:"any_pass"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should call addAccount with correct values',()=>{
        const {sut,addAccountStub} = makeSut()
        //sobrescrever um metodo existente em emailValidatorStub
        const addSpy = jest.spyOn(addAccountStub,'add')
        const httpRequest = {
            body:{
                name:"any_name",
                email:"any@any.com",
                password:"any_pass",
                password_confirmation:"any_pass"
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith({
            name:"any_name",
            email:"any@any.com",
            password:"any_pass",
        })
    })

    test('Should return 500 if AddAccount throws',()=>{
        const {sut,addAccountStub} = makeSut()
        jest.spyOn(addAccountStub,'add').mockImplementationOnce(()=>{
            throw new Error()
        })
        const httpRequest = {
            body:{
                name:'any_name',
                email:'any_email@email.com',
                password:'any_password',
                password_confirmation:'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 200 if valid data is provided',()=>{
        const {sut} = makeSut()
        const httpRequest = {
            body: {
                name:'valid_name',
                email:'valid_email',
                password: 'valid_password',
                password_confirmation:'valid_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual({
            id:'valid_id',
            name:'valid_name',
            email:'valid_email@email.com',
            password: 'valid_password'
            
        })
    })

})