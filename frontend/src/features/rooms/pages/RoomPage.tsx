import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRooms, deleteRoom } from '../api/rooms.api';
import type { RoomResponse } from '../../../types/yoedu';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable } from '../../../components/common/DataTable';
import type { Column } from '../../../components/common/DataTable';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { RoomFormModal } from '../components/RoomFormModal';
import toast from 'react-hot-toast';

export const RoomPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomResponse | undefined>(undefined);
  
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms', debouncedSearch],
    queryFn: () => getRooms(debouncedSearch),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Đã xóa thành công');
      setDeleteId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Lỗi khi xóa');
      setDeleteId(null);
    }
  });

  const columns: Column<RoomResponse>[] = [
    { key: 'roomCode', header: 'Mã phòng', render: (r) => <strong>{r.roomCode}</strong> },
    { key: 'name', header: 'Tên phòng' },
    { key: 'capacity', header: 'Sức chứa', render: (r) => `${r.capacity} người` },
    { key: 'description', header: 'Mô tả' }
  ];

  return (
    <div className="course-page-container">
      <PageHeader 
        title="Quản lý Phòng học" 
        addLabel="Thêm Phòng"
        onAddClick={() => { setSelectedRoom(undefined); setIsFormOpen(true); }}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>
      ) : (
        <DataTable 
          data={rooms || []} 
          columns={columns} 
          keyExtractor={(r) => r.id}
          onEdit={(r) => { setSelectedRoom(r); setIsFormOpen(true); }}
          onDelete={(r) => setDeleteId(r.id)}
        />
      )}

      {isFormOpen && (
        <RoomFormModal room={selectedRoom} onClose={() => setIsFormOpen(false)} />
      )}

      <ConfirmDialog 
        isOpen={deleteId !== null}
        title="Xóa Phòng học"
        message="Bạn có chắc chắn muốn xóa phòng này không? Thao tác không thể hoàn tác!"
        onConfirm={() => deleteMutation.mutate(deleteId!)}
        onCancel={() => setDeleteId(null)}
        isDestructive
      />
    </div>
  );
};
