import { useRecords } from '@/hooks/useRecords.ts'
import { useMemberModal } from '@/hooks/useMemberModal.ts'
import type { Record } from '@/types/records.ts'

export function useMemberManager() {
  const {
    isModalOpen,
    showModal,
    openEditModal,
    closeModal,
    modalState,
    editingKey,
    editingRecord,
    resetEditKeyAndRecord,
  } = useMemberModal()

  const { records, updateRecord, deleteRecord, addRecord } = useRecords()

  // 두 훅의 연동이 필요한 로직 구현
  const handleSubmit = (record: Record) => {
    if (editingKey) {
      updateRecord(editingKey, record)
      resetEditKeyAndRecord()
    } else {
      addRecord(record)
    }
  }

  // // 예시 커스텀 필드 정의 - 실제 서버에서 가져오거나 사용자가 정의하는 방식으로 구현 가능
  // // 예시로 부서와 연락처 필드 추가
  // const customFields: Field[] = useMemo(
  //   () => [
  //     {
  //       id: 'department',
  //       label: '부서',
  //       required: false,
  //       fieldType: {
  //         type: 'text',
  //         constraints: { maxLength: 100 },
  //       },
  //     },
  //     {
  //       id: 'phone',
  //       label: '연락처',
  //       required: false,
  //       fieldType: {
  //         type: 'text',
  //         constraints: { maxLength: 20 },
  //       },
  //     },
  //   ],
  //   [],
  // )

  return {
    // Modal 관련
    modalState,
    isModalOpen,
    showModal,
    openEditModal,
    closeModal,
    editingRecord,
    // Records 관련
    records,
    deleteRecord,
    // 통합 로직
    handleSubmit,
  }
}
