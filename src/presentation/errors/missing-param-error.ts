export class MissingParamError extends Error {
    constructor(paramName: string){
        super(`Missigin param ${paramName}`)
        this.name = 'MissingParamError'
    }
}