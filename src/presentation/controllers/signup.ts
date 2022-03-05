import { badRequest,serverError } from '../helpers/http-helper'
import { Controller,EmailValidator,HttpRequest,HttpResponse} from '../protocols'
import { MissingParamError,InvalidParamError } from '../errors'
export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator
    constructor(emailValidator: EmailValidator){
        this.emailValidator = emailValidator
    }
    handle(httpRequest: HttpRequest): HttpResponse{
        const requiredFields = ['name','email']
        try{
            for(const field of requiredFields){
                if(!httpRequest.body[field]){
                    return badRequest(new MissingParamError(field))
                }
            }
            const isValid = this.emailValidator.isValid(httpRequest.body.email)
            if(!isValid){
                return badRequest(new InvalidParamError('email'))
            }
        }catch(error){
            return serverError()
        }
    }
}