import { badRequest,serverError,ok } from '../../helpers/http-helper'
import { Controller,EmailValidator,AddAccount,HttpRequest,HttpResponse} from './signup-protocol'
import { MissingParamError,InvalidParamError } from '../../errors'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount

    constructor(emailValidator: EmailValidator,addAccount: AddAccount){
        this.emailValidator = emailValidator
        this.addAccount = addAccount
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse>{
        const requiredFields = ['name','email','password','password_confirmation']
        try{
            for(const field of requiredFields){
                if(!httpRequest.body[field]){
                    return badRequest(new MissingParamError(field))
                }
            }
            const {name,email,password,password_confirmation} = httpRequest.body
            const isValid = this.emailValidator.isValid(email)
            if(!isValid){
                return badRequest(new InvalidParamError('email'))
            }
            if(password !== password_confirmation){
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }
            //fim da validacao de dados da request
            const account = await this.addAccount.add({
                name,
                email,
                password
            })
            return ok(account)
        }catch(error){
            return serverError()
        }
    }
}