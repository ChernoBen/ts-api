import { SignUpController } from './signup'
import {MissingParamError} from '../errors/missing-param-error'


const makeSut = (): SignUpController =>{
    return new SignUpController()
}

describe('SignUp Controller',()=>{
    test('Should return 400 if no name is provided',()=>{
        //criar um system under test
        const sut = makeSut()
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
        const sut = makeSut()
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
})