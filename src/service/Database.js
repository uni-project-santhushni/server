
import mysql from 'mysql2/promise';


const Database = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'cow_management',
});

export default Database;