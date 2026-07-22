import teacherPositionModel from "../models/teacherPosition.model.js";

const teacherPositionController = {
    getAllPositions: async (req, res) => {
        try {
            const positions = await teacherPositionModel.find();
            return res.status(200).json({
                data: positions,
                message: "Lấy danh sách chức vụ thành công"
            });
        } catch (error) {
            return res.status(500).json({
                message: "Lỗi máy chủ nội bộ",
                error: error.message
            });
        }
    },

    createNewPosition: async (req, res) => {
        try {
            const { name, des } = req.body;
            if (!name) {
                return res.status(400).json({
                    message: "Vui lòng nhập đầy đủ thông tin tên chức vụ"
                });
            }

            let isUnique = false;
            let code = "";
            while (!isUnique) {
                code = (Math.floor(Math.random() * (9000000000)) + 1000000000).toString();
                const existingPosition = await teacherPositionModel.findOne({ code });
                if (!existingPosition) {
                    isUnique = true;
                }
            }

            const newPosition = new teacherPositionModel({
                name,
                des,
                code,
                isActive: true,
                isDeleted: false
            });
            await newPosition.save();

            return res.status(201).json({
                data: {
                    _id: newPosition._id,
                    code: newPosition.code,
                    name: newPosition.name,
                    des: newPosition.des,
                    isActive: newPosition.isActive,
                },
                message: "Tạo chức vụ thành công"
            });
        } catch (error) {
            return res.status(500).json({
                message: "Lỗi máy chủ nội bộ",
                error: error.message
            });
        }
    }
}

export default teacherPositionController;