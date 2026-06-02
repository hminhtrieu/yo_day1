import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoom, updateRoom } from '../api/rooms.api';
import type { RoomResponse } from '../../../types/yoedu';
import { FormField } from '../../../components/common/FormField';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const roomSchema = z.object({
  roomCode: z.string().min(2, 'Mã phòng quá ngắn'),
  name: z.string().min(2, 'Tên phòng quá ngắn'),
  capacity: z.number().min(1, 'Sức chứa phải lớn hơn 0'),
  description: z.string().optional()
});

type RoomFormData = z.infer<typeof roomSchema>;

interface Props {
  room?: RoomResponse;
  onClose: () => void;
}

export const RoomFormModal = ({ room, onClose }: Props) => {
  const queryClient = useQueryClient();
  const isEdit = !!room;

  const { register, handleSubmit, formState: { errors } } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomCode: room?.roomCode || '',
      name: room?.name || '',
      capacity: room?.capacity || 20,
      description: room?.description || ''
    }
  });

  const mutation = useMutation({
    mutationFn: (data: RoomFormData) => {
      if (isEdit) {
        return updateRoom(room.id, data);
      }
      return createRoom(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success(isEdit ? 'Đã cập nhật Phòng học' : 'Đã thêm Phòng học mới');
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEdit ? 'Sửa Phòng học' : 'Thêm Phòng học mới'}</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
          <div className="modal-body">
            <div className="form-grid">
              
              <FormField label="Mã phòng *" {...register('roomCode')} error={errors.roomCode} fullWidth />
              <FormField label="Tên phòng *" {...register('name')} error={errors.name} fullWidth />
              <FormField label="Sức chứa *" type="number" {...register('capacity', { valueAsNumber: true })} error={errors.capacity} fullWidth />
              <FormField label="Mô tả" as="textarea" rows={3} {...register('description')} error={errors.description} fullWidth />

            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? 'Đang lưu...' : 'Lưu lại'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
