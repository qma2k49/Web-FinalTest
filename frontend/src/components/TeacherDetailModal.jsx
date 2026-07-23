import React from 'react';
import { Drawer, Tag, Button } from 'antd';

const TeacherDetailModal = ({ teacher, onClose }) => {
  return (
    <Drawer
      title={
        <span className="text-base font-bold text-indigo-900">
          Chi tiết thông tin giáo viên
        </span>
      }
      placement="right"
      onClose={onClose}
      open={!!teacher}
      width={480}
      extra={
        teacher && (
          <Tag color="success" className="uppercase font-bold tracking-wider rounded-md border-emerald-200">
            {teacher.status}
          </Tag>
        )
      }
    >
      {teacher && (
        <div className="flex flex-col gap-6 text-sm select-none">
          {/* Avatar and name header */}
          <div className="flex items-center gap-4 border-b border-gray-50 pb-5">
            <img
              src={teacher.avatar}
              alt={teacher.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-50"
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${teacher.name}`;
              }}
            />
            <div>
              <h4 className="text-lg font-bold text-gray-900">{teacher.name}</h4>
              <span className="text-xs text-gray-400 font-bold font-mono">ID: {teacher.id}</span>
            </div>
          </div>

          {/* Details layout grid */}
          <div className="flex flex-col gap-3">
            <div className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100/70 flex justify-between items-center">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Mã giáo viên</span>
              <span className="font-mono text-gray-900 font-semibold">{teacher.id}</span>
            </div>
            <div className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100/70 flex justify-between items-center">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Ngày tham gia</span>
              <span className="text-gray-900 font-semibold">{teacher.joinDate || 'N/A'}</span>
            </div>
            <div className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100/70 flex flex-col gap-1">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Email liên hệ</span>
              <span className="text-gray-900 font-semibold">{teacher.email}</span>
            </div>
            <div className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100/70 flex justify-between items-center">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Số điện thoại</span>
              <span className="text-gray-900 font-semibold">{teacher.phone}</span>
            </div>
            <div className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100/70 flex justify-between items-center">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Trình độ học vấn</span>
              <span className="text-gray-900 font-semibold">{teacher.degree}</span>
            </div>
            <div className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100/70 flex flex-col gap-1">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Chuyên ngành</span>
              <span className="text-gray-900 font-semibold">{teacher.major}</span>
            </div>
            <div className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100/70 flex justify-between items-center">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Bộ môn phụ trách</span>
              <span className="text-indigo-600 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-lg text-xs">{teacher.subject}</span>
            </div>
            <div className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100/70 flex flex-col gap-1">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Nhiệm vụ công tác</span>
              <span className="text-gray-900 font-semibold">{teacher.workRole}</span>
            </div>
            <div className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100/70 flex flex-col gap-1">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Địa chỉ thường trú</span>
              <span className="text-gray-900 font-semibold">{teacher.address}</span>
            </div>
          </div>

          <div className="mt-4">
            <Button block type="primary" onClick={onClose} size="large" className="!rounded-xl font-semibold !h-11 shadow-sm">
              Đóng hồ sơ
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default TeacherDetailModal;
