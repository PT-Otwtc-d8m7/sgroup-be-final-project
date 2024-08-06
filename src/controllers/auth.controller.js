import { sign } from "jsonwebtoken";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import UserModel from "../models/user.model";
import authService from "../service/auth.service";
import userService from "../service/user.service";
import express from 'express';
dotenv.config();

class AuthController {
    constructor() {
        this.UserModel = new UserModel();
    }
    async login(req, res, next) {
        try {
            const username = req.body.email;
            console.log("🚀 ~ file: auth.controller.js:5 ~ AuthController ~ login ~ username:", username);
            const password = req.body.password;
            console.log("🚀 ~ file: auth.controller.js:7 ~ AuthController ~ login ~ password:", password);
    
            // Gọi dịch vụ đăng nhập để lấy thông tin người dùng
            const user = await authService.login(username);
            console.log(user);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid username or password"
                });
            }
    
            // So sánh mật khẩu nhập vào với mật khẩu đã được băm và lưu trữ
            const isMatch = await bcrypt.compare(password, user.password);
            console.log("Password match result: ", isMatch);
    
            if (isMatch) {
                user.password = undefined;
                const secretKey = process.env.JWT_SECRET;
                
                if (!secretKey) {
                    throw new Error("Secret key is not defined in environment variables");
                }
    
                const token = sign({ id: user.id, email: user.email }, secretKey, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                const expiration = new Date(Date.now() + 10*60*1000);
                
    
                return res.status(200).json({
                    success: true,
                    message: "Login Successfully",
                    token: token
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Invalid username or password"
                });
            }
        } catch (error) {
            console.log("🚀 ~ AuthController ~ login ~ error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }

    async register(req, res, next) {
        try {
            const newUser = {
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                gender: req.body.gender,
                age: req.body.age,
                salt: 'aaa'
            }
            console.log(newUser);
            const data = await authService.register(newUser.email);
            console.log("🚀 ~ file: auth.controller.js:72 ~ AuthController ~ register ~ data:", data)
            console.log("🚀 ~ file: auth.controller.js:72 ~ AuthController ~ register ~ newUser.email:", newUser.email)
            if(data != null) {
                return res.status(409).json({
                    success: false,
                    message: "Username or email already exist"
                });
            }
            else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newUser.password, salt)
                newUser.password = hashedPassword;
                newUser.salt = salt;
                console.log(salt);
                console.log(newUser.password);
                await userService.createUsers(newUser);
                return res.status(201).json({
                    success: true,
                    message: "Created User"
                });
            }
        } catch(error) {
            console.log("🚀 ~ UserController ~ postUser ~ error:", error)
            return res.status(500).json({
                success: false,
                message: "Internal Service Error"
            });
        }
    }
    
    async forgotPassword(req, res, next) {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        try {
            const result = await authService.handleForgotPassword(email);
            if (result.success) {
            return res.status(200).json({ message: 'Email sent successfully' });
            } else {
            return res.status(400).json({ error: result.message });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async resetPassword(req, res, next) {
        const { email, passwordResetToken, newPassword } = req.body;
      
        if (!email || !passwordResetToken || !newPassword) {
          return res.status(400).json({ error: 'Email, token and new password are required' });
        }
      
        try {
          const result = await authService.handleResetPassword(email, passwordResetToken, newPassword);
          if (result.success) {
            return res.status(200).json({ message: 'Password reset successfully' });
          } else {
            return res.status(400).json({ error: result.message });
          }
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }
      };

    async getMe(req, res) {
        try {
            const user = req.user
        return res.status(200).json({
            success : true,
            message : "Login Authorization Success",
            user  : user
        });
        }catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }
}

export default new AuthController();


