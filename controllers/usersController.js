import { User } from "../models/usersModel.js";
import { signupValidation, subscriptionValidation, } from "../validation/validation.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import bcrypt from "bcrypt";
import { Jimp } from "jimp";

const { SECRET_KEY } = process.env;

// 1. validate through frontend validation using Joi
// 2. find an existing user to prevent a duplicate email signup
// 3. hash password
// 4. create password
const signupUser = async (req, res) => {
const { error } = signupValidation.validate(req.body);

    // Registration validation error
if (error) {
    res.status(400).json({ message: "missing required email or password field" });
    }
try {
    // we have to make sure the email is unique
    // we need to use findOne(query) to verify that the email is not yet existing
    const { email, password } = req.body

    const existinguser = await User.findOne({ email });

// Registration conflict error
    if (existingUser) {
        return res.status(409).json({ message: "Email in use"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // the url() function from the gravatar npm package sets the global avatar for the email associated with the account
    // accepts two parameter: first is the email, second is the oject containing the  http protocol
    // this avatar is temporary and pplaceholder onl for when the user initially signs up
    const avatarUrl = gravatar.url(email, { protocol: "http" });

    const newUser = await User.create({ email, password: hashedPassword, avatarUrl });

    //res.status().json()is our way of resolving the HTTP request promise
    // without this, our HTTP request would go on forever
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatarUrl: newUser.avatarUrl,
        },
    });
   
} catch (error) {
    res.status(500).json({ message: error.message });
    
    }

};
 
//Validate request body using Joi
//Validate if email is existing
//If email exist, we will compare or decrypt the hashed password to the password
//If decryption is not successful, send an error saying password is wrong
//If decryption is successful we will generate a token to the user
//Save the token to the user in the database using findByIdandUpdate
//the user will apply the token as an authentication for all future request
const loginUser = async (req, res) => {
    const { error } = signupValidation.validate(req.body);

    // Login validation error
    if (error) {
        res.status(400).json({ message: "missing required email or password field" });
    }
    try {
        const { email, password } = req.body

        const existingUser = await User.findOne({ email });

        // Login user inexistent error
        if (!existingUser) {
            return res.status(401).json({ message: "Email or password is wrong" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        // Login user password error
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password is wrong. Click forgot password to reset." });
        }
        // _id is coming from MongoDB
        // id will be for the JWT
        const payload = { id: existingUser._id };
        // this generates a unique signature for our webtoken that only the person with correct secret key can decode
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23" });

        await User.findByIdAndUpdate(existingUser._id, { token: token });
        res.status(200).json({
            token: token,
            user: {
                email: existingUser.email,
                subscription: user.subscription,
               
            },
            
        });

      
            
    } catch (error) {
        res.status(500).json({ message: error.message });
   
    }
   
};

// 1. literaaly only validate the jwt
 //2. then once validated, logs out the user (this automatically strips the user of authentication rights)
const logoutUser = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { token: "" });
        res.status(204).json({ message: "User successfully logged out" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
//1. literally only validates the jwt
// 2. then once validated, retrieves the data of the logged in user
const getCurrentUsers = async (req, res) => {
    try {
        const { email, subscription } = req.user;
        res.json({ email, subscription, });
    } catch (error) {
        res.status(500).json({ message: error.message });

    }

};
 
// 1. validate through frontend validation using Joi
// 2. find an existing user because existing registered emails can only login
// 3. compare the user input password vs hashed password
// 4. if password is correct, generate JWT token
// 5. find the user in the database and add the token to the db document
const updateUserSubscription = async (req, res) => {
    try {
        const { error } = subscriptionValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        const { _id } = req.user;
        const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
            new: true,
        });
        
        res.json({
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 1. verify if the token is existing in the request
// 2. if the token is valid, access the uploaded avatar usig the upload.js middleware
const updateAvatar = async (req, res) => { 
    try {
        // access the authentication token through the req.user
        const { _id } = req.user;
        // uploaded avatar is access through the req.file

        // request body is the request that supoorts this content tpe: applicaton/json, text/html
        // request file is the request that supoorts this content tpe: Content-Type: image/jpeg, multipart/form-data
        
        const { path: oldPath, originalname } = req.file; 
        // we are reading from the temporary path
        // we are resizing the image to 250px width and 250px height
        // we are saving the updated resoltuion to the old temporary path
        await Jimp.read(oldPath).then((image) => image.resize(250, 250).write(oldPath));

        // the unique file name that we will generate is a concatenated version of the id of the user document and the extension of the original image file.
        const extension = path.extname(originalname);
        const filename = `${_id}${extension}`;

        // contruct a new avatar URL
        // this may not work directly if you are using a windows OS
        const avatarUrl = path.join("/avatars", filename);

        // you may try this for a windows ecosystem
        // let avatarURL = path.join('/avatars", filename);
        // avatarURL = avatarURL.replace(/\\/g, "/");

        //save the newly genrated avatar in the database and the public folder
        const updatedUser = await User.findByIdAndUpdate(_id, {
            avatarUrl,
        });
        res.status(200).json({ avatarUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
};   
    
    


export { signupUser, loginUser, logoutUser, getCurrentUsers, updateUserSubscription, updateAvatar, };