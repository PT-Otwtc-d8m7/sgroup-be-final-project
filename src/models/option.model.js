import pool from '../config/db.config'

class Option {
    static async create(pollId, text) {
        const connection = await pool.getConnection();
        const [result] = await connection.query('INSERT INTO options (poll_id, text) VALUES (?, ?)', [pollId, text]);
        return result.insertId;
      }
    
      static async getByPollId(pollId) {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM options WHERE poll_id = ?', [pollId]);
        return rows;
      }
}

export default Option;