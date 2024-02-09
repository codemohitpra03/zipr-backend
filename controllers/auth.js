const { compareSync, hashSync } = require('bcrypt');
const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')
const db=require('../config/config').get(process.env.NODE_ENV);
const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


const handleLogin = async (req, res) => {
    console.log(re.test(req.body.email));
    if(!re.test(req.body.email)){
        return res.json({
            status:400,
            message:"Enter valid email address"
        });
    }
    const user = await UserModel.findOne({email: req.body.email})
    console.log(user);
    if(!user){
        return res.send({
            status:404,
            success:false,
            message:"User not found"
        })
    }
    if(!compareSync(req.body.password,user.password)){
        return res.send({
            status:401,
            success:false,
            message:"Password mismatch"
        })
    }

    const payload = {
        email:user.email,
        id: user._id,    
    }
    const token = jwt.sign(payload,db.JWT_SECRET,{expiresIn:"1d"})
    console.log(token);
    
    res.cookie('access_token', token,{
        httpOnly: true,
      secure: true, // not https yet, so comment this out for now
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    // res.setHeader("Set-Cookie", "access_token="+token);
    return res.status(200)
    .json({status:200, message: "Logged in successfully" ,email: user.email});

}


const handleRegister = async (req, res) => {
    try {
        const { email, password } = req.body;
        const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        console.log(re.test(email));
        if(!re.test(email)){
            return res.json({
                status:400,
                message:"Enter valid email address"
            });
        }
        // Check if username already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.json({
                status:400,
                message:"User already exists"
            });
        }
        console.log(existingUser);
        // Create a new user
        const newUser = new UserModel({
            email,
            password: hashSync(password, 10)
        });

        // Save the new user to the database
        await newUser.save();
        
        // Respond with success message
        return res.json({
            status:200,
            message:"Registration successful",
            email
        });
    } catch (error) {
        // Handle any errors
        console.error('Error registering user:', error);
        return res.status(500).json({
            status:500,
            message:"Error while saving registration"
        });
    }
}


const handleLogout = (req, res) => {
    // req.logout(function(err) {
    //     if (err) { return next(err); }
    //     res.redirect('/login');
    // })
    console.log(req.cookies);
    return res
    .clearCookie("access_token",{sameSite: "none",
    secure: true})
    .status(200)
    .json({ message: "Successfully logged out 😏 🍀" });
}

const handleProtected = (req, res) => {
    console.log(req.user);
    res.status(200).send({
        success:true,
        message:"protected",
        user:{
            id:req.id,
            email:req.email
        }
    })
}



module.exports = {
    handleLogin,
    handleRegister,
    handleLogout,
    handleProtected
}