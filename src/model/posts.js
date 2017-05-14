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

function create(mood, text) {
    const sql = `
        INSERT INTO posts ($<this:name>)
        VALUES ($<mood>, $<text>)
        RETURNING *
    `;
    return db.one(sql, {mood, text});
}

module.exports = {
    list,
    create
};
