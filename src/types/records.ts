// 레코드 타입
export interface Record {
  readonly id: string
  readonly name: string
  readonly address: string
  readonly memo: string
  readonly joinDate: Date
  readonly job: string
  readonly emailConsent: boolean
  readonly createdAt: Date
  readonly updatedAt: Date
}
