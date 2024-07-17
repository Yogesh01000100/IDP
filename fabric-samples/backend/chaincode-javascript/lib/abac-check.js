'use strict';

const { ClientIdentity } = require('fabric-shim');

async function checkAttributes(ctx, requiredAttributes) {
    try {
        const clientObject = new ClientIdentity(ctx);
        for (const attribute of requiredAttributes) {
            const value = clientObject.getAttributeValue(attribute);
            if (!value) {
                throw new Error(`Access denied! Missing required attribute: ${attribute}`);
            }
        }
        return true;
    } catch (error) {
        console.error('An error occurred in checkAttributes:', error.message);
        throw error;
    }
}

async function checkABAC1(ctx) {
    const attributes = Array.from({ length: 100 }, (_, i) => `attr${i + 1}`);
    return await checkAttributes(ctx, attributes);
}

async function checkABAC2(ctx) {
    const attributes = Array.from({ length: 100 }, (_, i) => `attr${i + 101}`);
    return await checkAttributes(ctx, attributes);
}

async function checkABAC3(ctx) {
    const attributes = Array.from({ length: 100 }, (_, i) => `attr${i + 201}`);
    return await checkAttributes(ctx, attributes);
}

async function checkABAC4(ctx) {
    const attributes = Array.from({ length: 100 }, (_, i) => `attr${i + 301}`);
    return await checkAttributes(ctx, attributes);
}

async function checkABAC5(ctx) {
    const attributes = Array.from({ length: 100 }, (_, i) => `attr${i + 401}`);
    return await checkAttributes(ctx, attributes);
}

async function checkABAC6(ctx) {
    const attributes = Array.from({ length: 100 }, (_, i) => `attr${i + 501}`);
    return await checkAttributes(ctx, attributes);
}

async function checkABAC7(ctx) {
    const attributes = Array.from({ length: 100 }, (_, i) => `attr${i + 601}`);
    return await checkAttributes(ctx, attributes);
}

async function checkABAC8(ctx) {
    const attributes = Array.from({ length: 100 }, (_, i) => `attr${i + 701}`);
    return await checkAttributes(ctx, attributes);
}

async function checkABAC9(ctx) {
    const attributes = Array.from({ length: 100 }, (_, i) => `attr${i + 801}`);
    return await checkAttributes(ctx, attributes);
}

async function checkABAC10(ctx) {
    const attributes = Array.from({ length: 100 }, (_, i) => `attr${i + 901}`);
    return await checkAttributes(ctx, attributes);
}

module.exports = {
    checkABAC1,
    checkABAC2,
    checkABAC3,
    checkABAC4,
    checkABAC5,
    checkABAC6,
    checkABAC7,
    checkABAC8,
    checkABAC9,
    checkABAC10,
};
