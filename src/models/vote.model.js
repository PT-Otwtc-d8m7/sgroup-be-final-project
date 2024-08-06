import pool from '../config/db.config'

class Vote {
    static async create(userId, optionId) {
        try {
            const connection = await pool.getConnection();
            const [result] = await connection.query('INSERT INTO votes (user_id, option_id) VALUES (?, ?)', [userId, optionId]);
            return result.insertId;
        } catch (error) {
          console.log("🚀 ~ file: vote.model.js:10 ~ Vote ~ create ~ error:", error)
          console.error('Error executing query:', error);
          throw error;
        }
    }

    static async remove(userId, optionId) {
        try {
            const connection = await pool.getConnection();
            const [result] = await connection.query('DELETE FROM votes WHERE user_id = ? AND option_id = ?', [userId, optionId]);
            return result.affectedRows > 0;
        } catch(error) {
            console.log("🚀 ~ file: vote.model.js:22 ~ Vote ~ remove ~ error:", error)
            console.error('Error executing query:', error);
            throw error;
        }
    }

    static async getByPollId(pollId) {
        try {
            const connection = await pool.getConnection();
            const [rows] = await connection.query(`
                SELECT v.*, o.poll_id
                FROM votes v
                JOIN options o ON v.option_id = o.id
                WHERE o.poll_id = ?
              `, [pollId]);
              return rows;          
        } catch (error) {
            console.log("🚀 ~ file: vote.model.js:32 ~ Vote ~ getByPollId ~ error:", error)
            console.error('Error executing query:', error);
            throw error;
        }
      }
}

export default Vote;