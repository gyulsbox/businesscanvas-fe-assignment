import { useState } from 'react'
import { type Record } from '@/types/records'
import { loadRecords, saveRecords, storageType } from '@/utils/storage'

// 초기 레코드 (앱 초기화 시 사용)
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

export const useRecords = () => {
  // 로컬 스토리지에서 데이터를 불러오거나 초기 데이터 사용
  const [records, setRecords] = useState<Record[]>(() => {
    // in-memory 모드에서는 초기 데이터 사용
    if (storageType === 'in-memory') {
      return [...INITIAL_RECORDS]
    }

    // local-storage 모드에서는 저장된 데이터가 있으면 그것을, 없으면 초기 데이터 사용
    const savedRecords = loadRecords()
    return savedRecords.length > 0 ? savedRecords : [...INITIAL_RECORDS]
  })

  // 저장 처리를 위한 헬퍼 함수
  const saveRecordsHandler = (newRecords: Record[]) => {
    setRecords(newRecords)
    saveRecords(newRecords)
  }

  // 레코드 추가
  const addRecord = (data: Record) => {
    const newRecords = [...records, data]
    saveRecordsHandler(newRecords)
  }

  // 레코드 수정
  const updateRecord = (id: string, data: Partial<Record>) => {
    const newRecords = records.map((item) =>
      item.id === id ? { ...item, ...data, updatedAt: new Date() } : item,
    )
    saveRecordsHandler(newRecords)
  }

  // 레코드 삭제
  const deleteRecord = (id: string) => {
    const newRecords = records.filter((item) => item.id !== id)
    saveRecordsHandler(newRecords)
  }

  return {
    records,
    addRecord,
    updateRecord,
    deleteRecord,
  }
}
