import Poll from '../models/poll.model';
import Option from '../models/option.model'
import Vote from '../models/vote.model'

class PollController {
    async createPoll (req, res, next) {
        try {
            const { title, options, userId } = req.body;
            const pollId = await Poll.createPoll(title, userId);
            for( let option of options){
                await Option.create(pollId, option);
            }
            res.status(200).json({
                success : true,
                message : 'Creating Poll Success'
            });
        } catch (error) {
            console.log("🚀 ~ file: poll.controller.js:16 ~ createPoll ~ error:", error);
            return res.status(500).json({
                success: false,
                message: "Creating Poll Fail :("
            });
        }
    }

    async addOption (req, res, next) {
        try {
            const { text } = req.body;
            const pollId = req.params.id;
            await Option.create(pollId, text);
            return res.status(200).json({
              success : true,
              message : 'Option Adding Success'
            });
        } catch (error) {
            res.status(500).send('Error adding option');
        }
    }

    async listPolls (req, res, next) {
        try {
            const polls = await Poll.getAllPolls();
            res.render('listPolls', { polls });
        } catch (error) {
            res.status(500).send('Error listing polls');
        }
    }

    async viewPoll (req, res, next) {
        try {
            const pollId = req.params.id;
            const poll = await Poll.findById(pollId);
            const options = await Option.getByPollId(pollId);
            const votes = await Vote.getByPollId(pollId);
            res.render('viewPoll', { poll, options, votes, userId: req.userId });
        } catch(error) {
            res.status(500).send('Error viewing poll');
        }
    }

    async vote (req, res, next) {
        try {
            const { optionId, userId } = req.body;
            await Vote.create(userId, optionId);
            res.status(200).json({
                success : true,
                message : 'Voting Success'
            });
        } catch(error) {
            res.status(500).send('Error voting');
        }
    }

    async unvote (req, res, next) {
        try {
            const { optionId, userId } = req.body;
            await Vote.remove(userId, optionId);
            res.status(200).json({
                success : true,
                message : 'Unvoting Success'
            });
        } catch(error) {
            res.status(500).send('Error unvoting');
        }
    }
}
  
export default new PollController();