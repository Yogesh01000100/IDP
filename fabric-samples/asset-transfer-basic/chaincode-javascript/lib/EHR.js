/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const { Contract } = require('fabric-contract-api');

class EHRContract extends Contract {

    // Initialize some sample patient records in the ledger
    async InitLedger(ctx) {
        const patientRecords = [
            {
                id: 'patient1',
                data: {
                    name: 'Ishaan Sharma',
                    age: 51,
                    gender: 'Male',
                    condition: 'Epilepsy',
                    lastVisit: '2023-04-15',
                    medications: ['Levetiracetam'],
                    allergies: ['Nuts'],
                    bloodType: 'A+',
                    emergencyContact: {
                        name: 'Aarav Mehta',
                        relation: 'Husband',
                        phone: '+911234567891'
                    }
                }
            },
            {
                id: 'userA',
                data: {
                    name: 'Rahul Sharma',
                    age: 37,
                    gender: 'Male',
                    condition: 'Diabetes',
                    lastVisit: '2021-06-23',
                    medications: ['Metformin'],
                    allergies: ['Penicillin'],
                    bloodType: 'B-',
                    emergencyContact: {
                        name: 'Sara Patel',
                        relation: 'Daughter',
                        phone: '+911234567893'
                    },
                    LabTests: {
                        testName: 'Blood Glucose',
                        result: '98 mg/dL',
                        date: '2023-04-10',
                        normalRange: '70-99 mg/dL'
                    },
                }
            },
            {
                id: 'patient3',
                data: {
                    name: 'Ishaan Mehta',
                    age: 65,
                    gender: 'Male',
                    condition: 'Asthma',
                    lastVisit: '2021-08-07',
                    medications: ['Albuterol'],
                    allergies: ['Dust'],
                    bloodType: 'B-',
                    emergencyContact: {
                        name: 'Ishaan Mehta',
                        relation: 'Son',
                        phone: '+911234567893'
                    }
                }
            },
            {
                id: 'patient4',
                data: {
                    name: 'Vivaan Reddy',
                    age: 28,
                    gender: 'Male',
                    condition: 'Diabetes',
                    lastVisit: '2022-04-19',
                    medications: ['Metformin'],
                    allergies: ['Penicillin'],
                    bloodType: 'AB+',
                    emergencyContact: {
                        name: 'Saanvi Iyer',
                        relation: 'Daughter',
                        phone: '+911234567894'
                    }
                }
            },
            {
                id: 'patient5',
                data: {
                    name: 'Vivaan Iyer',
                    age: 64,
                    gender: 'Male',
                    condition: 'Asthma',
                    lastVisit: '2021-10-09',
                    medications: ['Corticosteroids'],
                    allergies: ['Latex'],
                    bloodType: 'A-',
                    emergencyContact: {
                        name: 'Aditi Gupta',
                        relation: 'Daughter',
                        phone: '+911234567895'
                    }
                }
            },
            {
                id: 'patient6',
                data: {
                    name: 'Ishaan Reddy',
                    age: 55,
                    gender: 'Female',
                    condition: 'Hypertension',
                    lastVisit: '2022-05-08',
                    medications: ['Hydrochlorothiazide'],
                    allergies: ['Aspirin'],
                    bloodType: 'B+',
                    emergencyContact: {
                        name: 'Ananya Iyer',
                        relation: 'Wife',
                        phone: '+911234567896'
                    }
                }
            }
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
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
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
