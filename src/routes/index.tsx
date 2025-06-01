import { type Record } from '@/types/records.ts'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Checkbox, Dropdown, Flex, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { MoreOutlined, PlusOutlined } from '@ant-design/icons'
import { useModal } from '@/hooks/useModal.ts'
import { MemberFormModal } from '@/components/memberFormModal'
import dayjs from 'dayjs'
import type { Field } from '@/types/fields.ts'
import { FilterDropdown } from '@/components/filterDropdown'
import { useRecords } from '@/hooks/useRecords.ts'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editingRecord, setEditingRecord] = useState<Record | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const { showModal, isModalOpen, closeModal } = useModal()
  const { records, updateRecord, deleteRecord, addRecord } = useRecords()

  // 체크박스 선택 관련 기능
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys)
    },
    selections: false,
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

  // 필터링을 위한 고유 값 추출 함수
  const getColumnFilters = (
    dataSource: readonly Record[],
    dataIndex: keyof Record,
  ) => {
    const values = dataSource
      .map((item) => item[dataIndex])
      .filter(
        (value, index, self) =>
          typeof value === 'string' && self.indexOf(value) === index,
      ) as string[]

    return values.map((value) => ({ text: value, value }))
  }

  // 이메일 수신 동의 필터 옵션
  const emailConsentFilters = [
    { text: '동의', value: 'true' },
    { text: '미동의', value: 'false' },
  ]

  // 날짜 필터 옵션 생성 함수
  const getDateFilterOptions = (dataSource: readonly Record[]) => {
    return dataSource
      .map((item) => dayjs(item.joinDate).format('YYYY-MM-DD'))
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((date) => ({ text: date, value: date }))
  }

  const columns: ColumnsType<Record> = [
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
      onHeaderCell: () => ({ className: 'text-title' }),
      render: (_, record) => (
        <Typography.Text className="text-body">{record.name}</Typography.Text>
      ),
      filterDropdown: (props) => (
        <FilterDropdown
          {...props}
          options={getColumnFilters(records, 'name')}
        />
      ),
      onFilter: (value, record) => record.name.includes(value as string),
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
      filterDropdown: (props) => (
        <FilterDropdown
          {...props}
          options={getColumnFilters(records, 'address')}
        />
      ),
      onFilter: (value, record) => record.address.includes(value as string),
    },
    {
      title: '메모',
      dataIndex: 'memo',
      key: 'memo',
      onHeaderCell: () => ({ className: 'text-title' }),
      render: (_, record) => (
        <Typography.Text className="text-body">{record.memo}</Typography.Text>
      ),
      filterDropdown: (props) => (
        <FilterDropdown
          {...props}
          options={getColumnFilters(records, 'memo')}
        />
      ),
      onFilter: (value, record) => record.memo.includes(value as string),
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
      // 날짜는 고유값으로 변환 후 필터링
      filterDropdown: (props) => (
        <FilterDropdown {...props} options={getDateFilterOptions(records)} />
      ),
      onFilter: (value, record) =>
        dayjs(record.joinDate).format('YYYY-MM-DD') === value,
    },
    {
      title: '직업',
      dataIndex: 'job',
      key: 'job',
      onHeaderCell: () => ({ className: 'text-title' }),
      filterDropdown: (props) => (
        <FilterDropdown {...props} options={getColumnFilters(records, 'job')} />
      ),
      onFilter: (value, record) => record.job.includes(value as string),
    },
    {
      title: '이메일 수신 동의',
      dataIndex: 'emailConsent',
      key: 'emailConsent',
      render: (_, record) => <Checkbox checked={record.emailConsent} />,
      onHeaderCell: () => ({ className: 'text-title' }),
      filterDropdown: (props) => (
        <FilterDropdown {...props} options={emailConsentFilters} />
      ),
      onFilter: (value, record) => String(record.emailConsent) === value,
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
                  deleteRecord(record.id)
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
        <Table
          rowKey="id"
          rowSelection={rowSelection}
          columns={allColumns}
          dataSource={records}
          pagination={false}
        />
      </div>
    </>
  )
}
