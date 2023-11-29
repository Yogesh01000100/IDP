/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const { Contract } = require("fabric-contract-api");

class EHRContract extends Contract {

    // Initialize some sample patient records in the ledger
    async InitLedger(ctx) {
        const patientRecords = [
            {
                id: 'userA',
                data: {
                    name: 'XYZ',
                    age: 30,
                    condition: 'Diabetes',
                    lastVisit: 'net-1',
                },
            },
            {
                id: 'userB',
                data: {
                    name: 'MNO',
                    age: 25,
                    condition: 'Hypertension',
                    lastVisit: 'net-2',
                },
            },
        ];

        for (const record of patientRecords) {
            await ctx.stub.putState(record.id, Buffer.from(JSON.stringify(record)));
            console.info(`Patient record ${record.id} initialized`);
        }
    }

    // Create a new patient record
    async CreatePatientRecord(ctx, patientId, data) {
        // Check if a patient record with the given ID already exists
        const exists = await this.PatientRecordExists(ctx, patientId);
        if (exists) {
            throw new Error(`The patient record with ID ${patientId} already exists`);
        }
    
        // Create a new record object. Here, 'data' is expected to be an object.
        const record = { id: patientId, data: data };
    
        // Save the new record to the ledger
        // The 'data' object is included in the record and serialized as a JSON string
        await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(record)));
    }
    

    // Read an existing patient record
    async ReadPatientRecord(ctx, patientId) {
        const exists = await this.PatientRecordExists(ctx, patientId);
        if (!exists) {
            throw new Error(`The patient record ${patientId} does not exist`);
        }

        const data = await ctx.stub.getState(patientId);
        return data.toString();
    }

    // Check if a patient record exists
    async PatientRecordExists(ctx, patientId) {
        const record = await ctx.stub.getState(patientId);
        return !!record && record.length > 0;
    }

    // Get all patient records from the ledger
    async GetAllPatientRecords(ctx) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange("", "");
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString("utf8");
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    // Update an existing patient record
    async UpdatePatientRecord(ctx, patientId, newRecordData) {
        const exists = await this.PatientRecordExists(ctx, patientId);
        if (!exists) {
            throw new Error(`The patient record ${patientId} does not exist`);
        }

        const updatedRecord = { id: patientId, data: newRecordData };
        await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(updatedRecord)));
    }

    // Delete a patient record
    async DeletePatientRecord(ctx, patientId) {
        const exists = await this.PatientRecordExists(ctx, patientId);
        if (!exists) {
            throw new Error(`The patient record ${patientId} does not exist`);
        }

        await ctx.stub.deleteState(patientId);
    }
}

module.exports = EHRContract;
