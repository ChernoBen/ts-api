import { SignUpController } from './signup'
import {MissingParamError} from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'
import { ServerError } from '../errors/server-error'

interface SutTypes{
    sut: SignUpController
    emailValidatorStub: EmailValidator 
}
const makeSut = (): SutTypes =>{
    //EmailValidatorStub implementa o protocolo EmailValidator
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean{
            return true
        }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub)
    return {
        sut,
        emailValidatorStub
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
        class EmailValidatorStub implements EmailValidator{
            isValid(email: string): boolean{
                throw new Error()
            }
        }
        const emailValidatorStub = new EmailValidatorStub()
        const sut = new SignUpController(emailValidatorStub)
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

})