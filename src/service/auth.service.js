import UserModel from "../models/user.model";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import crypto  from "crypto";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
class AuthService {
    constructor() {
        this.UserModel = new UserModel();
    }

    async login(username) {
        try {
            const user = await this.UserModel.getUserByEmail(username);
            console.log("🚀 ~ file: auth.service.js:11 ~ AuthService ~ login ~ user:", user)
            return user;
        }catch(error) {
            throw error;
        }
    }

    async register(username) {
        try {
            const user = await this.UserModel.getUserByEmail(username);
            console.log("🚀 ~ file: auth.service.js:11 ~ AuthService ~ login ~ user:", user)
            return user;
        }catch(error) {
            throw error;
        }
    }

    async handleForgotPassword(email) {
        try {
            const result = await this.UserModel.getUserByEmail(email);
        
            if (result.length === 0) {
              return { success: false, message: 'Email does not exist' };
            }
        
            const token = crypto.randomBytes(20).toString('hex');
            const expiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        
            await this.UserModel.query(
              'UPDATE user SET passwordResetToken = ?, passwordResetExpiration = ? WHERE email = ?',
              [token, expiration, email]
            );
        
            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: '080704truongquangphuc@gmail.com',
              subject: 'Password Reset',
              text: `You requested for a password reset. Please use the following token to reset your password: ${token}`
            };
        
            await transporter.sendMail(mailOptions);
        
            return { success: true };
          } catch (err) {
            console.error(err);
            return { success: false, message: 'Failed to send email' };
          }
    }

    async handleResetPassword(email, token, newPassword) {
    try {
      const result = await this.UserModel.query(
        'SELECT * FROM user WHERE email = ? AND passwordResetToken = ? AND passwordResetExpiration > ?',
        [email, token, new Date()]
      );

      if (result.length === 0) {
        return { success: false, message: 'Invalid token or token has expired' };
      }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt)

      await this.UserModel.query(
        'UPDATE user SET password = ?, salt = ?, passwordResetToken = NULL, passwordResetExpiration = NULL WHERE email = ?',
        [hashedPassword, salt, email]
      );
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Failed to reset password' };
    }
  }
}

export default new AuthService();
