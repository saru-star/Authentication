require('dotenv').config()

const express=require('express')
const app=express()

const jwt=require('jsonwebtoken')
app.use(express.json())


let refreshTokens=[]
const posts=[
    {
        name:"holly",
        code:1
    },
    {
        name:"molly",
        code:2
    }
]

app.post('/token', async (req,res)=>{
    const refreshToken=req.body.token
    if(refreshToken==null) return res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    const result=await jwt.verify(refreshToken,process.env.REFRESH_TOKEN)
    console.log(result);
    if(!result){
        return res.sendStatus(403)
    }
    const accessToken=generateAccessToken({
        name:result.username
    })
    res.json({accessToken:accessToken})
})
app.delete('/logout',(req,res)=>{
    refreshTokens=refreshTokens.filter(token=> token!==req.body.token)
    res.sendStatus(204)
})

app.post('/login',(req,res)=>{
    //authenticate user
    const username=req.body.username
    const user={
        username:username
    }

    const accessToken=generateAccessToken(user)
    const refreshToken=jwt.sign(user,process.env.REFRESH_TOKEN)
    refreshTokens.push(refreshToken)

    res.json({accessToken:accessToken, refreshToken:refreshToken})
})

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn:'100s'})
    
}

app.listen(4000)



