import { SignUpController } from './signup'

describe('SignUp Controller',()=>{
    test('Should return 400 if no name is provided',()=>{
        //criar um system under test
        const sut = new SignUpController()
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
    })
})