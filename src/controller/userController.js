const usermodel=require('../model/userModel.js')
const objectId=require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')



const isValid = function (value) {
    if (typeof value == 'undefined' || value === null) return false
    if (typeof value == 'string' && value.trim().length === 0) return false
    return true
}

const titleValid = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1

}

const createUser= async function (req,res){
    try{

        const data=req.body

        const {title,fullname,email,password}=data;

        if(Object.keys(data)==0){
            return res.status(400).send({status:false,msg:"please enter some data to create user"})
        }
        if(!isValid(title)){ return res.status(400).send({status:false,msg:"please enter the title ('Mr', 'Mrs', 'Miss')"})}

        if (!titleValid(title.trim())) {
            return res.status(400).send({ status: false, msg: "please Enter valid title ('Mr', 'Mrs', 'Miss')" })
        }

        if(!isValid(fullname)){ return res.status(400).send({status:false,msg:"please enter the fullname"})}

        
        if(!isValid(email)){ return res.status(400).send({status:false,msg:"please enter the email"})}

        if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, message: "Please provide valid Email Address" });
        }
        if(!isValid(password.trim())){ return res.status(400).send({status:false,msg:"please enter the password"})}

        

        if(password.length <8||password.length >16 ){
        return res.status(400).send({status:false, msg:" please the password to maximum 8 and minum:16"})}

        const salt = await bcrypt.genSalt(13);
        const encryptedPassword = await bcrypt.hash(password, salt);


        const createdata={
                title:title,
                fullname:fullname,
                email:email,
                password:encryptedPassword,
                
        }

        const createUsers=await usermodel.create(createdata)
        return res.status(201).send({status:true,message:"create user sucessful",data:createUsers})

    }catch(error){
        return res.status(500).send({status:false,msg:error.message})
    }
} 




const createlogin = async function(req,res){
    try{
  
      const data =req.body
  
      const {email,password}=data
  
      if(Object.keys(data)==0){
          return res.status(400).send({msg:"enter some data to create token"})
      }
  
      if(!isValid(email)){
      return res.status(400).send({msg:"enter the email create token"})
  
      }

      
      if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
        return res.status(400).send({ status: false, message: "Please provide valid Email Address" });
    }
  
      const emails=await usermodel.findOne({email:email})
      if(!emails){
          return res.status(404).send({msg:"email not found enter valid email"})
      }
      if(!isValid(password)){
          return res.status(400).send({msg:"enter the password create token"})
  
          }
  
  
          if(password.length <8||password.length >16 ){return res.status(400).send({status:false, msg:" please the password to maximum 8 and minum:16"})}
  
  
      const isPasswordMatching = await bcrypt.compare(
              password,
              emails.password
          );
  
       if(!isPasswordMatching ){
          return res.status(404).send({msg:"password incorrect"})
       }   
  
  
      const payload={userId:emails._id}
      const expriy={expiresIn:"1days"}
      const secret= "ashok"
  
      
  
      const token=jwt.sign(payload,secret,expriy);
      //console.log(token)
     //res.header("x-api-key",token);
      //res.cookie("user.id", token)
      res.cookie("x-api-key", token)

      const update = await usermodel.findOneAndUpdate({_id:payload.userId},{$set:{resetLink:token}},{new:true})
      
  
      return res.status(200).send({ status: true, message: "login successful", data: token });
     
     
//       return res
//       .cookie("access_token", Token, {
//         httpOnly: true,
//       })
//       .status(200)
//       .json({
//         message: "Logged in successfully",
//         data: { userId: User._id, token: Token },
//       });
//   } else
//     return res.status(400).json({ status: false, Msg: "Invalid password" });
// }

      

  
    }catch(error){
      return res.status(500).send({status:false,msg:error.message})
    }
  }

  const logout = (req, res) => {
    return res
      .clearCookie("x-api-key")
      .status(200)
      .send({ message: "Successfully logged out" });
  };


  const updatepassword = async function(req,res){
    try{
  
      const data =req.body
  
      const {email,password,newpassword}=data
      //const updates = {};
  
      if(Object.keys(data)==0){
          return res.status(400).send({msg:"enter some data to create token"})
      }
  
      if(!isValid(email)){
      return res.status(400).send({msg:"enter the email create token"})
  
      }

      
      if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
        return res.status(400).send({ status: false, message: "Please provide valid Email Address" });
    }
  
      const emails=await usermodel.findOne({email:email,isDeleted:false})
      if(!emails){
          return res.status(404).send({msg:"email not found enter valid email"})
      }
      if(!isValid(password)){
          return res.status(400).send({msg:"enter the password create token"})
  
          }
  
  
          if(password.length <8||password.length >16 ){return res.status(400).send({status:false, msg:" please the password to maximum 8 and minum:16"})}
  
  
      const isPasswordMatching = await bcrypt.compare(
              password,
              emails.password
          );
  
       if(!isPasswordMatching ){
          return res.status(404).send({msg:"password incorrect"})
       }   

       
       if(!isValid(newpassword)){
        return res.status(400).send({msg:"enter the password update password"})

        }


        if(newpassword.length <8||newpassword.length >16 ){return res.status(400).send({status:false, msg:" please the password to maximum 8 and minum:16"})}


        const salt = await bcrypt.genSalt(13);
        const encryptedPassword = await bcrypt.hash(newpassword, salt);


        //updates["encryptedPassword"] = encryptedPassword;
        

        const updatedpasswords=
        await usermodel.findOneAndUpdate({email:email, isDeleted:false},{$set:{password: encryptedPassword}},{ new: true })
        return res.status(201).send({status:true,message:'update password is sucessful',data:updatedpasswords})
       
       
         
       
       
    }catch(error){
        return res.status(500).send({status:false,msg:error.message})
      }
    }

    

      const otpforReset = async function(req, res){
        try{
            const requestBody= req.body
    
            if(Object.keys(requestBody)==0){
                return res.status(400).send({ status: false, msg: "emailid  is  missing" })
              }
      
          let email = req.body.email
    
    
          if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "email is required" })
          }
    
          let user = await usermodel.findOne({ email:email })
          if (!user) {
            return res.status(404).send({ status: false, message: "email not found" })
    }
    
    
    const payload={userId:user._id}
    const expriy={expiresIn:"1days"}
    const secret= "ashok"

    

    const token=jwt.sign(payload,secret,expriy);
    
      
    
          res.status(200).send({ status: true, data: { message:"token send successfully", token: token } })
          
    
        }catch(err){
            return res.status(500).send({status:false,msg:error.message})
    
        }
      }


    const resetLink=async function(req,res){
        try{

            const data=req.body

            const{token,password}=data
          
          const tokens = jwt.verify(token, "ashok");
          const user=tokens.userId
          const check=await usermodel.findOne({_id:user})
      
          if(!check){
            return res.status(404).send({status:false,msg:'user not found'})
          }
          const newpassword=await usermodel.findOneAndUpdate({_id:check},{set:{password:password}},{new:true})

          return res.status(200).send({status:true,msg:'new password update sucessfully',data:newpassword})

        }catch(error){
            return res.status(500).send({status:false,msg:error.message})
        }
    }






module.exports={createUser,createlogin,updatepassword,logout, otpforReset,resetLink}