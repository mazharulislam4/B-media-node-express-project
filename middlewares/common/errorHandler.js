import createHttpError from "http-errors";


// not fund route 
export function notFoundHandler( req , res , next){
    next(createHttpError(404 , 'Your requested content was not found!'))
}


export function errorHandler(err , req , res , next){
     console.log(err);
 if(res.headersSet) next(err)
 res.status(err.status || 500).json({error: true, msg:err.message , errorObject: err})
}