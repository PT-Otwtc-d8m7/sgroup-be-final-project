import express from 'express';
import userRoute from './route-detail/user.route';
import authRoute from './route-detail/auth.route';
import pollRoute from './route-detail/poll.route';

const router = express.Router();

router.use('/users', userRoute);
router.use('/auth', authRoute);
router.use('/polls', pollRoute);

export default router;
