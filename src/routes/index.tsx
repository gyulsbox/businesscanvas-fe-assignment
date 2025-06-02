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
      <Layout className="bg-white">
        <Layout.Header className="bg-transparent px-3.5 h-12 w-full">
          <Flex
            align="center"
            justify="space-between"
            className="w-full h-full"
          >
            <Typography.Text className="text-title">회원 목록</Typography.Text>
            <Button
              data-cy="add-member-button"
              type="primary"
              icon={<PlusOutlined />}
              className="text-body"
              onClick={showModal}
            >
              추가
            </Button>
          </Flex>
        </Layout.Header>

        <Layout.Content>
          <MemberTable
            dataSource={records}
            onDelete={deleteRecord}
            onEdit={openEditModal}
          />
        </Layout.Content>
      </Layout>
    </>
  )
}
