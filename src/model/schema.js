require('../../config.js');
const pgp = require('pg-promise')();
const db = pgp(process.env.DB_URL);
var restaurant = require('./data1.json');
var lastRest =restaurant.restaurant.length-1;
var fileNum=1;

const schemaSql = `
    -- Extensions
    CREATE EXTENSION IF NOT EXISTS pg_trgm;

    -- Drop (droppable only when no dependency)
    DROP TABLE IF EXISTS restaurant;
    DROP TABLE IF EXISTS post;

    -- Create restaurant
    CREATE TABLE restaurant (
        id              integer PRIMARY KEY NOT NULL,
        name            text NOT NULL,
        category        text NOT NULL,
        address         text NOT NULL,
        image           text NOT NULL,
        average         integer NOT NULL DEFAULT 0,
        telephon        text NOT NULL,
        lat             float NOT NULL,
        lng             float NOT NULL,
        review1         text NOT NULL,
        review2         text NOT NULL,
        review3         text NOT NULL
    );

    -- Create post
    CREATE TABLE post (
        p_id            serial PRIMARY KEY NOT NULL,
        r_id            integer references restaurant(id),
        text            text NOT NULL,
        ts              bigint NOT NULL DEFAULT (extract(epoch from now()))
    );
`;
function Populate_recur(index,el){
    let dataSql = `
      -- Populate restaurant
      INSERT INTO restaurant (id,name,category,average,telephon,address,image,lat,lng,review1,review2,review3)
      SELECT
          ${el.id},
          $1,
          $2,
          ${parseInt(el.average)},
          $3,
          $4,
          $5,
          ${parseFloat(el.lat)},
          ${parseFloat(el.lng)},
          $6,
          $7,
          $8;
    `;
    if(index === lastRest){
      db.none(dataSql,[el.name,el.category,el.tele,el.address,el.img_src,el.review[0],el.review.length>1?el.review[1]:"-1",
                      el.review.length>2?el.review[2]:"-1"]).then(() => {
          console.log('Data populated');
          if(fileNum<9){
            fileNum+=1;
            restaurant = require(`./data${fileNum}.json`);
            console.log(`Data${fileNum} populated`);
            Populate_recur(0,restaurant.restaurant[0]);
          }
          else{
            pgp.end();
          }
      });
    }
    else{
      db.none(dataSql,[el.name,el.category,el.tele,el.address,el.img_src,el.review[0],el.review.length>1?el.review[1]:"-1",
                      el.review.length>2?el.review[2]:"-1"]).then(() => {
          Populate_recur(index+1,restaurant.restaurant[index+1]);
      });
    }
}

db.none(schemaSql).then(() => {
    console.log('Schema created');
    Populate_recur(0,restaurant.restaurant[0]);
}).catch(err => {
    console.log('Error creating schema', err);
});
