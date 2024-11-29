import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../Modals/User.js';

const accessKey = process.env.JWT_ACCESS

const Login = express();


Login.post('/login' , async(req,res)=>{

    const {password , username} = req.body;

    try {
        const Userdata = await User.findOne({ UniqueUsername: username, password: password });

        if (Userdata) {
            const accessToken = jwt.sign({Userdata}, accessKey, { expiresIn: "2d" });
      
            res.status(200).json({ access: accessToken, UserInfo:Userdata , valid:true});
      
          }
          
          else {
            console.log("credentials not valid");
            res.status(200).json({valid:false});
          }



    } catch (error) {
        console.log(error)
    }

})
export default Login


