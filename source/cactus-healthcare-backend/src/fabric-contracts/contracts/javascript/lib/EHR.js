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
                        testName: 'Hemoglobin A1C',
                        result: '6.5%',
                        date: '2023-06-15',
                        normalRange: '4%-5.6%'
                    },
                }
            },
            {
                id: 'userB',
                data: {
                    name: 'Vikram Singh',
                    age: 22,
                    gender: 'Male',
                    condition: 'Migraine',
                    lastVisit: '2022-09-26',
                    medications: ['Metformin'],
                    allergies: ['Latex'],
                    bloodType: 'O+',
                    emergencyContact: {
                        name: 'Raj Gupta',
                        relation: 'Son',
                        phone: '+911234567890'
                    }
                }
            },
            {
                id: 'user2',
                data: {
                    name: 'Rohan Bhatnagar',
                    age: 43,
                    gender: 'Male',
                    condition: 'Heart Disease',
                    lastVisit: '2023-03-27',
                    medications: ['Metformin'],
                    allergies: ['None'],
                    bloodType: 'AB+',
                    emergencyContact: {
                        name: 'Raj Gupta',
                        relation: 'Son',
                        phone: '+911234567890'
                    }
                }
            },
            {
                id: 'user3',
                data: {
                    name: 'Simran Mishra',
                    age: 45,
                    gender: 'Female',
                    condition: 'Heart Disease',
                    lastVisit: '2023-04-08',
                    medications: ['Albuterol'],
                    allergies: ['None'],
                    bloodType: 'O-',
                    emergencyContact: {
                        name: 'Raj Gupta',
                        relation: 'Son',
                        phone: '+911234567890'
                    }
                }
            },
            {
                id: 'user4',
                data: {
                    name: 'Simran Mishra',
                    age: 60,
                    gender: 'Male',
                    condition: 'Panic Disorder',
                    lastVisit: '2021-08-23',
                    medications: ['Aspirin', 'Lisinopril'],
                    allergies: ['Pollen'],
                    bloodType: 'AB-',
                    emergencyContact: {
                        name: 'Anita Singh',
                        relation: 'Wife',
                        phone: '+911234567891'
                    }
                }
            },
            {
                id: 'user5',
                data: {
                    name: 'Rahul Sharma',
                    age: 61,
                    gender: 'Male',
                    condition: 'Asthma',
                    lastVisit: '2022-04-22',
                    medications: ['Albuterol'],
                    allergies: ['Pollen'],
                    bloodType: 'AB+',
                    emergencyContact: {
                        name: 'Rohit Reddy',
                        relation: 'Father',
                        phone: '+911234567894'
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
