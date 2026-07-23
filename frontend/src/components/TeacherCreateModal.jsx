import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';

const TeacherCreateModal = ({ isOpen, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={
        <span className="text-base font-bold text-indigo-900">
          Tạo mới tài khoản giáo viên
        </span>
      }
      open={isOpen}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={520}
      className="custom-antd-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          degree: 'Cử nhân',
          subject: 'N/A',
          workRole: 'Giáo viên bộ môn',
          status: 'Đang công tác'
        }}
        className="mt-4"
      >

        <Form.Item
          name="name"
          label={<span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Họ và tên <span className="text-rose-500">*</span></span>}
          rules={[{ required: true, message: 'Vui lòng điền họ và tên giáo viên' }]}
        >
          <Input size="large" placeholder="Ví dụ: Nguyễn Văn A" className="!rounded-xl" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="email"
            label={<span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Email liên hệ <span className="text-rose-500">*</span></span>}
            rules={[
              { required: true, message: 'Vui lòng nhập Email' },
              { type: 'email', message: 'Định dạng Email không hợp lệ' }
            ]}
          >
            <Input size="large" placeholder="name@school.edu.vn" className="!rounded-xl" />
          </Form.Item>

          <Form.Item
            name="phone"
            label={<span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Số điện thoại <span className="text-rose-500">*</span></span>}
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input size="large" placeholder="Ví dụ: 0975..." className="!rounded-xl" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="degree"
            label={<span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Trình độ học vấn</span>}
          >
            <Select
              size="large"
              className="w-full"
              dropdownClassName="rounded-xl"
              options={[
                { value: 'Cử nhân', label: 'Cử nhân' },
                { value: 'Thạc sĩ', label: 'Thạc sĩ' },
                { value: 'Tiến sĩ', label: 'Tiến sĩ' }
              ]}
            />
          </Form.Item>

          <Form.Item
            name="major"
            label={<span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Chuyên ngành <span className="text-rose-500">*</span></span>}
            rules={[{ required: true, message: 'Vui lòng nhập chuyên ngành' }]}
          >
            <Input size="large" placeholder="Ví dụ: Công nghệ Thông Tin" className="!rounded-xl" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">



          <Form.Item
            name="workRole"
            label={<span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">TT công tác (Nhiệm vụ)</span>}
          >
            <Input size="large" placeholder="Ví dụ: Giáo viên bộ môn" className="!rounded-xl" />
          </Form.Item>
        </div>

        <Form.Item
          name="address"
          label={<span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Địa chỉ thường trú <span className="text-rose-500">*</span></span>}
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ thường trú' }]}
        >
          <Input size="large" placeholder="Ví dụ: Hà Nội, Lâm Đồng..." className="!rounded-xl" />
        </Form.Item>

        <Form.Item name="status" hidden>
          <Input />
        </Form.Item>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
          <Button
            type="default"
            size="large"
            className="!rounded-xl font-semibold !h-11 cursor-pointer"
            onClick={() => {
              form.resetFields();
              onClose();
            }}
          >
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="!rounded-xl font-semibold !h-11 cursor-pointer"
          >
            Lưu lại
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TeacherCreateModal;
