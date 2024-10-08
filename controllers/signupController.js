const db = require("../models");
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../config/utils/auth');
const { Buffer } = require('buffer');
const { Role } = require("../config/utils/constant");

const signup = async (req, res) => {

const {  user_name, email, password } = req.body;

     try {
        const hasUserWithEmail = await db.users.count({ where: { email } })
        if (hasUserWithEmail) {
         res.status(400).json({ message: 'Already existing user.' });
         return
        }
        else if(!password || password === null) {
         return res.status(400).json({ message: 'Password is Missing.' });
         
        }
         else{

         const hashedPassword = await bcrypt.hash(password, 10);

         const user = await db.users.create({  role:Role.user, user_name, email, password: hashedPassword });
         const tokens = await generateAccessToken(user);

         // Return the user and the tokens in the response
         res.status(200).json({
           message: 'User created successfully.',
           user,
           accessToken: tokens.accessToken,
           refreshToken: tokens.RefreshToken,
         });

        
        }
     } catch (error) {
        res.status(500).json({ message: 'Error creating user.', error });
     }
};


module.exports =  signup ;