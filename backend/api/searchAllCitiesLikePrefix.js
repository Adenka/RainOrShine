const { query } = require('../db');

module.exports = async ({ prefix }) => {
    return await query(
        `SELECT * FROM (
            SELECT place.id_place, place.place_name
            FROM place JOIN city ON place.id_place = city.id_place
            WHERE place_name LIKE :1 ORDER BY place.place_name
        ) WHERE ROWNUM <= 10`,
        [`${prefix}%`]
    )
}