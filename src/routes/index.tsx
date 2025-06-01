import { type Record } from '@/types/records.ts'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Flex, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { useModal } from '@/hooks/useModal.ts'
import { MemberFormModal } from '@/components/memberFormModal'
import type { Field } from '@/types/fields.ts'
import { useRecords } from '@/hooks/useRecords.ts'
import { MemberTable } from '@/components/memberTable.tsx'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editingRecord, setEditingRecord] = useState<Record | null>(null)
  const { showModal, isModalOpen, closeModal } = useModal()
  const { records, updateRecord, deleteRecord, addRecord } = useRecords()

  const openEditModal = (record: Record) => {
    setEditingKey(record.id)
    setEditingRecord(record)
    showModal()
  }

  // 예시 커스텀 필드 정의 - 실제 서버에서 가져오거나 사용자가 정의하는 방식으로 구현 가능
  // 예시로 부서와 연락처 필드 추가
  const customFields: Field[] = useMemo(
    () => [
      {
        id: 'department',
        label: '부서',
        required: false,
        fieldType: {
          type: 'text',
          constraints: { maxLength: 100 },
        },
      },
      {
        id: 'phone',
        label: '연락처',
        required: false,
        fieldType: {
          type: 'text',
          constraints: { maxLength: 20 },
        },
      },
    ],
    [],
  )

  return (
    <>
      <MemberFormModal
        isModalOpen={isModalOpen}
        closeModal={() => {
          closeModal()
          setEditingRecord(null)
          setEditingKey(null)
        }}
        customFields={customFields}
        onSubmit={(data) => {
          if (editingKey) {
            // 수정 모드
            updateRecord(editingKey, data)
            setEditingKey(null)
            setEditingRecord(null)
          } else {
            // 추가 모드
            addRecord(data)
          }
        }}
        initialData={
          editingRecord
            ? {
                ...editingRecord,
                joinDate: editingRecord.joinDate,
              }
            : undefined
        }
        mode={editingKey ? 'edit' : 'add'}
      />
      <div className="w-dvw h-dvh flex flex-col">
        <Flex
          align="center"
          justify="space-between"
          className="px-3.5 h-12 w-full"
        >
          <Typography.Text className="text-title">회원 목록</Typography.Text>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="text-body"
            onClick={showModal}
          >
            추가
          </Button>
        </Flex>
        <MemberTable
          dataSource={records}
          onDelete={deleteRecord}
          onEdit={openEditModal}
        />
      </div>
    </>
  )
}
