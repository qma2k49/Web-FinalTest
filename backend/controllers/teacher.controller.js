import teacherModel from '../models/teacher.model.js'

const teacherController = {
    getAllTeacher: async (req, res) => {
        try {
            const pageNum = Math.max(1, parseInt(req.query.page) || 1);
            const limitNum = Math.max(1, parseInt(req.query.limit) || 10);
            const skip = (pageNum - 1) * limitNum;

            const query = { isDeleted: { $ne: true } };

            const total = await teacherModel.countDocuments(query);
            const teachers = await teacherModel.find(query)
                .populate({
                    path: 'userId',
                    select: 'name email phoneNumber address'
                })
                .populate({
                    path: 'teacherPositions',
                    select: 'name code des'
                })
                .skip(skip)
                .limit(limitNum);

            const formattedTeachers = teachers.map(teacher => {
                const user = teacher.userId || {};
                return {
                    _id: teacher._id,
                    code: teacher.code,
                    name: user.name || null,
                    email: user.email || null,
                    phoneNumber: user.phoneNumber || null,
                    isActive: teacher.isActive,
                    address: user.address || null,
                    teacherPositions: teacher.teacherPositions || [],
                    degrees: teacher.degrees ? {
                        type: teacher.degrees.type || null,
                        school: teacher.degrees.school || null
                    } : null
                };
            });

            return res.status(200).json({
                data: formattedTeachers,
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            });

        } catch (error) {
            return res.status(500).json({
                message: "Lỗi máy chủ nội bộ",
            });
        }
    }
}

export default teacherController;