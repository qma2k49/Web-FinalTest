import React from 'react';
import { Table } from 'antd';
import { Eye, Info } from 'lucide-react';

const TeacherTable = ({
  teachers,
  selectedRowId,
  setSelectedRowId,
  onViewDetail,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalCount,
  totalPages
}) => {

  const columns = [
    {
      title: 'Mã',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => (
        <span className={`font-mono font-medium ${selectedRowId === record.id ? 'text-indigo-600 font-bold' : 'text-gray-900'}`}>
          {id}
        </span>
      )
    },
    {
      title: 'Giáo viên',
      key: 'teacher',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.avatar}
            alt={record.name}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-100 ring-offset-1"
            onError={(e) => {
              e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${record.name}`;
            }}
          />
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${selectedRowId === record.id ? 'text-indigo-900' : 'text-gray-900'}`}>
              {record.name}
            </span>
            <span className="text-[11px] text-gray-400 font-semibold">{record.email}</span>
            <span className="text-[11px] text-gray-400 font-semibold">{record.phone}</span>
          </div>
        </div>
      )
    },
    {
      title: 'Trình độ (cao nhất)',
      key: 'degree',
      render: (_, record) => (
        <div className="flex flex-col text-xs leading-relaxed">
          <span className={`font-semibold ${selectedRowId === record.id ? 'text-indigo-700' : 'text-gray-700'}`}>
            Bậc: {record.degree}
          </span>
          <span className="text-gray-400">Chuyên ngành: {record.major}</span>
        </div>
      )
    },
    {
      title: 'Bộ môn',
      dataIndex: 'subject',
      key: 'subject',
      align: 'center',
      render: (subject) => (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
          subject === 'N/A' 
            ? 'text-gray-400 bg-gray-50' 
            : 'text-indigo-600 bg-indigo-50/50'
        }`}>
          {subject}
        </span>
      )
    },
    {
      title: (
        <div className="flex items-center gap-1 select-none">
          <span>TT Công tác</span>
          <Info className="w-3.5 h-3.5 text-indigo-400 cursor-help" title="Thông tin vai trò công tác" />
        </div>
      ),
      dataIndex: 'workRole',
      key: 'workRole',
      render: (workRole) => <span className="text-xs font-medium text-gray-600">{workRole}</span>
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (address, record) => (
        <span className={`text-xs font-semibold ${selectedRowId === record.id ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}>
          {address}
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-sm shadow-emerald-100">
          <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
          {status}
        </span>
      )
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(record);
          }}
          className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Chi tiết</span>
        </button>
      )
    }
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden teacher-table-container">
      <Table
        dataSource={teachers}
        columns={columns}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => setSelectedRowId(record.id)
        })}
        rowClassName={(record) => 
          `cursor-pointer transition-all duration-150 ${
            selectedRowId === record.id 
              ? 'bg-indigo-50/40 hover:bg-indigo-50/60' 
              : 'hover:bg-gray-50/30'
          }`
        }
        pagination={{
          current: currentPage,
          pageSize: itemsPerPage,
          total: totalCount,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setItemsPerPage(pageSize);
          },
          pageSizeOptions: [10, 15, 20],
          showSizeChanger: true,
          locale: { items_per_page: '/ trang' },
          showTotal: (total) => (
            <div className="text-gray-500 font-semibold text-xs">
              Tổng: <span className="text-indigo-600 font-bold">{total}</span>
            </div>
          ),
        }}
        className="custom-antd-table"
      />
    </div>
  );
};

export default TeacherTable;
