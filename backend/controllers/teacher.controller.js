import teacherModel from '../models/teacher.model.js'

const teacherController = {
    getAllTeacher: async (req, res) => {
        try {
            const { page, limit } = req.query;
            const teachers = await teacherModel.find().skip((page - 1) * limit).limit(limit);
            const total = await teacherModel.countDocuments();
            return res.status(200).json({
                data: teachers,
                message: "Lấy danh sách giảng viên thành công",
                pagination: {
                    page: page,
                    limit: limit,
                    total: total,
                }
            })
        } catch (error) {
            return res.status(500).json({
                message: "Lỗi máy chủ nội bộ",
            });
        }
    }
}

export default teacherController;