import mongoose from 'mongoose';

const teacherPositionSchema = new mongoose.Schema({
    name: String,
    code: String,
    des: String,
    isActive: Boolean,
    isDeleted: Boolean,
}, {
    timestamps: true
});

const teacherPositionModel = mongoose.model('TeacherPosition', teacherPositionSchema);
export default teacherPositionModel;