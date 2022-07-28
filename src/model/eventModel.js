const mongoose=require('mongoose')
const usermodel=require('../model/userModel.js')
const objectId=mongoose.Schema.Types.ObjectId

const eventSchema=new mongoose.Schema({
    
    UserId:{
        type:objectId,
        ref:'users',
        required:[true,'please enter the userId'],
        trim:true,
    },
    eventname:{
        type:String,
        requred:[true,'please enter the eventname "'],
        trim:true,
    },
    discription:{
        type:String,
        required:[true,'please enter the discription'],
        trim:true,
    },
    eventDate:{
        type:Date,
        default:Date.now(),
        required:[true,'please enter the date'],
        trim:true,
    },
    
    invites_send:{
        type:objectId,
        ref:'users'
    },
    
    time:{
        type:String,
        default:"00.00",
    },
    //invites:[{invite:objectId,ref:'users',invitedAt:{timestamps:true}}],
    

    // createdAt:{
    //     type:Date,
    //     default:Date.now(),
    // },

    isDeleted:{
        type:Boolean,
        default:false

    },
},
{timestamps:true

})
module.exports= mongoose.model('event',eventSchema)
