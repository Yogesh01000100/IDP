'use strict';

const { Contract } = require('fabric-contract-api');
const {
    checkABAC1,
    checkABAC2,
    checkABAC3,
    checkABAC4,
    checkABAC5,
    checkABAC6,
    checkABAC7,
    checkABAC8,
    checkABAC9,
    checkABAC10
} = require('./abac-check.js');

class EHRContract extends Contract {
    async InitLedger(ctx) {
        const hospitalData = {
            h_id: "hsp1",
            name: "City Hospital",
            address: "123 Main St, Metropolis",
            contact_email: "info@cityhospital.com",
            contact_phone: "555-123456",
            network_id: "HSP1",
            capabilities: ["emergency", "surgery", "pediatrics"],
        };

        await ctx.stub.putState(hospitalData.h_id, Buffer.from(JSON.stringify(hospitalData)));
        console.info(`Hospital record ${hospitalData.h_id} initialized`);
    }

    async GenericFunction1(ctx) {
        const validUser = await checkABAC1(ctx);
        if (!validUser) {
            throw new Error("Access denied. Insufficient permissions.");
        }
        return await this.GetHospitalData(ctx, "hsp1");
    }

    async GenericFunction2(ctx) {
        const validUser = await checkABAC2(ctx);
        if (!validUser) {
            throw new Error("Access denied. Insufficient permissions.");
        }
        return await this.GetHospitalData(ctx, "hsp1");
    }

    async GenericFunction3(ctx) {
        const validUser = await checkABAC3(ctx);
        if (!validUser) {
            throw new Error("Access denied. Insufficient permissions.");
        }
        return await this.GetHospitalData(ctx, "hsp1");
    }

    async GenericFunction4(ctx) {
        const validUser = await checkABAC4(ctx);
        if (!validUser) {
            throw new Error("Access denied. Insufficient permissions.");
        }
        return await this.GetHospitalData(ctx, "hsp1");
    }

    async GenericFunction5(ctx) {
        const validUser = await checkABAC5(ctx);
        if (!validUser) {
            throw new Error("Access denied. Insufficient permissions.");
        }
        return await this.GetHospitalData(ctx, "hsp1");
    }

    async GenericFunction6(ctx) {
        const validUser = await checkABAC6(ctx);
        if (!validUser) {
            throw new Error("Access denied. Insufficient permissions.");
        }
        return await this.GetHospitalData(ctx, "hsp1");
    }

    async GenericFunction7(ctx) {
        const validUser = await checkABAC7(ctx);
        if (!validUser) {
            throw new Error("Access denied. Insufficient permissions.");
        }
        return await this.GetHospitalData(ctx, "hsp1");
    }

    async GenericFunction8(ctx) {
        const validUser = await checkABAC8(ctx);
        if (!validUser) {
            throw new Error("Access denied. Insufficient permissions.");
        }
        return await this.GetHospitalData(ctx, "hsp1");
    }

    async GenericFunction9(ctx) {
        const validUser = await checkABAC9(ctx);
        if (!validUser) {
            throw new Error("Access denied. Insufficient permissions.");
        }
        return await this.GetHospitalData(ctx, "hsp1");
    }

    async GenericFunction10(ctx) {
        const validUser = await checkABAC10(ctx);
        if (!validUser) {
            throw new Error("Access denied. Insufficient permissions.");
        }
        return await this.GetHospitalData(ctx, "hsp1");
    }

    async GetHospitalData(ctx, h_id) {
        const hospitalData = await ctx.stub.getState(h_id);
        if (!hospitalData || hospitalData.length === 0) {
            throw new Error(`The hospital with ID ${h_id} does not exist`);
        }

        return hospitalData.toString();
    }
}

module.exports = EHRContract;
