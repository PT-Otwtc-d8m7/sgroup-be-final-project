import mysql from 'mysql2/promise';             
  // RAWS
  // QUERRY BUILDER - Nằm giữa ORM và câu lệnh SQL - Key word "knex"
  // ORM = Object Relationship Mapping - Key word "sequelize"

  const pool = mysql.createPool({
    host: '3.105.228.91',  // Thay đổi với thông tin host của bạn
    user: 'root',       // Thay đổi với thông tin user của bạn
    password: '12345', // Thay đổi với thông tin password của bạn
    database: 'testdatabase',  // Thay đổi với thông tin database của bạn
    waitForConnections: false,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
      }
      if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
      }
  }
  
  if (connection) console.log("Connect Success"); connection.release();
  
  return;
  }
);

export default pool;