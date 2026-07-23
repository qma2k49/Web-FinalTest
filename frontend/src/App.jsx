import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { 
  Search, 
  RotateCw, 
  UserPlus, 
  AlertCircle
} from 'lucide-react';
import { ConfigProvider } from 'antd';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSibebar';
import TeacherTable from './components/TeacherTable';
import TeacherDetailModal from './components/TeacherDetailModal';
import TeacherCreateModal from './components/TeacherCreateModal';
import WorkPositionsView from './components/WorkPositionsView';

const mapBackendTeacher = (t) => {
  const user = t.userId || {};
  
  // Get highest degree
  let degreeType = 'Chưa có';
  let major = 'N/A';
  if (t.degrees && t.degrees.length > 0) {
    const ranks = { 'Tiến sĩ': 3, 'Thạc sĩ': 2, 'Cử nhân': 1, 'Khác': 0 };
    const dbToVi = {
      'Doctorate': 'Tiến sĩ',
      'Master': 'Thạc sĩ',
      'Bachelor': 'Cử nhân',
      'Tiến sĩ': 'Tiến sĩ',
      'Thạc sĩ': 'Thạc sĩ',
      'Cử nhân': 'Cử nhân'
    };
    const sorted = [...t.degrees].sort((a, b) => {
      const normA = dbToVi[a.type] || a.type;
      const normB = dbToVi[b.type] || b.type;
      return (ranks[normB] || 0) - (ranks[normA] || 0);
    });
    degreeType = dbToVi[sorted[0].type] || sorted[0].type;
    major = sorted[0].major || 'N/A';
  }

  // Get work role positions
  const positions = t.teacherPositionsId || [];
  const workRole = positions.map(p => p.name).join(', ') || 'Giáo viên bộ môn';

  return {
    _id: t._id,
    id: t.code || 'N/A',
    name: user.name || 'N/A',
    email: user.email || 'N/A',
    phone: user.phoneNumber || 'N/A',
    avatar: t.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name || 'Gv'}`,
    degree: degreeType,
    major: major,
    subject: 'N/A',
    workRole: workRole,
    address: user.address || 'N/A',
    status: t.isActive ? 'Đang công tác' : 'Ngừng công tác',
    joinDate: t.startDate ? new Date(t.startDate).toLocaleDateString('vi-VN') : 'N/A'
  };
};

const App = () => {
  const [currentTab, setCurrentTab] = useState('giaoVien');
  const [teachers, setTeachers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals state
  const [detailModalData, setDetailModalData] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchTeachers = () => {
    setLoading(true);
    axios.get(`/teachers`, {
      params: {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery
      }
    })
    .then((res) => {
      const mapped = (res.data.data || []).map(mapBackendTeacher);
      setTeachers(mapped);
      setTotalCount(res.data.pagination?.total || 0);
      if (mapped.length > 0 && !selectedRowId) {
        setSelectedRowId(mapped[0].id);
      }
    })
    .catch((err) => {
      console.error("Error fetching teachers:", err);
      toast.error("Không thể kết nối đến máy chủ API");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTeachers();
  }, [currentPage, itemsPerPage, searchQuery]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.promise(
      new Promise((resolve, reject) => {
        axios.get(`/teachers`, {
          params: { page: 1, limit: itemsPerPage, search: '' }
        })
        .then((res) => {
          const mapped = (res.data.data || []).map(mapBackendTeacher);
          setTeachers(mapped);
          setTotalCount(res.data.pagination?.total || 0);
          setSearchQuery('');
          setCurrentPage(1);
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
        loading: 'Đang đồng bộ dữ liệu...',
        success: 'Đã tải lại dữ liệu mới nhất!',
        error: 'Có lỗi xảy ra khi tải dữ liệu'
      }
    );
  };

  const handleCreateSubmit = (newTeacherData) => {
    setLoading(true);
    axios.post(`/teachers`, {
      name: newTeacherData.name,
      email: newTeacherData.email,
      phoneNumber: newTeacherData.phone,
      address: newTeacherData.address,
      identity: newTeacherData.identity,
      dob: newTeacherData.dob ? new Date(newTeacherData.dob.split('/').reverse().join('-')) : undefined,
      teacherPositionsId: newTeacherData.teacherPositionsId,
      degrees: newTeacherData.degrees
    })
    .then(() => {
      toast.success(`Thêm giáo viên "${newTeacherData.name}" thành công!`);
      setShowCreateModal(false);
      fetchTeachers();
    })
    .catch((err) => {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi khi lưu thông tin giảng viên");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4338ca', // Indigo 700 (matching our dashboard accent)
          borderRadius: 12,
        },
      }}
    >
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 antialiased">
        {/* Sonner Toast alerts */}
        <Toaster position="top-right" richColors />

        {/* Shared Admin Header */}
        <AdminHeader />

        {/* Primary Layout Wrapper */}
        <div className="flex flex-1">
          {/* Left Side Navigation Menu */}
          <AdminSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

          {/* Right Main Panel Container */}
          <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full transition-all duration-300">
            
            {/* Breadcrumb Path / Tab Heading */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-800 flex items-center gap-2">
                  {currentTab === 'giaoVien' ? 'Giáo viên' : 
                   currentTab === 'thongKe' ? 'Thống kê hệ thống' : 
                   currentTab === 'viTriCongTac' ? 'Vị trí công tác' : 'Quản lý học đường'}
                </h1>
                <p className="text-xs text-gray-400 font-medium mt-1">Hệ thống quản lý / {currentTab === 'giaoVien' ? 'Giáo viên' : 'Danh mục'}</p>
              </div>
            </div>

            {/* Tab Content Router */}
            {currentTab === 'viTriCongTac' ? (
              <WorkPositionsView />
            ) : currentTab !== 'giaoVien' ? (
              <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Trang đang phát triển</h2>
                <p className="text-sm text-gray-400 mt-2 max-w-md">Tính năng này đang được thiết lập hệ thống. Vui lòng chuyển sang tab <span className="font-semibold text-indigo-600">Giáo viên</span> hoặc <span className="font-semibold text-indigo-600">Vị trí công tác</span> để xem minh họa.</p>
                <button 
                  onClick={() => setCurrentTab('giaoVien')}
                  className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-indigo-200"
                >
                  Quay lại Giáo viên
                </button>
              </div>
            ) : (
              /* Teacher Directory View (Matching screenshot) */
              <div className="flex flex-col gap-4">
                
                {/* Control & Query Bar */}
                <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Search Box */}
                  <div className="relative w-full sm:max-w-xs">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Tìm kiếm thông tin..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1); // Reset to page 1 on filter
                      }}
                      className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
                    />
                  </div>

                  {/* Buttons (Refresh & Create) */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 bg-white rounded-xl text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all duration-200 active:scale-95 disabled:opacity-50"
                    >
                      <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-500' : ''}`} />
                      <span>Tải lại</span>
                    </button>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 active:scale-95 shadow-md shadow-indigo-100"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Tạo mới</span>
                    </button>
                  </div>
                </div>

                {/* Refactored Teacher Table Subcomponent */}
                <TeacherTable 
                  teachers={teachers}
                  selectedRowId={selectedRowId}
                  setSelectedRowId={setSelectedRowId}
                  onViewDetail={setDetailModalData}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  totalCount={totalCount}
                  totalPages={Math.ceil(totalCount / itemsPerPage) || 1}
                />

              </div>
            )}
          </main>
        </div>

        {/* Refactored Detail Modal Subcomponent */}
        <TeacherDetailModal 
          teacher={detailModalData} 
          onClose={() => setDetailModalData(null)} 
        />

        {/* Refactored Create Modal Subcomponent */}
        <TeacherCreateModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateSubmit}
        />
      </div>
    </ConfigProvider>
  );
};

export default App;
