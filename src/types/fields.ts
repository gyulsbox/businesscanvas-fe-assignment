// 각 필드 타입별 제약사항을 포함한 타입 정의
export interface TextFieldConstraints {
  maxLength: number
}

export interface TextAreaFieldConstraints {
  maxLength: number
}

export interface DateFieldConstraints {
  // 날짜 관련 제약사항
}

export interface SelectFieldConstraints {
  options: readonly string[]
}

export interface CheckboxFieldConstraints {
  // 체크박스 관련 제약사항
}

// 필드 타입별 세부 정의
export interface TextField {
  readonly type: 'text'
  readonly constraints: TextFieldConstraints
}

export interface TextAreaField {
  readonly type: 'textarea'
  readonly constraints: TextAreaFieldConstraints
}

export interface DateField {
  readonly type: 'date'
  readonly constraints: DateFieldConstraints
}

export interface SelectField {
  readonly type: 'select'
  readonly constraints: SelectFieldConstraints
}

export interface CheckboxField {
  readonly type: 'checkbox'
  readonly constraints: CheckboxFieldConstraints
}

// 필드 타입 유니온
export type FieldType =
  | TextField
  | TextAreaField
  | DateField
  | SelectField
  | CheckboxField

// 기본 필드 정의 인터페이스
export interface BaseField<T extends FieldType = FieldType> {
  readonly id: string
  readonly fieldType: T
  readonly label: string
  readonly required: boolean
}

// 각 타입별 필드 정의
export type TextFieldDefinition = BaseField<TextField>
export type TextAreaFieldDefinition = BaseField<TextAreaField>
export type DateFieldDefinition = BaseField<DateField>
export type SelectFieldDefinition = BaseField<SelectField>
export type CheckboxFieldDefinition = BaseField<CheckboxField>

// 필드 유니온 타입
export type Field =
  | TextFieldDefinition
  | TextAreaFieldDefinition
  | DateFieldDefinition
  | SelectFieldDefinition
  | CheckboxFieldDefinition
