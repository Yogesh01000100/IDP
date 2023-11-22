/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from "fabric-contract-api";

@Info({
    title: "EHRContract",
    description: "Smart contract for managing electronic health records (EHR)"
})
export class EHRContract extends Contract {

    // CreatePatientRecord creates a new patient record in the world state.
    @Transaction()
    public async CreatePatientRecord(ctx: Context, patientId: string, recordData: string): Promise<void> {
        const exists: boolean = await this.PatientRecordExists(ctx, patientId);
        if (exists) {
            throw new Error(`The patient record with ID ${patientId} already exists`);
        }

        const record = {
            id: patientId,
            data: recordData
        };

        await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(record)));
    }

    // ReadPatientRecord returns the record stored in the world state with given id.
    @Transaction(false)
    @Returns("string")
    public async ReadPatientRecord(ctx: Context, patientId: string): Promise<string> {
        const exists: boolean = await this.PatientRecordExists(ctx, patientId);
        if (!exists) {
            throw new Error(`The patient record ${patientId} does not exist`);
        }

        const data = await ctx.stub.getState(patientId);
        return data.toString();
    }

    // PatientRecordExists returns true when record with given ID exists in world state.
    @Transaction(false)
    @Returns("boolean")
    public async PatientRecordExists(ctx: Context, patientId: string): Promise<boolean> {
        const record = await ctx.stub.getState(patientId);
        return !!record && record.length > 0;
    }

    // GetAllPatientRecords returns all patient records found in world state.
    @Transaction(false)
    @Returns("string")
    public async GetAllPatientRecords(ctx: Context): Promise<string> {
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

    // UpdatePatientRecord updates an existing patient record in the world state with provided parameters.
    @Transaction()
    public async UpdatePatientRecord(ctx: Context, patientId: string, newRecordData: string): Promise<void> {
        const exists: boolean = await this.PatientRecordExists(ctx, patientId);
        if (!exists) {
            throw new Error(`The patient record ${patientId} does not exist`);
        }

        const updatedRecord = {
            id: patientId,
            data: newRecordData
        };

        await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(updatedRecord)));
    }

    // DeletePatientRecord deletes a given patient record from the world state.
    @Transaction()
    public async DeletePatientRecord(ctx: Context, patientId: string): Promise<void> {
        const exists: boolean = await this.PatientRecordExists(ctx, patientId);
        if (!exists) {
            throw new Error(`The patient record ${patientId} does not exist`);
        }

        await ctx.stub.deleteState(patientId);
    }
}
