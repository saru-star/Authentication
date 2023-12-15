const express= require('express')
const app=express()
const uuid=require('uuid')
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const users=[
    {
        id:1,
        username:'jonas'
    }
]

const sessions={}

app.use(bodyParser.json())
app.use(cookieParser())

app.get('/',(req,res)=>{
    const sessionToken=req.cookies['session_token']
    if(!sessionToken){
        return res.status(401);
    }
    const currentSession=sessions[sessionToken]
    if(!currentSession){
        return res.status(401);
    }
    if(currentSession.expiresAt<new Date()){
        return res.status(401);
    }
    const currentUser=users.find((user)=> user.id==currentSession.userid)
    console.log(currentUser)
    res.status(200).send(`hello ${currentUser.username}`)
})

app.post('/login',(req,res)=>{
    const user=users.find((user)=> user.username===req.body.username)

    if(!user || req.body.password!='abc'){
        return res.sendStatus(422).json({error:"incorrect email or password"})
    }

    const sessionToken=uuid.v4();
    const expiresAt=new Date().setFullYear(new Date().getFullYear()+1)
    sessions[sessionToken]={
        expiresAt,
        userid:user.id,
    }

    res.cookie('session_token',sessionToken,{maxAge:expiresAt})

    res.send(user)
})

app.listen(4000)
