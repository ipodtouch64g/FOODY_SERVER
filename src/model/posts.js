const moment = require('moment');

if (!global.db) {
    const pgp = require('pg-promise')();
    db = pgp(process.env.DB_URL);
}

function list(searchText = '',place = '',category = '',price = 0,ascending = 'no') {
    const order = ascending==='ture'?'ORDER BY average ASC':(ascending ==='false'?'ORDER BY average DESC':'ORDER BY id ASC');
    let where = searchText?`WHERE (address ILIKE '%$1:value%' OR name ILIKE '%$1:value%' OR category ILIKE '%$1:value%')`:'';
    if(searchText&&place)
      where+= ` AND address ILIKE '%$2:value%'`;
    if(searchText&&category)
      where+= ` AND category ILIKE '%$3:value%'`;
    if(searchText&&price)
      where+= ` AND average <= $4 AND average > 0`;
    const sql = `
        SELECT *
        FROM restaurant
        ${where}
        ${order}
        LIMIT 25
    `;
    console.log (sql, searchText ,place ,category ,price);
    return db.any(sql, [searchText ,place ,category ,price]);
}

function listPost(r_id = 0) {
    const sql = `
        SELECT *
        FROM post
        WHERE r_id = $1
        ORDER BY p_id ASC
        LIMIT 15
    `;
    return db.any(sql, r_id);
}
function create(newRest) {
    const sql = `
        INSERT INTO restaurant (name,category,average,telephon,address,image,lat,lng,review1,review2,review3)
        VALUES ($<name>, $<category>, $<average>, $<telephon>, $<address>,'-1','24.7947253','120.9932316','-1','-1','-1')
        RETURNING *
    `;
    return db.one(sql, newRest);
}

function createPost(text, r_id) {
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
    create,
    createPost
};
