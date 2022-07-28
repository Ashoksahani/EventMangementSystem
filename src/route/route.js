const express=require('express');
const router=express.Router();
const controller=require('../controller/userController.js')
const eventController=require('../controller/eventController.js')
const {authorization }=require('../middleware/auth.js')




router.post('/createUser',controller.createUser)
router.post('/login',controller.createlogin)
router.post('/updatepassword',controller.updatepassword)
router.get('/logout',authorization,controller.logout)


router.post('/createevent',eventController.createevent)

//check user created events by them
router.get('/createdEventByuser/:UserId',eventController.usercheckcreatedbyevent)


router.get('/checkEventByuserId/:userId',eventController.checkEventById)
router.put('/updateevent/:eventId',eventController.getupdateevent)

router.get('/sort',eventController.events )
//sort by pagination, date,eventname,sort

router.get('/public-api',eventController.ListOfAllEvent)
router.get('/getidevents/:userId',eventController.getbyid )
//checkEventById




router.post('/resetpassword',controller.otpforReset)
router.post('/resetlink',controller.resetLink)


module.exports  = router