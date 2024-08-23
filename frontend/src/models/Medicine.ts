import mongoose from "mongoose";

const MedicineSchema = new mongoose.Schema({
    batchId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    medicineName: { 
        type: String, 
        required: true 
    },
    events: {
        batchCreated: {
            type: Boolean,
            default: false
        },
        batchApproved: {
            type: Boolean,
            default: false
        },
        batchDisapproved: {
            type: Boolean,
            default: false
        },
        batchRecalled: {
            type: Boolean,
            default: false
        },
        manufacturerOutgoingRFID: {
            type: Boolean,
            default: false
        },
        distributorIncomingRFID: {
            type: Boolean,
            default: false
        },
        distributorOutgoingRFID: {
            type: Boolean,
            default: false
        },
        providerIncomingRFID: {
            type: Boolean,
            default: false
        }
    },
    timestamps: {
        batchCreatedAt: {
            type: Date,
            default: null
        },
        batchApprovedAt: {
            type: Date,
            default: null
        },
        batchDisapprovedAt: {
            type: Date,
            default: null
        },
        batchRecalledAt: {
            type: Date,
            default: null
        },
        manufacturerOutgoingRFIDAt: {
            type: Date,
            default: null
        },
        distributorIncomingRFIDAt: {
            type: Date,
            default: null
        },
        distributorOutgoingRFIDAt: {
            type: Date,
            default: null
        },
        providerIncomingRFIDAt: {
            type: Date,
            default: null
        }
    }
}, { timestamps: true });

const Medicine = mongoose.models.Medicine || mongoose.model("Medicine", MedicineSchema);

export default Medicine;
