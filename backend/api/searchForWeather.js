const { query } = require('../db');

module.exports = async ({ ids, left, right }) => {
    if (ids.length === 0) {
        return [];
    }
    
    let sql = `
        SELECT place.id_place, place.place_name, weather.*
        FROM place JOIN weather ON place.id_place = weather.id_place
        WHERE id_period BETWEEN :0 AND :1
        AND place.id_place
        IN (
    `;
                
    for (let i = 0; i < ids.length; ++i) {
        sql += (i > 0) ? `, :` + i+2 : `:` + i+2;
    }
    sql += `)`;
    
    return await query(sql, [left, right, ...ids]);
}