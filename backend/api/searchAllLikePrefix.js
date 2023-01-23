const { query } = require('../db')

module.exports = async ({ prefix }) => {
    const cities = await query(
        `SELECT * FROM (
            SELECT place.id_place, place.place_name, (
                SELECT place.place_name
                FROM place
                JOIN region ON place.id_place = region.id_country
                JOIN city ON city.id_region = region.id_place
                WHERE city.id_place = C.id_place
            ) country_name
            FROM place JOIN city C ON place.id_place = C.id_place
            WHERE place_name LIKE :1 ORDER BY place.place_name
        ) WHERE ROWNUM <= 10`,
        [`${prefix}%`]
    );

    const regions = await query(
        `SELECT * FROM (
            SELECT place.id_place, place.place_name, (
                SELECT place.place_name
                FROM place
                JOIN region ON place.id_place = region.id_country
                WHERE region.id_place = R.id_place
            ) country_name
            FROM place JOIN region R ON place.id_place = R.id_place
            WHERE place_name LIKE :1 ORDER BY place.place_name
        ) WHERE ROWNUM <= 10`,
        [`${prefix}%`]
    )

    const countries = await query(
        `SELECT * FROM (
            SELECT place.id_place, place.place_name, '' as country_name
            FROM place JOIN country ON place.id_place = country.id_place
            WHERE place_name LIKE :1 ORDER BY place.place_name
        ) WHERE ROWNUM <= 10`,
        [`${prefix}%`]
    )

    return [...countries, ...regions, ...cities];
}