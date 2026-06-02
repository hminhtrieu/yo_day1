import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { getStudents } from '../api/students.api';
import { StudentList } from '../components/StudentList';
import { StudentFormModal } from '../components/StudentFormModal';
import { StudentDetailModal } from '../components/StudentDetailModal';
import type { StudentResponse } from '../../../types/yoedu';
import '../styles/Student.css';

export const StudentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: students, isLoading, error } = useQuery({
    queryKey: ['students', debouncedSearch],
    queryFn: () => getStudents(debouncedSearch),
  });

  const handleAddNew = () => {
    setSelectedStudent(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (student: StudentResponse) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const handleView = (student: StudentResponse) => {
    setSelectedStudent(student);
    setIsDetailOpen(true);
  };

  return (
    <div className="student-page-container">
      <div className="student-header">
        <h1>Quản lý Học viên</h1>
        
        <div className="student-toolbar">
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Tìm kiếm theo mã, tên, SĐT..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search 
              size={18} 
              style={{ position: 'absolute', right: '12px', top: '10px', color: '#94a3b8' }} 
            />
          </div>
          
          <button className="btn-primary" onClick={handleAddNew}>
            <Plus size={18} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'text-bottom' }} />
            Thêm Học viên
          </button>
        </div>
      </div>

      {error ? (
        <div style={{ color: 'red', padding: '2rem', textAlign: 'center' }}>
          Đã xảy ra lỗi khi tải dữ liệu! Vui lòng thử lại sau.
        </div>
      ) : isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          Đang tải dữ liệu...
        </div>
      ) : (
        <StudentList 
          students={students || []} 
          onEdit={handleEdit} 
          onView={handleView} 
        />
      )}

      {isFormOpen && (
        <StudentFormModal 
          student={selectedStudent} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}

      {isDetailOpen && selectedStudent && (
        <StudentDetailModal 
          student={selectedStudent} 
          onClose={() => setIsDetailOpen(false)} 
        />
      )}
    </div>
  );
};
