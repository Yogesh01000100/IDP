const { ClientIdentity } = require('fabric-shim');

async function checkRole(ctx, role) {
    try {
        const clientObject = new ClientIdentity(ctx);
        const userRoles = clientObject.getAttributeValue('Roles');

        if (!userRoles) { // null check
            throw new Error(`Access denied! User has no registered roles`);
        }

        if (userRoles.includes(role)) {
            return true;
        } 
        else {
            throw new Error(`Access denied! Insufficient permissions. Current role: ${userRoles} | Required role: ${role}`);
        }
    } catch (error) {
        console.error("An error occurred in checkRole:", error.message);
        throw error;
    }
}

async function checkDoctorRole(ctx) {
    return await checkRole(ctx, 'doctor');
}

async function checkPatientRole(ctx) {
    return await checkRole(ctx, 'patient');
}

async function checkAsstDoctorRole(ctx) {
    return await checkRole(ctx, 'assistant_doctor');
}

module.exports = {
    checkPatientRole,
    checkDoctorRole,
    checkAsstDoctorRole

};