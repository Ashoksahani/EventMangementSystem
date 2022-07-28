const usermodel = require('../model/userModel.js')
const eventmodel = require('../model/eventModel.js')
const objectId = require('mongoose').Types.ObjectId;


const isValid = function (value) {
    if (typeof value == 'undefined' || value === null) return false
    if (typeof value == 'string' && value.trim().length === 0) return false
    return true
}


const createevent = async function (req, res) {
    try {
        const data = req.body

        const { UserId, eventname, discription, eventDate, invites_send,time } = data

        if(Object.keys(data)==0){
            return res.status(400).send({status:false,msg:"please enter some data to create user"})
        }

        if (!isValid(UserId)) { return res.status(400).send({ status: false, msg: "please enter the eventname" }) }

        if (!objectId.isValid(UserId)) {
            return res.status(400).send({ status: false, msg: 'enter valid userId' })
        }

        const checkuserid = await usermodel.findOne({ _id: UserId })
        if (!checkuserid) {

            return res.status(404).send({ status: false, msg: 'not found' })

        }

        if (!isValid(eventname)) { return res.status(400).send({ status: false, msg: "please enter the eventname" }) }

        if (!isValid(discription)) { return res.status(400).send({ status: false, msg: "please enter the discription" }) }

        if (!isValid(eventDate)) { return res.status(400).send({ status: false, msg: "please enter the eventDate" }) }

        if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(eventDate)) {
            return res.status(400).send({ status: false, msg: "this data format /YYYY-MM-DD/ accepted " })

        }
         
      

        if (!isValid(invites_send)) { return res.status(400).send({status:false,msg:'userid must be required'})}

        if (!objectId.isValid(invites_send)) { return res.status(400).send({ status: false, msg: "please enter the  valid invites_send id" }) }
         
        const checkuserIdPresent = await usermodel.findOne({_id:invites_send})
        if(!checkuserIdPresent){return res.status(404).send({status:false,msg:'not found userid'})}

        if (!isValid(time) ){ return res.status(400).send({status:false,msg:'time must be required'})}
        if(!/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time)){return res.status(400).send('time format like this  time:"10:00"')}
        const createsevent = await eventmodel.create(data)
        
        
        const UserIds=createsevent.UserId
        const eventnames=createsevent.eventname
        const discriptions=createsevent.discription
        const eventDates=createsevent.eventDate
        const times=createsevent.time
        const invites_sends=createsevent.invites_send
        const updated={UserIds,eventnames,discriptions,eventDates,times}
        let updateingScheuduling=
        await usermodel.findOneAndUpdate({_id:invites_sends},
            
            {$set:{eventdetail:updated}},{new:true})
       

        return res.status(201).send({ status: true, msg: 'create event sucessful', data: createsevent })


    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

const checkEventById = async function (req, res) {
    try {
        

        const userId = req.params.userId

        

        if (!isValid(userId)) {
            return res.status(400).send({ status: false, msg: "event id is required" })

        }

        if (!objectId.isValid(userId)) { return res.status(400).send({ status: false, msg: "please enter the  valid event id" }) }

        const alluserevent = await usermodel.findOne({ _id: userId }).select({eventdetail:1,_id:0})
        if (!alluserevent) {
            return res.status(200).send({ status: true, msg: 'there is no kind of data' })
        }


        return res.status(200).send({ status: true, msg: 'check the schudule details', data: alluserevent })



    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}





const getupdateevent = async function (req, res) {
    try {

        const eventId = req.params.eventId
        const  data=req.body
        
        const {UserId,eventDate,invites_send,discription,eventname}=data

        if (!isValid(UserId)) { return res.status(400).send({ status: false, msg: "please enter the userid" }) }

        if (!objectId.isValid(UserId)) {
            return res.status(400).send({ status: false, msg: 'enter valid userId' })
        }

        const checkuserid = await usermodel.findOne({ _id: UserId })
        if (!checkuserid) {

            return res.status(404).send({ status: false, msg: 'not found' })

        }
         
        if(eventDate){
        if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(eventDate)) {
            return res.status(400).send({ status: false, msg: "this data format /YYYY-MM-DD/ accepted " })
        }}
        
         if(!isValid(invites_send)){
            return res.status(400).send({status:false,msg:'should not empty'})

         }

         if (!objectId.isValid(UserId)) {
            return res.status(400).send({ status: false, msg: 'enter valid userId' })
        }

        let updateBookData = { UserId:UserId,eventname: eventname, discription: discription, eventDate: eventDate, invites_send:invites_send }
        let updated = await eventmodel.findOneAndUpdate({ _id: eventId, isDeleted: false }, { $set: updateBookData }, { new: true })
        if (!updated) {
            return res.status(404).send({ status: false, msg: "data not found " })
        }


        const UserIds=updated.UserId
        const eventnames=updated.eventname
        const discriptions=updated.discription
        const eventDates=updated.eventDate
        const times=updated.time
        const invites_sends=updated.invites_send
        const updateds={UserIds,eventnames,discriptions,eventDates,times}
        let updateingScheuduling=
        await usermodel.findOneAndUpdate({_id:invites_sends},
            
            {$set:{eventdetail:updateds}},{new:true})
        
        return res.status(200).send({ status: true, msg:'Updated sucessfully',data: updated })
    

    } catch (error) {
    return res.status(400).send({ status: false, msg: error.message })
}
}



const usercheckcreatedbyevent=async function(req,res){
    try{

        const data=req.params.UserId

        if (!objectId.isValid(data)) {
            return res.status(400).send({ status: false, msg: 'enter valid userId' })
        }


        const userAllEventCreateCheck=await eventmodel.find({UserId:data})
        if(!userAllEventCreateCheck){
            return res.status(404).send({status:false,msg:"users does not create any events otherwise check id correctly or not"})
        }

        return res.status(200).send({status:true,msg:'list user created by them invent',data:userAllEventCreateCheck})

    }catch(error){
        return res.status(500).send({status:false,msg:'error.message'})
    }
}


   

    const events = async function(req, res) {
        try {
             
            const data=req.query
           
            if(Object.keys(data)==0){
                const AlleventData=await eventmodel.find()
                return res.status(200).send({status:true,msg:'All event Data is Here',data:AlleventData})
            }

            // let page=1;
            // let  limit=10;

          const { eventDate, eventname, sort, page=1, limit=10} = data;



      
          if (eventDate) {

            if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(eventDate)) {
                return res.status(400).send({ status: false, msg: "this data format /YYYY-MM-DD/ accepted " })
          }
            let dateFilter = await eventmodel.find({ eventDate: eventDate });
            // return res.status(200).send({status:true,msg:'data found by date',data:{dateFilter}})
            
           

            if(dateFilter==0){
                return res.status(404).send({status:false,msg:"data not found by eventDate"})
            }
           return res.status(200).send({status:true,msg:'data found by date',data:{dateFilter}})
      
            
          }
          if (eventname) {
            let findName = await eventmodel.find({eventname: { $regex:eventname , $options: "i" },});

            if(findName==0){
                return res.status(404).send({status:false,msg:'eventname not found'})
            }

            return res.status(200).send({status:true,msg:'Data found by eventname',data:findName})
        }
        
      
          if (sort) {
            let findSort = await eventmodel.find({eventname:sort}).sort();
            if(!findSort){
                return res.status(404).send({status:false,msg:'data not found by sort'})
            }
            return res.status(200).send({status:true,msg:'data found by sort',data:findSort})
      
          }

        

          
          if(page|| limit){
  
            const events=await eventmodel.find().limit(limit*1).skip((page-1)*limit);
  
            if(events==0){
              return res.status(404).send({status:false,msg:'out range of documents'})
            }
  
             return res.status(200).send({status:true,msg:'data found by pagination',total:events.length,events}) 
            
             }
         

        } catch (err) {
          return res.status(500).json({ status: false, msg: err.message });
        }
      };
      
     
    const ListOfAllEvent=async function (req,res){
        try{
            const data=req.params
            const allevent=await eventmodel.find()
            if(!allevent){return res.status(404).send({status:false,msg:'data not found'})}
            return res.status(200).send({status:true,msg:'All events',data:allevent})

        }catch(error){
            return res.status(500).send({status:false,msg:error.message})
        }
    }


    const getbyid=async function(req,res){
        try{

            const data=req.params.userId

            const getbyevent=await eventmodel.find({invites_send:data}).select({_id:0,isDeleted:0,createdAt:0,updatedAt:0,__v: 0})
            if(!getbyevent){return res.status(404).send({status:false,msg:'data not found'})}
            return res.status(200).send({status:true,msg:'data found by userid',data:getbyevent})

        }catch(error){
            return res.status(500).send({status:false,msg:error.message})
        }
    }





     module.exports = { createevent, checkEventById,getupdateevent,events,ListOfAllEvent,getbyid,usercheckcreatedbyevent }


