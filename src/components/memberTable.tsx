import { useState } from 'react'
import { Table } from 'antd'
import type { Record } from '@/types/records'
import { TableColumns } from './tableColumns'

type MemberTableProps = {
  dataSource: Record[]
  onEdit: (record: Record) => void
  onDelete: (id: string) => void
}

export function MemberTable({
  dataSource,
  onEdit,
  onDelete,
}: MemberTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const columns = TableColumns({ dataSource, onEdit, onDelete })

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys)
    },
    selections: false, // 기본 드롭다운 비활성화
  }

  return (
    <Table
      rowSelection={rowSelection}
      dataSource={dataSource}
      columns={columns}
      rowKey="id"
      className="custom-table"
      pagination={false}
    />
  )
}
