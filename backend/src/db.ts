import mysql, { Connection } from 'mysql2/promise';

let connection: Connection | null = null;

export async function getConnection(): Promise<Connection> {
  if (connection !== null) {
    return connection;
  }

  connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT!, 10) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_ROOT_PASSWORD || 'root',
    database: process.env.DB_NAME
  });

  return connection;
}
