import { type Record } from '@/types/records'
import dayjs from 'dayjs'

// 필터링을 위한 고유 값 추출 함수
export const getColumnFilters = (
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
export const emailConsentFilters = [
  { text: '동의', value: 'true' },
  { text: '미동의', value: 'false' },
]

// 날짜 필터 옵션 생성 함수
export const getDateFilterOptions = (dataSource: readonly Record[]) => {
  return dataSource
    .map((item) => dayjs(item.joinDate).format('YYYY-MM-DD'))
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((date) => ({ text: date, value: date }))
}
