const router = require('express').Router();
const User = require('../models/User');
const bcyrpt = require('bcrypt');

// REGISTER
router.post('/register',async(req,res)=>{
    try{

        const salt = await bcyrpt.genSalt(10);
        const hasedPass = await bcyrpt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hasedPass ,
        })
        const user = await newUser.save();
        res.status(200).json(user);
    }
    catch(err){
        res.status(5000).json(err);
    }


});
// LOGIN
router.post("/login", async(req,res)=>{
    try{
        const user = await User.findOne({username:req.body.username});
        !user && res.status(400).json("Wrong Credentials");

        const validated = await bcyrpt.compare(req.body.password,user.password);
        !validated && res.status(400).json("Wrong Credentials");

        const {password,...others} = user._doc; 
        res.status(200).json(others);
        

    }catch(err){
        res.status(5000).json(err);
    }

});

module.exports = router;