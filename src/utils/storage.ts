import { type Record } from '@/types/records'

const STORAGE_KEY = 'member-records'

// 환경 변수에서 스토리지 타입 가져오기
export const storageType = import.meta.env.VITE_STORAGE || 'in-memory'

// 로컬 스토리지에서 데이터 가져오기
export const loadRecords = (): Record[] => {
  // in-memory 모드에서는 빈 배열 반환
  if (storageType === 'in-memory') {
    return []
  }

  try {
    const storedData = localStorage.getItem(STORAGE_KEY)
    if (storedData) {
      const parsedData = JSON.parse(storedData) as Record[]
      // Date 객체로 변환
      return parsedData.map((record) => ({
        ...record,
        joinDate: new Date(record.joinDate),
      }))
    }
  } catch (error) {
    console.error('로컬 스토리지에서 데이터를 가져오는 중 오류 발생:', error)
  }

  return []
}

// 로컬 스토리지에 데이터 저장
export const saveRecords = (records: Record[]): void => {
  if (storageType === 'in-memory') {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch (error) {
    console.error('로컬 스토리지에 데이터를 저장하는 중 오류 발생:', error)
  }
}
