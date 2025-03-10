import User from '../Models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHndler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return next(errorHndler(400, 'All fields are required'));
        }

        const isValidUser = await User.findOne({ email });

        if (isValidUser) {
            return next(errorHndler(400, 'User already exists'));
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'User created successfully'
        });

    } catch (error) {
        console.error("Signup Error:", error);
        return next(errorHndler(500, 'Internal Server Error'));
    }
};


export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });

        if (!validUser) {
            return next(errorHndler(404, 'User not found'));
        }

        const isPasswordValid = bcryptjs.compareSync(password, validUser.password);

        if (!isPasswordValid) {
            return next(errorHndler(401, 'Invalid credentials'));
        }
        // Generate JWT token
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { password: _, ...rest } = validUser._doc;

        res.status(200).json({
            sucess: true,
            message: "logged in successfully",
            token,
            rest,
        });
    } catch (error) {
        next(error);
    }

}


export const signout = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: "logged out successfully"
        });


    } catch (error) {
        next(error);

    }

}