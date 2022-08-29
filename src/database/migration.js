import Database from './database.js';

async function up() {
  const db = await Database.connect();

  const categoriesSql = `
    CREATE TABLE categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(20) NOT NULL
    )
  `;

  await db.run(categoriesSql);

  const gymsSql = `
    CREATE TABLE gyms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(20) NOT NULL,
      category_id INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    )
  `;

  await db.run(gymsSql);

  const usersSql = `
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(20) NOT NULL
    )
  `;

  db.run(usersSql);
}

export default { up };
