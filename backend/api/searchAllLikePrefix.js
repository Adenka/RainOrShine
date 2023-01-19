const { query } = require('../db')

module.exports = async ({ prefix }) => {
    return await query(
        `SELECT * FROM (
            SELECT id_place, place_name
            FROM place
            WHERE place_name LIKE :1 ORDER BY place_name
        ) WHERE ROWNUM <= 10`,
        [`${prefix}%`]
    );
}