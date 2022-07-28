const express=require('express')
const app= express();
const mongoose =require('mongoose')
const route=require('./route/route.js')

const bodyparser=require('body-parser')



app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}))



mongoose.connect("mongodb+srv://ratneshnath:RATNESh99@cluster0.x9keh.mongodb.net/myFirstsss?retryWrites=true&w=majority",
{
 useNewUrlParser:true
})

.then(()=>console.log('mongodb is connected'))
.catch(err=>console.log(err))


app.use('/',route)

app.listen(process.env.Port||3000,function(){
    console.log('express is running on port '+(process.env.Port||3000))
})

