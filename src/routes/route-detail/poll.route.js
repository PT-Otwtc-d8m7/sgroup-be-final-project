import express from 'express';
import PollController from '../../controllers/poll.controller'
const route = express.Router();

route.post('/',  PollController.createPoll );
route.get('/:id', PollController.viewPoll);
route.post('/:id/vote', PollController.vote);
route.post('/:id/unvote', PollController.unvote);
route.post('/:id/addOption', PollController.addOption);
route.get('/', PollController.listPolls);

export default route;