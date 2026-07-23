import teacherModel from '../models/teacher.model.js'
import userModel from '../models/user.model.js'

const teacherController = {
    getAllTeacher: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';

            let query = {};
            if (search) {
                // Find users matching search term (name, email, or phone)
                const matchingUsers = await userModel.find({
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                        { phoneNumber: { $regex: search, $options: 'i' } }
                    ]
                });
                
                // Query teachers matching user IDs or teacher code directly
                query = {
                    $or: [
                        { userId: { $in: matchingUsers.map(u => u._id) } },
                        { code: { $regex: search, $options: 'i' } }
                    ]
                };
            }

            const teachers = await teacherModel.find(query)
                .populate('userId')
                .populate('teacherPositionsId')
                .skip((page - 1) * limit)
                .limit(limit);

            const total = await teacherModel.countDocuments(query);
            return res.status(200).json({
                data: teachers,
                message: "Lấy danh sách giảng viên thành công",
                pagination: {
                    page: page,
                    limit: limit,
                    total: total,
                }
            });
        } catch (error) {
            console.error("Error in getAllTeacher:", error);
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
                startDate,
                endDate,
                teacherPositionsId,
                teacherPositions,
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

            let isUnique = false;
            let code = "";
            while (!isUnique) {
                code = (Math.floor(Math.random() * (9000000000)) + 1000000000).toString();
                const existingTeacher = await teacherModel.findOne({ code });
                if (!existingTeacher) {
                    isUnique = true;
                }
            }

            const newUser = new userModel({
                email,
                address: address || null,
                dob: dob ? new Date(dob) : null,
                name: name,
                identity: identity || null,
                phoneNumber: phoneNumber || null,
                role: "TEACHER",
                isDeleted: false
            });
            await newUser.save();

            const newTeacher = new teacherModel({
                code,
                startDate: startDate ? new Date(startDate) : undefined,
                isActive: true,
                isDeleted: false,
                userId: newUser._id,
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
                    identity: newUser.identity,
                    dob: newUser.dob,
                    isActive: newTeacher.isActive,
                    teacherPositionsId: newTeacher.teacherPositionsId,
                    degrees: newTeacher.degrees,
                    startDate: newTeacher.startDate,
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