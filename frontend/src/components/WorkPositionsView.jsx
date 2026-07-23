import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Drawer, Form, Input } from 'antd';
import { Plus, RotateCw, Settings, X, Save } from 'lucide-react';
import { toast } from 'sonner';

const WorkPositionsView = () => {
  const [form] = Form.useForm();
  const [positions, setPositions] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Drawer states
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [statusActive, setStatusActive] = useState(true);

  // Fetch from database
  const fetchPositions = () => {
    setLoading(true);
    axios.get('/teacher-positions')
      .then((res) => {
        const data = res.data.data || [];
        setPositions(data);
      })
      .catch((err) => {
        console.error("Error fetching positions:", err);
        toast.error("Không thể tải danh sách chức vụ từ máy chủ");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.promise(
      new Promise((resolve, reject) => {
        axios.get('/teacher-positions')
          .then((res) => {
            const data = res.data.data || [];
            setPositions(data);
            resolve();
          })
          .catch((err) => {
            console.error(err);
            reject(err);
          })
          .finally(() => {
            setIsRefreshing(false);
          });
      }),
      {
        loading: 'Đang làm mới danh sách...',
        success: 'Đã làm mới danh sách chức vụ!',
        error: 'Có lỗi xảy ra khi làm mới'
      }
    );
  };

  const handleOpenCreate = () => {
    setEditingRecord(null);
    setStatusActive(true);
    form.resetFields();
    setShowDrawer(true);
  };

  const handleOpenEdit = (record) => {
    setEditingRecord(record);
    setStatusActive(record.isActive);
    form.setFieldsValue({
      code: record.code,
      name: record.name,
      des: record.des
    });
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    form.resetFields();
    setShowDrawer(false);
    setEditingRecord(null);
  };

  const handleFinish = (values) => {
    if (editingRecord) {
      // Edit mode using PUT API
      axios.put(`/teacher-positions/${editingRecord._id}`, {
        name: values.name,
        des: values.des,
        isActive: statusActive
      })
      .then(() => {
        toast.success(`Cập nhật vị trí "${values.name}" thành công!`);
        handleCloseDrawer();
        fetchPositions();
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || "Lỗi khi cập nhật chức vụ");
      });
    } else {
      // Create mode using POST API
      axios.post(`/teacher-positions`, {
        name: values.name,
        des: values.des,
        isActive: statusActive
      })
      .then(() => {
        toast.success(`Tạo mới vị trí "${values.name}" thành công!`);
        handleCloseDrawer();
        fetchPositions();
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || "Lỗi khi tạo mới chức vụ");
      });
    }
  };

  // Table columns definition
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: '8%',
      align: 'center',
      render: (_, __, index) => <span className="text-slate-500 font-medium">{index + 1}</span>
    },
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
      width: '12%',
      render: (text) => <span className="font-semibold text-slate-700">{text}</span>
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (text) => <span className="font-bold text-slate-800">{text}</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '15%',
      render: (active) => (
        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold text-white leading-5 select-none ${
          active ? 'bg-emerald-500' : 'bg-rose-500'
        }`}>
          {active ? 'Hoạt động' : 'Ngừng'}
        </span>
      )
    },
    {
      title: 'Mô tả',
      dataIndex: 'des',
      key: 'des',
      width: '32%',
      render: (text) => <span className="text-slate-500 text-xs">{text}</span>
    },
    {
      title: '',
      key: 'action',
      width: '8%',
      align: 'center',
      render: (_, record) => (
        <button
          onClick={() => handleOpenEdit(record)}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer active:scale-95"
          title="Thiết lập chức vụ"
        >
          <Settings className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Scope-contained custom styling overrides for Ant Design Drawer */}
      <style>{`
        .custom-position-drawer .ant-drawer-content-wrapper {
          box-shadow: -10px 0 25px -5px rgba(0, 0, 0, 0.04) !important;
        }
        .custom-position-drawer .ant-drawer-content {
          border-top-left-radius: 16px !important;
          border-bottom-left-radius: 16px !important;
        }
        .custom-position-drawer .ant-drawer-body {
          padding: 24px !important;
        }
        .custom-position-drawer .ant-form-item-label {
          padding-bottom: 4px !important;
        }
        .custom-position-drawer .ant-form-item {
          margin-bottom: 16px !important;
        }
        .custom-position-drawer .ant-input {
          border-radius: 8px !important;
          border-color: #e2e8f0 !important;
        }
        .custom-position-drawer .ant-input:hover {
          border-color: #6366f1 !important;
        }
        .custom-position-drawer .ant-input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1) !important;
        }
        .custom-position-table .ant-table {
          border-radius: 16px !important;
          overflow: hidden !important;
          border: 1px solid #f1f5f9 !important;
        }
        .custom-position-table .ant-table-thead > tr > th {
          background-color: #f8fafc !important;
          color: #475569 !important;
          font-weight: 700 !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          padding: 12px 16px !important;
        }
        .custom-position-table .ant-table-tbody > tr > td {
          padding: 12px 16px !important;
          font-size: 13px !important;
        }
      `}</style>

      {/* Control & Query Bar */}
      <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-end select-none">
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 bg-white rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo</span>
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 bg-white rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all active:scale-95 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-500' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="custom-position-table shadow-sm">
        <Table
          dataSource={positions}
          columns={columns}
          rowKey="_id"
          pagination={false}
          loading={loading}
        />
      </div>

      {/* Slide-out Settings/Creation Drawer */}
      <Drawer
        open={showDrawer}
        onClose={handleCloseDrawer}
        width={400}
        closable={false}
        destroyOnClose
        className="custom-position-drawer"
      >
        {/* Drawer Header */}
        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100 select-none">
          <button
            type="button"
            onClick={handleCloseDrawer}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
          <span className="text-[16px] font-bold text-slate-800">Vị trí công tác</span>
        </div>

        <Form form={form} layout="vertical" onFinish={handleFinish} className="text-slate-800">
          {/* Code Field */}
          <Form.Item
            name="code"
            label={<span className="text-[13px] font-bold text-slate-700">Mã <span className="text-rose-500">*</span></span>}
            rules={[{ required: true, message: 'Vui lòng điền mã vị trí' }]}
          >
            <Input size="large" placeholder="Nhập mã vị trí (VD: GVBM)" disabled={!!editingRecord} />
          </Form.Item>

          {/* Name Field */}
          <Form.Item
            name="name"
            label={<span className="text-[13px] font-bold text-slate-700">Tên <span className="text-rose-500">*</span></span>}
            rules={[{ required: true, message: 'Vui lòng điền tên vị trí' }]}
          >
            <Input size="large" placeholder="Nhập tên vị trí (VD: Giáo viên bộ môn)" />
          </Form.Item>

          {/* Description Field */}
          <Form.Item
            name="des"
            label={<span className="text-[13px] font-bold text-slate-700">Mô tả <span className="text-rose-500">*</span></span>}
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả nhiệm vụ công tác" />
          </Form.Item>

          {/* Status Switcher Field */}
          <div className="mb-6 select-none">
            <span className="block text-[13px] font-bold text-slate-700 mb-2">Trạng thái <span className="text-rose-500">*</span></span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatusActive(true)}
                className={`px-4.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-350'
                }`}
              >
                Hoạt động
              </button>
              <button
                type="button"
                onClick={() => setStatusActive(false)}
                className={`px-4.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !statusActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-350'
                }`}
              >
                Ngừng
              </button>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="flex justify-end pt-4 border-t border-slate-100 select-none">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 text-slate-650 rounded-xl text-[13px] font-bold transition-all shadow-sm bg-white cursor-pointer active:scale-95 group"
            >
              <Save className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <span>Lưu</span>
            </button>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

export default WorkPositionsView;
