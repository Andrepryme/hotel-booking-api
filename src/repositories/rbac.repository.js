const pool = require("../config/database");

async function userHasPermission(userId, permissionName) {
    const result = await pool.query(
        `
        SELECT 1
        FROM user_roles ur
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = $1
        AND p.name = $2
        LIMIT 1
        `,
        [userId, permissionName]
    );

    return result.rowCount > 0;
}

async function getUserRoleName(userId) {
    const result = await pool.query(
        `
        SELECT r.name
        FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = $1;
        `,
        [userId]
    );

    return result.rows[0].name;
}

module.exports = {
    userHasPermission,
    getUserRoleName
};