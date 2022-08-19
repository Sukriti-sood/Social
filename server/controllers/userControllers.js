const User = require("../models/User");
const Otp = require("../models/Otp")
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Follow = require("../models/Follow");
const { default: mongoose } = require("mongoose");
const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const {MAIL, MAIL_PASSWORD, MAIL_USERNAME, OAUTH_CLIENTID, OAUTH_CLIENT_SECRET,
OAUTH_REFRESH_TOKEN, TOKEN_KEY} = require("../config/config")


const getUserDict = (token, user) => {
  return {
    token,
    username: user.username,
    userId: user._id,
    isAdmin: user.isAdmin,
  };
};

const buildToken = (user) => {
  return {
    userId: user._id,
    isAdmin: user.isAdmin,
  };
};

const emailSend = async (req, res)=>{

    try{
      const { email, isLogin, username } = req.body;

      let user = username
      
      const normalizedEmail = email.toLowerCase();

      let existingUser = (isLogin==true) ? await User.findOne({ email: normalizedEmail }) : false;

      if(existingUser) user = existingUser.username;

      if((isLogin==="0") || (isLogin!=="0") && existingUser)
      {
        let otpCode = Math.floor((Math.random()*10000)+1);
        
        const filter = {email:normalizedEmail};

        const update = {code:otpCode, expireIn: new Date().getTime() + 300*1000}
        
        let otpResponse = await Otp.findOneAndUpdate(filter, update, {
          new: true,
          upsert: true 
        });

        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: MAIL_USERNAME,
            pass: MAIL_PASSWORD,
            clientId: OAUTH_CLIENTID,
            clientSecret: OAUTH_CLIENT_SECRET,
            refreshToken: OAUTH_REFRESH_TOKEN
          }
        });

        const handlebarOptions = {
          viewEngine: {
              partialsDir: path.resolve('./views/'),
              defaultLayout: false,
          },
          viewPath: path.resolve('./views/'),
      };

      transporter.use('compile', hbs(handlebarOptions))

        let mailOptions = {
          from: MAIL,
          to: otpResponse.email,
          subject: 'Verify Email',
          template: 'email',
          context: {
            username: user,
            code: otpResponse.code
          }
        };

        transporter.sendMail(mailOptions, function(err, data) {
          if (err) {
            throw new Error(err);
          } else {
            res.status(200).json({'statusText':'Success','message':'Please check your Email inbox and Spam folder too.'})
          }
        });
      }
      else
      {
        throw new Error("User doesn't exist");
      }
      
    }catch (err) {
      return res.status(400).json({ error: err.message });
    }
};

const verifyOTP = async (req, res) => {
  try{
    const { email, code} = req.body;
    let data = await Otp.find({email:email, code:code});
    if(data)
    {
      let currentTime = new Date().getTime();
      let diff = data.expireIn - currentTime;

      if(diff<0)
      {
        throw new Error("OTP Expire");
      }
      else
      {
        res.status(200).json({'statusText':'Success','message':'Verified'})
      }
    }
  }
  catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!(username && email && password)) {
      throw new Error("All input required");
    }

    const normalizedEmail = email.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });

    if (existingUser) {
      throw new Error("Email and username must be unique");
    }

    const user = await User.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(buildToken(user), TOKEN_KEY);

    return res.json(getUserDict(token, user));
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      throw new Error("All input required");
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });


    if (!user) {
      throw new Error("Email or password incorrect");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error("Email or password incorrect");
    }

    const token = jwt.sign(buildToken(user), TOKEN_KEY);

    return res.json(getUserDict(token, user));
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const changePass = async (req, res) => {
  try{
        const {email, password} = req.body;

        let user = await User.findOne({email:email});
        if(user)
        {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
          user.save();
          res.status(200).json({'statusText':'Success','message':'Password Changed'})
        }
        else
        {
          throw Error("Invalid User");
        }
  }catch (err) {
    return res.status(400).json({ error: err.message });
}}

const follow = async (req, res) => {
  try {
    const { userId } = req.body;
    const followingId = req.params.id;

    const existingFollow = await Follow.findOne({ userId, followingId });
    
    console.log(existingFollow)
    if (existingFollow) {
      throw new Error("Already following this user");
    }

    const follow = await Follow.create({ userId, followingId });

    return res.status(200).json({ data: follow ,"result":true});
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId, biography } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User does not exist");
    }

    if (typeof biography == "string") {
      user.biography = biography;
    }

    await user.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const unfollow = async (req, res) => {
  try {
    const { userId } = req.body;
    const followingId = req.params.id;

    const existingFollow = await Follow.findOne({ userId, followingId });

    if (!existingFollow) {
      throw new Error("Not already following user");
    }

    await existingFollow.remove();

    return res.status(200).json({ data: existingFollow,"result":true});
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getFollowers = async (req, res) => {
  try {
    const userId = req.params.id;

    const followers = await Follow.find({ followingId: userId });

    return res.status(200).json({ data: followers });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getFollowing = async (req, res) => {
  try {
    const userId = req.params.id;

    const following = await Follow.find({ userId });

    return res.status(200).json({ data: following });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      throw new Error("User does not exist");
    }

    const posts = await Post.find({ poster: user._id })
      .populate("poster")
      .sort("-createdAt");

    let likeCount = 0;

    posts.forEach((post) => {
      likeCount += post.likeCount;
    });

    const data = {
      user,
      posts: {
        count: posts.length,
        likeCount,
        data: posts,
      },
    };

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getRandomUsers = async (req, res) => {
  try {
    let { size } = req.query;

    const users = await User.find().select("-password");

    const randomUsers = [];

    if (size > users.length) {
      size = users.length;
    }

    const randomIndices = getRandomIndices(size, users.length);

    for (let i = 0; i < randomIndices.length; i++) {
      const randomUser = users[randomIndices[i]];
      randomUsers.push(randomUser);
    }

    return res.status(200).json(randomUsers);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const getRandomIndices = (size, sourceSize) => {
  const randomIndices = [];
  while (randomIndices.length < size) {
    const randomNumber = Math.floor(Math.random() * sourceSize);
    if (!randomIndices.includes(randomNumber)) {
      randomIndices.push(randomNumber);
    }
  }
  return randomIndices;
};

module.exports = {
  emailSend,
  register,
  login,
  follow,
  unfollow,
  getFollowers,
  getFollowing,
  getUser,
  getRandomUsers,
  updateUser,
  verifyOTP,
  changePass
};
