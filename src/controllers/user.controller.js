import { sign } from "jsonwebtoken";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import userService from "../service/user.service";
dotenv.config();

class UserController {
    async getUsers(req, res, next) {
        try {
            const users = await userService.getUsers();
            console.log(users);
            return res.status(200).send(users);
        } catch(error) {
            console.log("🚀 ~ UserController ~ getUsers ~ error:", error)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        }
    }
    
    async getDetail(req, res, next){
        try {
            const users = await userService.getUsers();
            const index = users.findIndex(user => user.id === parseInt(req.params.id));
            if(index == -1){
                res.send("The id does not exist!");
                return;
            }
            const detailUser = users.find(user => user.id === parseInt(req.params.id));
            return res.status(200).send(detailUser);
        } catch(error) {
            console.log("🚀 ~ UserController ~ getUsers ~ error:", error)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        } 
    }

    async postUser(req, res, next){
        try {
            const newUser = {
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                gender: req.body.gender,
                age: req.body.age,
            }
            console.log("🚀 ~ UserController ~ postUser ~ newUser:", newUser)
            await userService.createUsers(newUser);
            return res.status(200).json({
                success: true,
                message: "Created User Success"
            });
        } catch(error) {
            console.log("🚀 ~ UserController ~ postUser ~ error:", error)
            return res.status(500).json({
                success: false,
                message: "Created User Failed"
            });
        }
    }

    async putUser(req, res, next){
        try {
            const userId = req.params.id;
            const user = {
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                gender: req.body.gender,
                age: req.body.age,
            }
            await userService.updateUsers(userId, user);
            return res.status(200).json({
                success: true,
                message: "Updated User"
            });
            }catch(error) {
                return res.status(500).json({
                    success: false,
                    message: "Update Failed"
                });
            }
        
    }

    async delUser(req, res, next){ 
        try {
            const userId = req.params.id;
            console.log("🚀 ~ UserController ~ deleteUser ~ userId:", userId);
            
            const deletedUser = await userService.deleteUsers(userId);
            
            if (!deletedUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            
            return res.status(200).json({
                success: true,
                message: "Deleted User Success"
            });
        } catch (error) {
            console.log("🚀 ~ UserController ~ deleteUser ~ error:", error);
            return res.status(500).json({
                success: false,
                message: "Deleted User Failed"
            });
        }
    }
}

export default new UserController();