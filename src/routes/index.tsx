import { type Record } from '@/types/records'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Checkbox, Flex, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { StyleProvider } from '@ant-design/cssinjs'
import { format } from 'date-fns'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  //이름, 주소, 메모, 가입일, 직업, 이메일 수신 동의
  const columns: ColumnsType<Record> = [
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '주소',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '메모',
      dataIndex: 'memo',
      key: 'memo',
    },
    {
      title: '가입일',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (text, record) => format(record.joinDate, 'yyyy-MM-dd'),
    },
    {
      title: '직업',
      dataIndex: 'job',
      key: 'job',
    },
    {
      title: '이메일 수신 동의',
      dataIndex: 'emailConsent',
      key: 'emailConsent',
      render: (text, record) => <Checkbox checked={record.emailConsent} />,
    },
  ]

  const INITIAL_RECORDS: readonly Record[] = [
    {
      id: '1',
      name: 'John Doe',
      address: '서울 강남구',
      memo: '외국인',
      joinDate: new Date('2023-01-15'),
      job: '개발자',
      emailConsent: true,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-15'),
    },
    {
      id: '2',
      name: '홍길동',
      address: '서울 마포구',
      memo: '내국인',
      joinDate: new Date('2023-02-20'),
      job: '디자이너',
      emailConsent: false,
      createdAt: new Date('2023-02-20'),
      updatedAt: new Date('2023-02-20'),
    },
  ]

  const [dataSource, setDataSource] = useState(INITIAL_RECORDS)

  return (
    <StyleProvider layer>
      <div className="w-dvw h-dvh flex flex-col">
        <Flex
          align="center"
          justify="space-between"
          className="px-3.5 h-12 w-full"
        >
          <Typography.Text className="text-title">회원 목록</Typography.Text>
          <Button type="primary" icon={<PlusOutlined />} className="text-body">
            추가
          </Button>
        </Flex>
        <Table columns={columns} dataSource={dataSource} pagination={false} />
      </div>
    </StyleProvider>
  )
}
