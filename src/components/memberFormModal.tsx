import { useState, useEffect } from 'react'
import { Modal, Form, Input, DatePicker, Select, Checkbox, Button } from 'antd'
import { type Record as MemberRecord } from '@/types/records'
import {
  JOB_OPTIONS,
  type TextFieldConstraints,
  type TextAreaFieldConstraints,
  type DateFieldConstraints,
  type SelectFieldConstraints,
  type CheckboxFieldConstraints,
  type Field,
} from '@/types/fields'
import dayjs from 'dayjs'

const FIELD_VALIDATION = {
  name: {
    required: true,
    message: '이름은 필수값입니다.',
    constraints: {
      maxLength: 100,
    } as TextFieldConstraints,
  },
  address: {
    required: false,
    message: '글자수 20을 초과할 수 없습니다.',
    constraints: {
      maxLength: 20,
    } as TextFieldConstraints,
  },
  memo: {
    required: false,
    message: '글자수 50을 초과할 수 없습니다.',
    constraints: {
      maxLength: 50,
    } as TextAreaFieldConstraints,
  },
  joinDate: {
    required: true,
    message: '가입일을 선택해주세요',
    constraints: {} as DateFieldConstraints,
  },
  job: {
    required: false,
    message: '',
    constraints: {
      options: JOB_OPTIONS as readonly string[],
    } as SelectFieldConstraints,
  },
  emailConsent: {
    required: false,
    message: '',
    constraints: {} as CheckboxFieldConstraints,
  },
}

type MemberFormModalProps = {
  isModalOpen: boolean
  closeModal: () => void
  onSubmit?: (data: MemberRecord) => void
  initialData: MemberRecord | null
  mode: 'add' | 'edit'
  customFields?: Field[] // 커스텀 필드 프로퍼티 유지 (추후 활성화를 위해)
}

export const MemberFormModal = ({
  isModalOpen,
  closeModal,
  onSubmit,
  initialData,
  mode = 'add',
  // customFields = [] // 커스텀 필드 비활성화 (임시)
}: MemberFormModalProps) => {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  // 초기 폼 값 설정
  useEffect(() => {
    if (initialData && isModalOpen && mode === 'edit') {
      form.setFieldsValue({
        ...initialData,
        joinDate: dayjs(initialData.joinDate),
      })
    } else if (isModalOpen && mode === 'add') {
      form.resetFields()
    }
  }, [initialData, isModalOpen, mode, form])

  const handleFormSubmit = (values: any) => {
    setSubmitting(true)

    // values에서 customFields 분리 (있는 경우)
    const { customFields = {}, ...baseValues } = values

    // 제출용 데이터 새로 생성 (속성이 readonly이미로 새 객체 생성)
    const submitData: MemberRecord = {
      // 기본 필드
      id: initialData?.id || String(Date.now()),
      name: baseValues.name,
      address: baseValues.address || '',
      memo: baseValues.memo || '',
      joinDate: baseValues.joinDate
        ? baseValues.joinDate instanceof Date
          ? baseValues.joinDate
          : new Date(baseValues.joinDate)
        : new Date(),
      job: baseValues.job || '',
      emailConsent: !!baseValues.emailConsent,

      // 커스텀 필드
      customFields,
    }

    if (onSubmit) {
      onSubmit(submitData)
    }

    setSubmitting(false)
    closeModal()
  }

  const jobOptions = JOB_OPTIONS.map((option) => ({
    value: option,
    label: option,
  }))

  return (
    <Modal
      data-cy="member-form-modal"
      title={mode === 'add' ? '회원 추가' : '회원 정보 수정'}
      open={isModalOpen}
      onCancel={() => {
        form.resetFields()
        closeModal()
      }}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFormSubmit}
        className="pt-4"
        colon={false}
        initialValues={{
          name: '',
          address: '',
          memo: '',
          joinDate: null,
          job: '개발자',
          emailConsent: false,
        }}
      >
        <Form.Item
          label={
            <span>
              이름 <span className="text-red-500">*</span>
            </span>
          }
          name="name"
          rules={[
            {
              required: FIELD_VALIDATION.name.required,
              message: FIELD_VALIDATION.name.message,
            },
          ]}
        >
          <Input data-cy="input-name" placeholder="이름을 입력하세요" className="text-body" />
        </Form.Item>

        <Form.Item
          label="주소"
          name="address"
          rules={[
            {
              max: FIELD_VALIDATION.address.constraints.maxLength,
              message: FIELD_VALIDATION.address.message,
            },
          ]}
        >
          <Input placeholder="주소를 입력하세요" className="text-body" />
        </Form.Item>

        <Form.Item
          label="메모"
          name="memo"
          rules={[
            {
              max: FIELD_VALIDATION.memo.constraints.maxLength,
              message: FIELD_VALIDATION.memo.message,
            },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder="메모를 입력하세요"
            className="text-body"
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              가입일 <span className="text-red-500">*</span>
            </span>
          }
          name="joinDate"
          rules={[
            {
              required: FIELD_VALIDATION.joinDate.required,
              message: FIELD_VALIDATION.joinDate.message,
            },
          ]}
        >
          <DatePicker
            className="text-body"
            format="YYYY-MM-DD"
            placeholder="Select date"
          />
        </Form.Item>

        <Form.Item
          label="직업"
          name="job"
          rules={[
            {
              required: FIELD_VALIDATION.job.required,
              message: FIELD_VALIDATION.job.message,
            },
          ]}
        >
          <Select options={jobOptions} className="text-body w-[360px]" />
        </Form.Item>

        <Form.Item
          label="이메일 수신 동의"
          name="emailConsent"
          valuePropName="checked"
        >
          <Checkbox className="text-body" />
        </Form.Item>

        {/* 커스텀 필드 렌더링 - 주석 처리
        {customFields.length > 0 && (
          <div className="mt-4 mb-2">
            <div className="text-lg font-medium">추가 정보</div>
            <div className="h-px bg-gray-200 my-2" />
          </div>
        )}
        {customFields.map(renderCustomField)}
        */}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={() => {
              form.resetFields()
              closeModal()
            }}
          >
            취소
          </Button>
          <Form.Item shouldUpdate noStyle>
            {() => {
              // 필수 필드 값이 있는지 확인
              const nameValue = form.getFieldValue('name')
              const joinDateValue = form.getFieldValue('joinDate')
              const hasRequiredValues = nameValue && joinDateValue

              // 폼 에러 확인
              const hasErrors = form
                .getFieldsError()
                .some(({ errors }) => errors.length > 0)

              return (
                <Button
                  data-cy="submit-button"
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  disabled={!hasRequiredValues || hasErrors}
                >
                  {mode === 'add' ? '추가' : '수정'}
                </Button>
              )
            }}
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}
