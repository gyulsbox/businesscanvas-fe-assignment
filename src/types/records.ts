// 레코드 타입
export interface Record {
  readonly id: string
  // 기본 필드
  readonly name: string
  readonly address: string
  readonly memo: string
  readonly joinDate: Date
  readonly job: string
  readonly emailConsent: boolean
  
  // 커스텀 필드 지원 - 사용자가 추가한 필드를 동적으로 저장
  readonly customFields?: { [fieldId: string]: any }
}
