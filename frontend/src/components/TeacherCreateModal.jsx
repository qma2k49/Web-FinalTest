import React, { useState, useRef } from 'react';
import { Modal, Form, Input, Select, DatePicker, Table } from 'antd';
import { X, UploadCloud, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Simplified custom vector SVG of the teacher avatar matching the mockup character
const DefaultAvatarSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full bg-indigo-50/50">
    <circle cx="50" cy="50" r="50" fill="#EBF2FF" />
    <circle cx="50" cy="45" r="20" fill="#FDBA74" />
    <path d="M50,22 C40,22 34,26 32,34 C34,31 38,30 42,32 C45,28 55,28 58,32 C62,30 66,31 68,34 C66,26 60,22 50,22 Z" fill="#3B2314" />
    <circle cx="43" cy="45" r="6" stroke="#1E293B" strokeWidth="1.5" fill="none" />
    <circle cx="57" cy="45" r="6" stroke="#1E293B" strokeWidth="1.5" fill="none" />
    <line x1="49" y1="45" x2="51" y2="45" stroke="#1E293B" strokeWidth="1.5" />
    <circle cx="43" cy="45" r="1.5" fill="#1E293B" />
    <circle cx="57" cy="45" r="1.5" fill="#1E293B" />
    <path d="M47,54 C47,54 48,56 50,56 C52,56 53,54 53,54" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" fill="none" />
    <path d="M25,82 C25,70 35,70 41,74 C45,77 55,77 59,74 C65,70 75,70 75,82 L75,100 L25,100 Z" fill="#1E293B" />
    <path d="M41,74 L50,90 L59,74" fill="#FDBA74" />
    <path d="M50,90 L38,100 L62,100 Z" fill="#FDBA74" />
    <path d="M50,90 L46,100 L54,100 Z" fill="#FFFFFF" />
    <path d="M25,82 L40,100 L25,100 Z" fill="#1A365D" />
    <path d="M75,82 L60,100 L75,100 Z" fill="#1A365D" />
  </svg>
);

const TeacherCreateModal = ({ isOpen, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);

  // States
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [degreesList, setDegreesList] = useState([]);
  const [newDegree, setNewDegree] = useState({
    degreeType: 'Cử nhân',
    school: '',
    major: '',
    status: 'Hoàn thành',
    year: ''
  });

  // Avatar upload handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => setAvatarUrl(event.target.result);
      reader.readAsDataURL(file);
    } else {
      toast.error("Vui lòng chọn file hình ảnh hợp lệ");
    }
  };

  // Add degree to list
  const handleAddDegree = () => {
    if (!newDegree.school.trim() || !newDegree.major.trim()) {
      toast.warning("Vui lòng nhập đầy đủ Trường và Chuyên ngành");
      return;
    }
    setDegreesList([...degreesList, { ...newDegree, id: Date.now() }]);
    setNewDegree({ degreeType: 'Cử nhân', school: '', major: '', status: 'Hoàn thành', year: '' });
  };

  const handleDeleteDegree = (id) => {
    setDegreesList(degreesList.filter((d) => d.id !== id));
  };

  // Compute highest degree type for parent App schema compatibility
  const getHighestDegree = () => {
    if (degreesList.length === 0) return { degree: 'Chưa có', major: 'N/A' };
    const ranks = { 'Tiến sĩ': 3, 'Thạc sĩ': 2, 'Cử nhân': 1, 'Khác': 0 };
    const sorted = [...degreesList].sort((a, b) => (ranks[b.degreeType] || 0) - (ranks[a.degreeType] || 0));
    return { degree: sorted[0].degreeType, major: sorted[0].major };
  };

  const handleFinish = (values) => {
    const highest = getHighestDegree();
    const workRole = values.workPositions?.length > 0 ? values.workPositions.join(', ') : 'Giáo viên bộ môn';

    onSubmit({
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: values.address,
      dob: values.dob ? values.dob.format('DD/MM/YYYY') : '',
      cccd: values.cccd,
      workRole: workRole,
      degree: highest.degree,
      major: highest.major,
      subject: 'N/A',
      status: 'Đang công tác',
      avatar: avatarUrl || undefined
    });

    form.resetFields();
    setDegreesList([]);
    setAvatarUrl(null);
    setFileName('');
  };

  // Degree Table Columns
  const degreeColumns = [
    { title: 'Bậc', dataIndex: 'degreeType', key: 'degreeType', width: '20%' },
    { title: 'Trường', dataIndex: 'school', key: 'school', width: '30%' },
    { title: 'Chuyên ngành', dataIndex: 'major', key: 'major', width: '25%' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (text) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${text === 'Hoàn thành' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
          }`}>
          {text}
        </span>
      )
    },
    { title: 'Tốt nghiệp', dataIndex: 'year', key: 'year', width: '10%' },
    {
      title: 'Xóa',
      key: 'delete',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <button
          type="button"
          onClick={() => handleDeleteDegree(record.id)}
          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )
    }
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        form.resetFields();
        setDegreesList([]);
        setAvatarUrl(null);
        setFileName('');
        onClose();
      }}
      footer={null}
      width={960}
      closable={false}
      destroyOnClose
      className="custom-teacher-create-modal"
    >
      <style>{`
        .custom-teacher-create-modal .ant-modal-content {
          border-radius: 16px !important;
          padding: 24px !important;
        }
        .custom-teacher-create-modal .ant-form-item-label {
          padding-bottom: 4px !important;
        }
        .custom-teacher-create-modal .ant-form-item {
          margin-bottom: 12px !important;
        }
        .custom-teacher-create-modal .ant-input, 
        .custom-teacher-create-modal .ant-picker,
        .custom-teacher-create-modal .ant-select-selector {
          border-radius: 8px !important;
          border-color: #e2e8f0 !important;
        }
        .custom-teacher-create-modal .ant-input:hover, 
        .custom-teacher-create-modal .ant-picker:hover,
        .custom-teacher-create-modal .ant-select:hover .ant-select-selector {
          border-color: #6366f1 !important;
        }
        .custom-teacher-create-modal .ant-input:focus, 
        .custom-teacher-create-modal .ant-picker-focused,
        .custom-teacher-create-modal .ant-select-focused .ant-select-selector {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1) !important;
        }
        .custom-teacher-create-modal .ant-table-thead > tr > th {
          background-color: #f8fafc !important;
          color: #475569 !important;
          font-weight: 700 !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          padding: 10px 16px !important;
        }
        .custom-teacher-create-modal .ant-table-tbody > tr > td {
          padding: 8px 16px !important;
          font-size: 13px !important;
        }
      `}</style>

      {/* Header Container */}
      <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100 select-none">
        <button
          type="button"
          onClick={() => {
            form.resetFields();
            setDegreesList([]);
            setAvatarUrl(null);
            setFileName('');
            onClose();
          }}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>
        <span className="text-[17px] font-bold text-slate-800">Tạo thông tin giáo viên</span>
      </div>

      <Form form={form} layout="vertical" onFinish={handleFinish} className="text-slate-800">
        {/* Section 1: Personal Info */}
        <div className="flex items-center gap-3 my-4">
          <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">Thông tin cá nhân</span>
          <div className="h-[1px] flex-1 bg-indigo-100"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Avatar Column */}
          <div className="flex flex-col items-center gap-3 w-full md:w-[130px] shrink-0">
            <div className="w-28 h-28 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center select-none shadow-sm">
              {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <DefaultAvatarSVG />}
            </div>
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-28 h-[72px] border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-white hover:border-indigo-500 hover:bg-indigo-50/5 transition-all select-none group px-2 text-center"
            >
              {fileName ? (
                <div className="flex flex-col items-center w-full">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center mb-0.5">
                    <span className="text-[10px] text-emerald-600 font-bold">✓</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Đã chọn</span>
                  <span className="text-[10px] text-slate-600 font-medium truncate w-24 block" title={fileName}>
                    {fileName}
                  </span>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors mb-0.5" />
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Upload file</span>
                  <span className="text-[11px] text-slate-500 font-semibold group-hover:text-indigo-600">Chọn ảnh</span>
                </>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1 w-full">
            <Form.Item
              name="name"
              label={<span className="text-[13px] font-bold text-slate-700">Họ và tên <span className="text-rose-500">*</span></span>}
              rules={[{ required: true, message: 'Vui lòng điền họ và tên giáo viên' }]}
            >
              <Input size="large" placeholder="VD: Nguyễn Văn A" />
            </Form.Item>

            <Form.Item
              name="dob"
              label={<span className="text-[13px] font-bold text-slate-700">Ngày sinh <span className="text-rose-500">*</span></span>}
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
            >
              <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày sinh" className="w-full" size="large" />
            </Form.Item>

            <Form.Item
              name="phone"
              label={<span className="text-[13px] font-bold text-slate-700">Số điện thoại <span className="text-rose-500">*</span></span>}
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^[0-9+()-\s]*$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input size="large" placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span className="text-[13px] font-bold text-slate-700">Email <span className="text-rose-500">*</span></span>}
              rules={[
                { required: true, message: 'Vui lòng nhập Email liên hệ' },
                { type: 'email', message: 'Địa chỉ Email không hợp lệ' }
              ]}
            >
              <Input size="large" placeholder="example@school.edu.vn" />
            </Form.Item>

            <Form.Item
              name="cccd"
              label={<span className="text-[13px] font-bold text-slate-700">Số CCCD <span className="text-rose-500">*</span></span>}
              rules={[
                { required: true, message: 'Vui lòng nhập số CCCD' },
                { min: 9, max: 12, message: 'Số CCCD thường có từ 9 đến 12 chữ số' }
              ]}
            >
              <Input size="large" placeholder="Nhập số CCCD" />
            </Form.Item>

            <Form.Item
              name="address"
              label={<span className="text-[13px] font-bold text-slate-700">Địa chỉ <span className="text-rose-500">*</span></span>}
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ thường trú' }]}
            >
              <Input size="large" placeholder="Địa chỉ thường trú" />
            </Form.Item>
          </div>
        </div>

        {/* Section 2: Work positions */}
        <div className="flex items-center gap-3 my-4">
          <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">Thông tin công tác</span>
          <div className="h-[1px] flex-1 bg-indigo-100"></div>
        </div>

        <Form.Item
          name="workPositions"
          label={<span className="text-[13px] font-bold text-slate-700">Vị trí công tác <span className="text-rose-500">*</span></span>}
          rules={[{ required: true, message: 'Vui lòng chọn vị trí công tác' }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn các vị trí công tác"
            size="large"
            className="w-full"
            options={[
              { value: 'Giáo viên bộ môn', label: 'Giáo viên bộ môn' },
              { value: 'Giáo viên chủ nhiệm', label: 'Giáo viên chủ nhiệm' },
              { value: 'Trưởng bộ môn', label: 'Trưởng bộ môn' },
              { value: 'Phó bộ môn', label: 'Phó bộ môn' },
              { value: 'Giáo viên trợ giảng', label: 'Giáo viên trợ giảng' }
            ]}
          />
        </Form.Item>

        {/* Section 3: Academic Degrees */}
        <div className="flex items-center gap-3 mt-5 mb-3">
          <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">Học vị</span>
          <div className="h-[1px] flex-1 bg-indigo-100"></div>
        </div>

        {/* Dynamic add degree input row */}
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 mb-4 items-end bg-slate-50/50 p-4 rounded-xl border border-slate-100 select-none">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Bậc</label>
            <Select
              value={newDegree.degreeType}
              onChange={(val) => setNewDegree({ ...newDegree, degreeType: val })}
              className="w-full"
              options={[
                { value: 'Cử nhân', label: 'Cử nhân' },
                { value: 'Thạc sĩ', label: 'Thạc sĩ' },
                { value: 'Tiến sĩ', label: 'Tiến sĩ' },
                { value: 'Khác', label: 'Khác' }
              ]}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Trường</label>
            <Input
              value={newDegree.school}
              onChange={(e) => setNewDegree({ ...newDegree, school: e.target.value })}
              placeholder="VD: Đại học Bách Khoa"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Chuyên ngành</label>
            <Input
              value={newDegree.major}
              onChange={(e) => setNewDegree({ ...newDegree, major: e.target.value })}
              placeholder="VD: CNTT"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Trạng thái</label>
            <Select
              value={newDegree.status}
              onChange={(val) => setNewDegree({ ...newDegree, status: val })}
              className="w-full"
              options={[
                { value: 'Hoàn thành', label: 'Hoàn thành' },
                { value: 'Đang học', label: 'Đang học' }
              ]}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tốt nghiệp</label>
            <Input
              value={newDegree.year}
              onChange={(e) => setNewDegree({ ...newDegree, year: e.target.value })}
              placeholder="Năm tốt nghiệp"
            />
          </div>
          <div>
            <div className="h-[17px] mb-1"></div> {/* Spacer matching standard label height to align button */}
            <button
              type="button"
              onClick={handleAddDegree}
              className="w-full h-[32px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center cursor-pointer active:scale-95"
            >
              Thêm
            </button>
          </div>
        </div>

        {/* Degrees List Table or Empty State */}
        {degreesList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 select-none">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h5l2 2h9a2 2 0 012 2v10a2 2 0 01-2 2H5z" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Trống</span>
          </div>
        ) : (
          <div className="border border-slate-150 rounded-xl overflow-hidden shadow-sm">
            <Table
              dataSource={degreesList}
              columns={degreeColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </div>
        )}

        {/* Footer actions */}
        <div className="flex justify-end mt-6 pt-4 border-t border-slate-100 select-none">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[13px] font-bold transition-all shadow-md shadow-indigo-50 cursor-pointer active:scale-95 group"
          >
            <Save className="w-4 h-4 text-indigo-200 group-hover:text-white transition-colors" />
            <span>Lưu lại</span>
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default TeacherCreateModal;
