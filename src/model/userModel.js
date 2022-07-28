const mongoose=require('mongoose')


const userSchema=new mongoose.Schema({
    title:{
        type:String,
        requred:[true,'please enter the title "Mr","Miss","Mrs"'],
        enum:["Mr","Miss","Mrs"],
        trim:true,
    },

    fullname:{
        type:String,
        required:[true,'please enter the full name'],
        trim:true,
    },

    email:{
        type:String,
        required:[true,'please enter the email-id'],
        trim:true,
    },
    password:{
        type:String,
        // minlength:[8,'plese enter eight no of password'],
        // maxlength:[15,'only enter the password less than fifteen'],
        required:[true,'please enter the password'],
        trim:true,
    },
    
    eventdetail:{
        type:[],
        default:[]
    },


    isDeleted:{
        type:Boolean,
        default:false

    },
    
    resetLink:{
        data:String,
        default:'',
    },

},
{timestamps:true

})
module.exports= mongoose.model('users',userSchema)

