import Database from '../database/database.js';

async function readAll() {
  const db = await Database.connect();

  const sql = `
    SELECT 
      f.id, f.name, c.name as category
    FROM 
      gyms as f INNER JOIN categories as c
    ON
      f.category_id = c.id
  `;

  const gyms = await db.all(sql);

  return gyms;
}

async function read(id) {
  const db = await Database.connect();

  const sql = `
    SELECT 
      f.id, f.name, c.name as category
    FROM 
      gyms as f INNER JOIN categories as c
    ON
      f.category_id = c.id
    WHERE
      f.id = ?
  `;

  const gym = await db.get(sql, [id]);

  return gym;
}

async function create(gym) {
  const db = await Database.connect();

  const { name, category_id } = gym;

  const sql = `
    INSERT INTO
      gyms (name, category_id)
    VALUES
      (?, ?)
  `;

  const { lastID } = await db.run(sql, [name, category_id]);

  return read(lastID);
}

async function update(gym, id) {
  const db = await Database.connect();

  const { name, category_id } = gym;

  const sql = `
    UPDATE 
      gyms
    SET
      name = ?, category_id = ?
    WHERE
      id = ?
  `;

  const { changes } = await db.run(sql, [name, category_id, id]);

  if (changes === 1) {
    return read(id);
  } else {
    return false;
  }
}

async function destroy(id) {
  const db = await Database.connect();

  const sql = `
    DELETE FROM
      gyms
    WHERE
      id = ?
  `;

  const { changes } = await db.run(sql, [id]);

  return changes === 1;
}

export default { readAll, read, create, update, destroy };
