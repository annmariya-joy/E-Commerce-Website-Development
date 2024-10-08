const db = require("../models");
const bcrypt = require('bcrypt');
const { validateEmail,isValidPhoneNumber } = require('./validater');
const { generateAccessToken } = require('../config/utils/auth');
const { Buffer } = require('buffer');
const { Role } = require("../config/utils/constant");


const login = async (req, res) => {

    const userAgent = req.headers['user-agent'];
    console.log("user agent",userAgent);
    const query = { where: {} };
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing.' });
    }
    try {
        const decodedCredentials = Buffer.from(authHeader, 'base64').toString('utf-8');
        const [userlogin, password, deviceToken] = decodedCredentials.split(':');
        if (userlogin) {
          if (validateEmail(userlogin)) {
              query.where.email = userlogin;
          } else {
              return res.status(400).json({ message: 'Invalid input: Neither email .' });
          }
      }

        const user = await db.users.findOne(query);
        if (!user) {
        return res.status(200).json({ message: 'Invalid email or password.' });
        }
        if (user.role !== Role.user) {
          return res.status(403).json({ message: 'You do not have permission to access this route.' });
      }
        if (validateEmail(userlogin)) {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return res.status(401).json({ message: 'Your password does not match.' });

          }
        }
                const accessToken = await generateAccessToken(user);
                
                res.status(200).json({ message: 'Login successful.', user, accessToken })
    } catch (error) {
        console.log(error.stack)
        res.status(500).json({ message: 'Error logging in.', error });
    }
 };




 

 



module.exports = { login };

