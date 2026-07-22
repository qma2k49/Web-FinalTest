import teacherModel from '../models/teacher.model.js'
import userModel from '../models/user.model.js'

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
    },

    createNewTeacher: async (req, res) => {
        try {
            const {
                name,
                email,
                phoneNumber,
                address,
                identity,
                dob,
                teacherPositionsId,
                degrees
            } = req.body;


            if (!name || !email) {
                return res.status(400).json({
                    message: "Vui lòng nhập đầy đủ thông tin tên và email",
                });
            }


            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    message: "Email đã tồn tại",
                });
            }

            // Generate unique random numeric code
            let isUnique = false;
            let code = "";
            while (!isUnique) {
                code = Math.floor(1000000000 + Math.random() * 9000000000).toString();
                const existingTeacher = await teacherModel.findOne({ code });
                if (!existingTeacher) {
                    isUnique = true;
                }
            }

            // Create User document
            const newUser = new userModel({
                name,
                email,
                phoneNumber: phoneNumber || phone || null,
                address: address || null,
                identity: identity || null,
                dob: dob ? new Date(dob) : null,
                isDeleted: false,
                role: "TEACHER"
            });
            await newUser.save();

            // Create Teacher document
            const newTeacher = new teacherModel({
                userId: newUser._id,
                code,
                isActive: true,
                isDeleted: false,
                teacherPositionsId: teacherPositionsId || teacherPositions || [],
                degrees: degrees || []
            });
            await newTeacher.save();

            return res.status(201).json({
                message: "Tạo giảng viên thành công",
                data: {
                    _id: newTeacher._id,
                    code: newTeacher.code,
                    name: newUser.name,
                    email: newUser.email,
                    phoneNumber: newUser.phoneNumber,
                    address: newUser.address,
                    isActive: newTeacher.isActive,
                    teacherPositions: newTeacher.teacherPositionsId,
                    degrees: newTeacher.degrees
                }
            });
        } catch (error) {
            console.error("Error in createNewTeacher:", error);
            return res.status(500).json({
                message: "Lỗi máy chủ nội bộ",
                error: error.message
            });
        }
    }
}

export default teacherController;