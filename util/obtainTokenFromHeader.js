const obtainTokenFromHeaders = (req)=>{
    const token = req?.headers['authorization']?.split(" ")[1]
    if(token){
        return token
    }
return  "There is no token in the headers"

}
export default obtainTokenFromHeaders;