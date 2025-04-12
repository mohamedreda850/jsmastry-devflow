export class RequestError extends Error{
statusCode:number;
errors?: Record<string,string[]>;
constructor(statusCode:number , message:string , errors?:Record<string,string[]>){
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    this.name = "Request Error"
}
}

export class ValidationError extends RequestError{
   constructor(fieldErrors:Record<string,string[]>){
    const message = ValidationError.formatFieldErrors(fieldErrors);
    super(400 , message ,fieldErrors)
    this.name= "Validation Error";
    this.errors = fieldErrors
   }

   static formatFieldErrors(errors:Record<string,string[]>):string{
    
    const formatedMessages = Object.entries(errors).map(([field,messages])=>{

        const fieldName = field.charAt(0).toUpperCase()+ field.slice(1)

        if(messages[0] ==="Required"){
            return `${fieldName} is required`
        }else{
            return messages.join(" and ")
        }
    })
    return formatedMessages.join(", ")
   }
}

export class NotFoundError extends RequestError{
    constructor(resourse:string){
       super(404, `${resourse} not found`)
       this.name = "NotFoundError" 
    }
}

export class ForbiddenError extends RequestError{
    constructor(message:string = "Forbidden"){
        super(403, message)
        this.name = "ForbiddenError"

    }
}

export class UnauthorizedError extends RequestError{
    constructor(message:string = "Unauthorized"){
        super(401, message)
        this.name = "UnauthorizedError"
    }
}