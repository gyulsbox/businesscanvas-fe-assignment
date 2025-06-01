import { createFileRoute } from '@tanstack/react-router'
import { Button, Flex, Layout, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { MemberFormModal } from '@/components/memberFormModal'
import { MemberTable } from '@/components/memberTable.tsx'
import { useMemberManager } from '@/hooks/useMemberManager.ts'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const {
    records,
    deleteRecord,
    handleSubmit,
    isModalOpen,
    modalState,
    editingRecord,
    openEditModal,
    showModal,
    closeModal,
  } = useMemberManager()

  return (
    <>
      <MemberFormModal
        mode={modalState}
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        initialData={editingRecord}
        onSubmit={handleSubmit}
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
