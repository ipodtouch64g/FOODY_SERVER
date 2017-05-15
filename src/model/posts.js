const moment = require('moment');

if (!global.db) {
    const pgp = require('pg-promise')();
    db = pgp(process.env.DB_URL);
}

function list(searchText = '') {
    const where = searchText?`WHERE address ILIKE '%$1:value%' OR name ILIKE '%$1:value%' OR category ILIKE '%$1:value%'`:'';
    const sql = `
        SELECT *
        FROM restaurant
        ${where}
        ORDER BY id DESC
        LIMIT 15
    `;
    return db.any(sql, searchText);
}

function listPost(r_id = 0) {
    const sql = `
        SELECT *
        FROM post
        WHERE r_id = $1
        ORDER BY p_id DESC
        LIMIT 15
    `;
    return db.any(sql, r_id);
}

function create(text, r_id) {
    ts= moment().unix();
    const sql = `
        INSERT INTO post ($<this:name>)
        VALUES ($<r_id>, $<text>, $<ts>)
        RETURNING *
    `;
    return db.one(sql, {r_id, text, ts});
}

module.exports = {
    list,
    listPost,
    create
};
