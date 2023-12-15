require('dotenv').config()

const express=require('express')
const app=express()

const jwt=require('jsonwebtoken')
app.use(express.json())

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

app.get('/posts',authenticateToken,(req,res)=>{
    console.log(req.user)
    res.json(posts.filter(post=>post.name===req.user.username))
})



async function authenticateToken(req,res,next){
    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(' ')[1]
    if(token===null){
        return res.status(401).send("unauthorised")
    }
    const result= await jwt.verify(token,process.env.ACCESS_TOKEN)
    if(!result){
        return res.status(403).send('not permitted')
    }
    req.user=result
    
    next()
}

app.listen(5000)

