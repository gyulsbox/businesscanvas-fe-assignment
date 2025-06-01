import { type Record } from '@/types/records.ts'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Checkbox, Dropdown, Flex, Table, Typography } from 'antd'
import { MoreOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useState, useMemo } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { StyleProvider } from '@ant-design/cssinjs'
import { useModal } from '@/hooks/useModal.ts'
import { MemberFormModal } from '@/components/memberFormModal'
import dayjs from 'dayjs'
import type { Field } from '@/types/fields.ts'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  //이름, 주소, 메모, 가입일, 직업, 이메일 수신 동의
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editingRecord, setEditingRecord] = useState<Record | null>(null)
  const { showModal, isModalOpen, closeModal } = useModal()

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
  ) // 예시이미로 디펜던시 없이 고정

  const columns: ColumnsType<Record> = [
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
      onHeaderCell: () => ({ className: 'text-title' }),
      render: (_, record) => (
        <Typography.Text className="text-body">{record.name}</Typography.Text>
      ),
    },
    {
      title: '주소',
      dataIndex: 'address',
      key: 'address',
      onHeaderCell: () => ({ className: 'text-title' }),
      render: (_, record) => (
        <Typography.Text className="text-body">
          {record.address}
        </Typography.Text>
      ),
    },
    {
      title: '메모',
      dataIndex: 'memo',
      key: 'memo',
      onHeaderCell: () => ({ className: 'text-title' }),
      render: (_, record) => (
        <Typography.Text className="text-body">{record.memo}</Typography.Text>
      ),
    },
    {
      title: '가입일',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (_, record) => (
        <Typography.Text>
          {dayjs(record.joinDate).format('YYYY-MM-DD')}
        </Typography.Text>
      ),
      onHeaderCell: () => ({ className: 'text-title' }),
    },
    {
      title: '직업',
      dataIndex: 'job',
      key: 'job',
      onHeaderCell: () => ({ className: 'text-title' }),
    },
    {
      title: '이메일 수신 동의',
      dataIndex: 'emailConsent',
      key: 'emailConsent',
      render: (_, record) => <Checkbox checked={record.emailConsent} />,
      onHeaderCell: () => ({ className: 'text-title' }),
    },
    {
      title: '',
      width: 'auto',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: '수정',
                onClick: () => {
                  // 편집 모드로 전환
                  setEditingKey(record.id)
                  setEditingRecord(record)
                  showModal()
                },
              },
              {
                type: 'divider',
              },
              {
                key: 'delete',
                label: '삭제',
                danger: true,
                onClick: () => {
                  // 삭제 로직
                  setDataSource((prev) =>
                    prev.filter((item) => item.id !== record.id),
                  )
                },
              },
            ],
          }}
          placement="bottomRight"
          trigger={['click']}
          overlayClassName="w-[185px]"
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            className="flex items-center justify-center"
          />
        </Dropdown>
      ),
    },
  ]

  // 기본 컬럼과 커스텀 필드 컬럼 사이에 추가하기 위한 예시 컬럼
  // 커스텀 필드 컬럼 예시 서버에서 받아 온 값을 사용할 것으로 예상됨.

  // 필드 타입에 따라 적절한 렌더링 함수 생성
  /* 주석 처리 - 커스텀 필드 렌더링 로직
  const renderCustomFieldValue = (record: Record, fieldId: string, fieldType: string) => {
    if (!record.customFields || record.customFields[fieldId] === undefined) {
      return null;
    }

    const value = record.customFields[fieldId];

    switch(fieldType) {
      case 'checkbox':
        return <Checkbox checked={Boolean(value)} disabled />;
      case 'date':
        return value ? <Typography.Text>{dayjs(value).format('YYYY-MM-DD')}</Typography.Text> : null;
      default:
        return <Typography.Text>{String(value)}</Typography.Text>;
    }
  };

  // 커스텀 필드를 컬럼으로 변환
  const customFieldsColumns = customFields.map(field => ({
    title: field.label,
    key: `custom_${field.id}`,
    render: (_: unknown, record: Record) => renderCustomFieldValue(record, field.id, field.fieldType.type),
    onHeaderCell: () => ({ className: 'text-title' }),
  }));
  */

  // const customFieldsColumns: ColumnsType<Record> = [];

  // 기본 컬럼과 커스텀 컬럼 합치기
  // 기본 컬럼의 마지막 요소(액션 컬럼)를 불러와서 부분 배열 생성
  const baseColumnsWithoutAction = columns.slice(0, columns.length - 1)
  const actionColumn = columns[columns.length - 1]

  // 최종 컬럼: 기본 컬럼 + 커스텀 컬럼 + 액션 컬럼
  // 커스텀 필드 주석 처리 (커스텀 필드 포함 안 함)
  const allColumns = [...baseColumnsWithoutAction, actionColumn]

  const INITIAL_RECORDS: readonly Record[] = [
    {
      id: '1',
      name: 'John Doe',
      address: '서울 강남구',
      memo: '외국인',
      joinDate: new Date('2024-10-02'),
      job: '개발자',
      emailConsent: true,
    },
    {
      id: '2',
      name: 'Foo Bar',
      address: '서울 서초구',
      memo: '한국인',
      joinDate: new Date('2024-10-01'),
      job: 'PO',
      emailConsent: false,
      customFields: {
        department: '디자인팀',
      },
    },
  ]

  const [dataSource, setDataSource] = useState(INITIAL_RECORDS)

  return (
    <StyleProvider layer>
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
              setDataSource((prev) =>
                prev.map((item) =>
                  item.id === editingKey
                    ? { ...item, ...data, updatedAt: new Date() }
                    : item,
                ),
              )
              setEditingKey(null)
              setEditingRecord(null)
            } else {
              // 추가 모드
              setDataSource((prev) => [...prev, data])
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
          <Table
            columns={allColumns}
            dataSource={dataSource}
            pagination={false}
          />
        </div>
      </>
    </StyleProvider>
  )
}
