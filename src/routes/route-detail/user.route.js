import express from 'express';
import UserController from '../../controllers/user.controller';

const route = express.Router();

route.route('/')
    .get(UserController.getUsers)
    .post(UserController.postUser);

route.route('/:id')
    .get(UserController.getDetail)
    .put(UserController.putUser)
    .delete(UserController.delUser);

export default route;