const { query } = require('../db');

module.exports = async ({ id, left, right }) => {
    return await query(
        `SELECT *
        FROM weather JOIN place ON weather.id_place = place.id_place
        WHERE place.id_place = :1 AND id_period BETWEEN :2 AND :3`,
        [id, left, right]
    );
}