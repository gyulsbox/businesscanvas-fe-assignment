import { type Record } from '@/types/records'
import type { ColumnsType } from 'antd/es/table'
import { Button, Checkbox, Dropdown, Typography } from 'antd'
import { MoreOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { FilterDropdown } from './filterDropdown'
import {
  emailConsentFilters,
  getColumnFilters,
  getDateFilterOptions,
} from '@/utils/filters'

type TableColumnsProps = {
  dataSource: Record[]
  onEdit: (record: Record) => void
  onDelete: (id: string) => void
}

export const TableColumns = ({
  dataSource,
  onEdit,
  onDelete,
}: TableColumnsProps): ColumnsType<Record> => {
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
          options={getColumnFilters(dataSource, 'name')}
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
          options={getColumnFilters(dataSource, 'address')}
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
          options={getColumnFilters(dataSource, 'memo')}
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
        <FilterDropdown {...props} options={getDateFilterOptions(dataSource)} />
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
        <FilterDropdown
          {...props}
          options={getColumnFilters(dataSource, 'job')}
        />
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
                onClick: () => onEdit(record),
              },
              {
                type: 'divider',
              },
              {
                key: 'delete',
                label: '삭제',
                danger: true,
                onClick: () => onDelete(record.id),
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

  return columns
}

// 기본 컬럼과 커스텀 컬럼 합치기 기능
export const combineColumns = (
  columns: ColumnsType<Record>,
  customColumns: ColumnsType<Record> = [],
) => {
  if (columns.length === 0) return []

  // 기본 컬럼의 마지막 요소(액션 컬럼)를 불러와서 부분 배열 생성
  const baseColumnsWithoutAction = columns.slice(0, columns.length - 1)
  const actionColumn = columns[columns.length - 1]

  // 최종 컬럼: 기본 컬럼 + 커스텀 컬럼 + 액션 컬럼
  return [...baseColumnsWithoutAction, ...customColumns, actionColumn]
}
