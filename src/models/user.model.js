import pool from '../config/db.config';
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

class UserModel {
    async getAllUsers() {
        try {
            const connection = await pool.getConnection();
            const [rows, fields] = await connection.query('SELECT * FROM `user`');
            connection.release();
            console.log("🚀 ~ file: user.model.js:24 ~ UserModel ~ getAllUsers ~ rows:", rows)
            return rows;
        } catch (error) {
            console.log("🚀 ~ UserModel ~ getAllUsers ~ error:", error)
            console.error('Error executing query:', error);
            throw error;
        }
    }

    async  getUserByEmail(email) {
        try {
            const connection = await pool.getConnection();
            const query = `
                SELECT * FROM user WHERE email = ?
            `;
            const values = [email];
            const [row, fields] = await connection.query(query, values);
            connection.release();
            if (row.length > 0) {
                console.log("User found: ", row[0]);
                return row[0];
            } else {
                console.log("No user found with the email: ", email);
                return null;
            }
        }catch(error) {
            console.log("🚀 ~ UserModel ~ getAllUsers ~ error:", error)
            console.error('Error executing query:', error);
            throw error;
        }
    }

    // static async getUserById(id) {
    //     try {
    //         const connection = await pool.getConnection();
    //         const [rows, fields] = await connection.query('SELECT * FROM user WHERE id = ?', [id]);
    //         connection.release();
    //         return rows[0];
    //     } catch (error) {
    //         console.error('Error executing query:', error);
    //         throw error;
    //     }
    // }

    async createUser(user) {
        try {
            const connection = await pool.getConnection();
            const query = `
                INSERT INTO user (id, name, email, password, gender, age, salt)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const { id, name, email, password, gender, age, salt } = user;
            const values = [id, name, email, password, gender, age, salt];
            await connection.query(query, values);
            connection.release();
            return { success: true, message: 'User created successfully' };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    async updateUser(userId, User) {
        try {
            const connection = await pool.getConnection();
            const query = `
                UPDATE user
                SET name = ?, email = ?, password = ?, gender = ?, age = ?
                WHERE id = ?
            `;
            const { name, email, password, gender, age } = User;
            const values = [name, email, password, gender, age, userId];
            await connection.query(query, values);
            connection.release();
            return { success: true, message: 'User updated successfully' };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const connection = await pool.getConnection();
            await connection.query('DELETE FROM user WHERE id = ?', [id]);
            connection.release();
            return { success: true, message: 'User deleted successfully' };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    async query(queryString, params) {
        try {
            const connection = await pool.getConnection();
            return await connection.query(queryString, params);
        } catch (error) {
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

export default UserModel;