export async function register(req,res,next) {
    // try{
    //     console.log(user);
    // }catch(err){
    //     err.status = 409
    //     next(err)
    // }
        res.status(201).json({
        message: "User registered successfully"
    })
}