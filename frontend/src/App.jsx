import React, { useState, useMemo } from 'react';
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

// Complete mock data for 22 teachers matching the mockup screenshot names and data
const INITIAL_TEACHERS = [
  {
    id: '1031019996',
    name: 'Nguyễn Minh Trung',
    email: 'minhtrung@school.edu.vn',
    phone: '07756367450',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    degree: 'Cử nhân',
    major: 'Kỹ thuật Xây dựng',
    subject: 'N/A',
    workRole: 'Giáo viên bộ môn',
    address: 'Thanh Hóa',
    status: 'Đang công tác',
    joinDate: '15/09/2021'
  },
  {
    id: '2246882558',
    name: 'Trần Thiên Kim',
    email: 'thienkim@school.edu.vn',
    phone: '07756367449',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    degree: 'Cử nhân',
    major: 'Tiếng Anh',
    subject: 'N/A',
    workRole: 'Giáo viên bộ môn',
    address: 'Quảng Bình',
    status: 'Đang công tác',
    joinDate: '10/08/2020'
  },
  {
    id: '2621511601',
    name: 'Hoàng Nam',
    email: 'hoangnam@school.edu.vn',
    phone: '09756367448',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    degree: 'Cử nhân',
    major: 'Y Học Cổ Truyền',
    subject: 'N/A',
    workRole: 'Giáo viên bộ môn',
    address: 'Sơn La',
    status: 'Đang công tác',
    joinDate: '01/03/2022'
  },
  {
    id: '3781215661',
    name: 'Phạm Thùy Dương',
    email: 'thuyduong@school.edu.vn',
    phone: '07756367447',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    degree: 'Thạc sĩ',
    major: 'Kế Toán',
    subject: 'N/A',
    workRole: 'Giáo viên bộ môn',
    address: 'Hà Nam',
    status: 'Đang công tác',
    joinDate: '18/11/2019'
  },
  {
    id: '4215858843',
    name: 'Nguyễn Minh Tuấn',
    email: 'minhtuan@school.edu.vn',
    phone: '08756367446',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    degree: 'Cử nhân',
    major: 'Toán Học',
    subject: 'N/A',
    workRole: 'Giáo viên bộ môn',
    address: 'Ninh Bình',
    status: 'Đang công tác',
    joinDate: '05/09/2023'
  },
  {
    id: '1864716387',
    name: 'Trần Anh Thư',
    email: 'anhthu@school.edu.vn',
    phone: '09756367445',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    degree: 'Thạc sĩ',
    major: 'Khoa Học Môi Trường',
    subject: 'N/A',
    workRole: 'Giáo viên bộ môn',
    address: 'Đồng Nai',
    status: 'Đang công tác',
    joinDate: '12/02/2021'
  },
  {
    id: '3664683813',
    name: 'Nguyễn Hoàng Minh',
    email: 'hoangminh@school.edu.vn',
    phone: '09756367443',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    degree: 'Cử nhân',
    major: 'Công nghệ Thông Tin',
    subject: 'N/A',
    workRole: 'Giáo viên bộ môn',
    address: 'Bình Dương',
    status: 'Đang công tác',
    joinDate: '22/07/2022'
  },
  {
    id: '0399962044',
    name: 'Lê Khánh Linh',
    email: 'khanhlinh@school.edu.vn',
    phone: '09756367444',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    degree: 'Thạc sĩ',
    major: 'Du Lịch',
    subject: 'N/A',
    workRole: 'Giáo viên bộ môn',
    address: 'Lâm Đồng',
    status: 'Đang công tác',
    joinDate: '09/09/2020'
  },
  {
    id: '1952101718',
    name: 'Lê Thanh',
    email: 'lethang@school.edu.vn',
    phone: '08756367442',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    degree: 'Cử nhân',
    major: 'Khoa Học Cây Trồng',
    subject: 'N/A',
    workRole: 'Giáo viên bộ môn',
    address: 'Bắc Giang',
    status: 'Đang công tác',
    joinDate: '15/01/2023'
  },
  {
    id: '1288411718',
    name: 'Nguyễn Thuận',
    email: 'thuannguyen@school.edu.vn',
    phone: '09756367441',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    degree: 'Cử nhân',
    major: 'Y Khoa',
    subject: 'N/A',
    workRole: 'Giáo viên bộ môn',
    address: 'Hà Tĩnh',
    status: 'Đang công tác',
    joinDate: '01/08/2021'
  },
  {
    id: '2034981122',
    name: 'Bùi Thị Tuyết',
    email: 'tuyetbui@school.edu.vn',
    phone: '0987654321',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&auto=format&fit=crop&q=80',
    degree: 'Tiến sĩ',
    major: 'Vật lý học',
    subject: 'Vật lý',
    workRole: 'Giáo viên bộ môn',
    address: 'Nghệ An',
    status: 'Đang công tác',
    joinDate: '25/08/2018'
  },
  {
    id: '3048921133',
    name: 'Phạm Văn Đức',
    email: 'ducpham@school.edu.vn',
    phone: '0912345678',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    degree: 'Thạc sĩ',
    major: 'Hóa học Hữu cơ',
    subject: 'Hóa học',
    workRole: 'Giáo viên chủ nhiệm',
    address: 'Nam Định',
    status: 'Đang công tác',
    joinDate: '10/10/2017'
  },
  {
    id: '4052981144',
    name: 'Vũ Minh Khang',
    email: 'khangvu@school.edu.vn',
    phone: '0934567890',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    degree: 'Cử nhân',
    major: 'Sinh học ứng dụng',
    subject: 'N/A',
    workRole: 'Giáo viên bộ môn',
    address: 'Thái Bình',
    status: 'Đang công tác',
    joinDate: '01/09/2023'
  },
  {
    id: '5061981155',
    name: 'Đỗ Hoàng Yến',
    email: 'yendo@school.edu.vn',
    phone: '0945678901',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=150&auto=format&fit=crop&q=80',
    degree: 'Thạc sĩ',
    major: 'Ngữ văn Việt Nam',
    subject: 'Ngữ văn',
    workRole: 'Giáo viên bộ môn',
    address: 'Hưng Yên',
    status: 'Đang công tác',
    joinDate: '12/03/2019'
  },
  {
    id: '6072981166',
    name: 'Ngô Tiến Dũng',
    email: 'dungngo@school.edu.vn',
    phone: '0956789012',
    avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=150&auto=format&fit=crop&q=80',
    degree: 'Tiến sĩ',
    major: 'Lịch sử học',
    subject: 'Lịch sử',
    workRole: 'Giáo viên bộ môn',
    address: 'Hải Dương',
    status: 'Đang công tác',
    joinDate: '18/06/2016'
  },
  {
    id: '7083981177',
    name: 'Nguyễn Thị Mai',
    email: 'mainguyen@school.edu.vn',
    phone: '0967890123',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80',
    degree: 'Cử nhân',
    major: 'Địa lý học',
    subject: 'N/A',
    workRole: 'Giáo viên bộ môn',
    address: 'Phú Thọ',
    status: 'Đang công tác',
    joinDate: '29/01/2024'
  },
  {
    id: '8094981188',
    name: 'Dương Văn Lâm',
    email: 'lamduong@school.edu.vn',
    phone: '0978901234',
    avatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=150&auto=format&fit=crop&q=80',
    degree: 'Thạc sĩ',
    major: 'Khoa học Máy tính',
    subject: 'Tin học',
    workRole: 'Giáo viên bộ môn',
    address: 'Vĩnh Phúc',
    status: 'Đang công tác',
    joinDate: '07/04/2021'
  },
  {
    id: '9105981199',
    name: 'Hoàng Thanh Thảo',
    email: 'thaohuang@school.edu.vn',
    phone: '0989012345',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
    degree: 'Cử nhân',
    major: 'Giáo dục Thể chất',
    subject: 'N/A',
    workRole: 'Giáo viên bộ môn',
    address: 'Thái Nguyên',
    status: 'Đang công tác',
    joinDate: '12/12/2022'
  },
  {
    id: '1116981200',
    name: 'Phan Quốc Anh',
    email: 'anhphan@school.edu.vn',
    phone: '0990123456',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    degree: 'Thạc sĩ',
    major: 'Mỹ thuật tạo hình',
    subject: 'N/A',
    workRole: 'Giáo viên bộ môn',
    address: 'Tuyên Quang',
    status: 'Đang công tác',
    joinDate: '05/09/2021'
  },
  {
    id: '2127981211',
    name: 'Lý Hồng Ngọc',
    email: 'ngocly@school.edu.vn',
    phone: '0901234567',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&auto=format&fit=crop&q=80',
    degree: 'Cử nhân',
    major: 'Sư phạm Âm nhạc',
    subject: 'N/A',
    workRole: 'Giáo viên bộ môn',
    address: 'Lạng Sơn',
    status: 'Đang công tác',
    joinDate: '10/02/2023'
  },
  {
    id: '3138981222',
    name: 'Trương Gia Bảo',
    email: 'baotruong@school.edu.vn',
    phone: '0912345670',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    degree: 'Thạc sĩ',
    major: 'Giáo dục Công dân',
    subject: 'N/A',
    workRole: 'Giáo viên bộ môn',
    address: 'Cao Bằng',
    status: 'Đang công tác',
    joinDate: '15/08/2020'
  },
  {
    id: '4149981233',
    name: 'Võ Thị Hà',
    email: 'havo@school.edu.vn',
    phone: '0923456781',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    degree: 'Cử nhân',
    major: 'Kỹ thuật Công nghiệp',
    subject: 'N/A',
    workRole: 'Giáo viên bộ môn',
    address: 'Hòa Bình',
    status: 'Đang công tác',
    joinDate: '01/09/2022'
  }
];

const App = () => {
  const [currentTab, setCurrentTab] = useState('giaoVien');
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  
  // Selection tracking
  const [selectedRowId, setSelectedRowId] = useState('1864716387'); // Row Trần Anh Thư is selected by default in screenshot

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals state
  const [detailModalData, setDetailModalData] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filtered teachers list based on search
  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.phone.includes(q) ||
        t.id.includes(q) ||
        t.address.toLowerCase().includes(q)
      );
    });
  }, [teachers, searchQuery]);

  // Paginated chunk
  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTeachers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTeachers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage) || 1;

  // Handle Refreshing state mock
  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 600)),
      {
        loading: 'Đang đồng bộ dữ liệu...',
        success: () => {
          setIsRefreshing(false);
          setSearchQuery('');
          setCurrentPage(1);
          return 'Đã tải lại dữ liệu mới nhất!';
        },
        error: 'Có lỗi xảy ra khi tải dữ liệu'
      }
    );
  };

  // Handle Create Teacher submission
  const handleCreateSubmit = (newTeacherData) => {
    // Auto-generate ID (10 digits similar to mockups)
    const randomId = String(Math.floor(1000000000 + Math.random() * 9000000000));
    
    // Default avatar
    const defaultAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    ];
    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const createdTeacher = {
      ...newTeacherData,
      id: randomId,
      avatar: randomAvatar,
      joinDate: new Date().toLocaleDateString('vi-VN')
    };

    setTeachers([createdTeacher, ...teachers]);
    setShowCreateModal(false);
    toast.success(`Thêm giáo viên "${createdTeacher.name}" thành công!`);
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
            {currentTab !== 'giaoVien' ? (
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
                  teachers={paginatedTeachers}
                  selectedRowId={selectedRowId}
                  setSelectedRowId={setSelectedRowId}
                  onViewDetail={setDetailModalData}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  totalCount={filteredTeachers.length}
                  totalPages={totalPages}
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
