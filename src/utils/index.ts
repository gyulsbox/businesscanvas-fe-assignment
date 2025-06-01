// 타입 가드 함수들
import type {
  CheckboxFieldDefinition,
  DateFieldDefinition,
  Field,
  SelectFieldDefinition,
  TextAreaFieldDefinition,
  TextFieldDefinition,
} from '@/types/fields.ts'

export const isTextField = (field: Field): field is TextFieldDefinition =>
  field.fieldType.type === 'text'

export const isTextAreaField = (
  field: Field,
): field is TextAreaFieldDefinition => field.fieldType.type === 'textarea'

export const isDateField = (field: Field): field is DateFieldDefinition =>
  field.fieldType.type === 'date'

export const isSelectField = (field: Field): field is SelectFieldDefinition =>
  field.fieldType.type === 'select'

export const isCheckboxField = (
  field: Field,
): field is CheckboxFieldDefinition => field.fieldType.type === 'checkbox'

// 유틸리티 함수
export const getSelectOptions = (
  field: Field,
): readonly string[] | undefined =>
  isSelectField(field) ? field.fieldType.constraints.options : undefined

export const getMaxLength = (field: Field): number | undefined => {
  if (isTextField(field)) {
    return field.fieldType.constraints.maxLength
  }
  if (isTextAreaField(field)) {
    return field.fieldType.constraints.maxLength
  }
  return undefined
}
