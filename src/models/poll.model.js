import pool from '../config/db.config';

class Poll {
    static async createPoll(title,userId) {
        try {
            const connection = await pool.getConnection();
            const [result] = await connection.query('INSERT INTO polls (title, user_id) VALUES (?, ?)', [title, userId]);
            console.log("🚀 ~ file: poll.model.js:10 ~ Poll ~ createPoll ~ rows:", result);
            return result.insertId;
        } catch (error) {
            console.log("🚀 ~ file: poll.model.js:13 ~ Poll ~ createPoll ~ error:", error);
            console.error('Error executing query:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM polls WHERE id = ?', [id]);
            return rows[0]; 
        } catch(error) {
            console.log("🚀 ~ file: poll.model.js:25 ~ Poll ~ findById ~ error:", error);
            console.error('Error executing query:', error);
        }
    }

    static async getAllPolls() {
        try {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM polls ORDER BY created_at DESC');
            return rows;
        } catch (error) {
            console.log("🚀 ~ file: poll.model.js:36 ~ Poll ~ getAllPolls ~ error:", error);
            console.log('Error executing query:', error);
        }
      }
}

export default Poll;