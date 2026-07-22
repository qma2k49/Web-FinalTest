import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: Boolean,
    isDeleted: Boolean,
    code: String,
    startDate: Date,
    endDate: Date,
    teacherPositions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'TeacherPosition'
    },
    degrees: {
        type: { type: String },
        school: String,
        major: String,
        year: Number,
        isGraduated: Boolean
    }
});

const teacherModel = mongoose.model('Teacher', teacherSchema);
export default teacherModel;