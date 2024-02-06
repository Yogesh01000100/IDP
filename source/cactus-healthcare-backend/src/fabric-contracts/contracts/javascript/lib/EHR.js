'use strict';
const { Contract } = require('fabric-contract-api');
const { checkDoctorRole, checkPatientRole } = require('./role-check.js');

class EHRContract extends Contract {

    // Create a new patient record
    async CreatePatientRecord(ctx, patientId, data) {
        try {
            const validUser = await checkDoctorRole(ctx.stub);

            if (!validUser) {
                throw new Error(`Access denied! isvalid User ? : -> ${validUser}`);
            }

            const exists = await this.PatientRecordExists(ctx, patientId);
            if (exists) {
                throw new Error(`The patient record with ID ${patientId} already exists`);
            }

            const record = { u_id: patientId, data: data };
            await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(record)));
        } catch (error) {
            throw error;
        }
    }

    // Read an existing patient record
    async ReadPatientRecord(ctx, patientId) {
        try {
            const validUser = await checkPatientRole(ctx.stub);
            if (!validUser) {
                throw new Error('Access denied. Insufficient permissions.');
            }
    
            const exists = await this.PatientRecordExists(ctx, patientId);
            if (!exists) {
                throw new Error(`The patient record ${patientId} does not exist`);
            }
    
            const data = await ctx.stub.getState(patientId);
            return data.toString();
        } catch (error) {
            console.error("An error occurred in ReadPatientRecord:", error.message);
            throw error;
        }
    }

    // Update an existing patient record
    async UpdatePatientRecord(ctx, patientId, newRecordData) {
        try {
            const validUser = checkDoctorRole(ctx.stub);

            if (!validUser) {
                throw new Error('Access denied. Insufficient permissions.');
            }

            const exists = await this.PatientRecordExists(ctx, patientId);
            if (!exists) {
                throw new Error(`The patient record ${patientId} does not exist`);
            }

            const updatedRecord = { id: patientId, data: newRecordData };
            await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(updatedRecord)));
        } catch (error) {
            console.error("An error occurred in UpdatePatientRecord:", error.message);
            throw error;
        }
    }

    // Delete a patient record
    async DeletePatientRecord(ctx, patientId) {
        try {

            const exists = await this.PatientRecordExists(ctx, patientId);
            if (!exists) {
                throw new Error(`The patient record ${patientId} does not exist`);
            }

            await ctx.stub.deleteState(patientId);
        } catch (error) {
            console.error("An error occurred in DeletePatientRecord:", error.message);
            throw error;
        }
    }

    // Check if a patient record exists
    async PatientRecordExists(ctx, patientId) {
        try {
            const record = await ctx.stub.getState(patientId);
            return !!record && record.length > 0;
        } catch (error) {
            console.error("An error occurred in PatientRecordExists:", error.message);
            throw error;
        }
    }
}

module.exports = EHRContract;