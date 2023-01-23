const { query } = require('../db');

module.exports = async ({ ids }) => {
    if (ids.length === 0) {
        return [];
    }
    
    let sql = `
        SELECT place.id_place, place.place_name, city.latitude, city.longitude
        FROM place JOIN city ON place.id_place = city.id_place
        WHERE city.id_place
        IN (
    `;

    for (let i = 0; i < ids.length; ++i) {
        sql += (i > 0) ? `, :` + i : `:` + i;
    }
    sql += `)`;

    const cities = await query(sql, ids);

    sql = `
        SELECT place.id_place, place.place_name, region.latitude AS longitude, region.longitude AS latitude
        FROM place JOIN region ON place.id_place = region.id_place
        WHERE region.id_place
        IN (
    `;

    for (let i = 0; i < ids.length; ++i) {
        sql += (i > 0) ? `, :` + i : `:` + i;
    }
    sql += `)`;

    const regions = await query(sql, ids);

    return [...cities, ...regions];
}