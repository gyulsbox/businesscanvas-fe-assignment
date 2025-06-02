# 비즈니스캔버스 프론트엔드 개발자 채용 과제

회원 목록을 관리할 수 있는 테이블 애플리케이션입니다.

## 🚀 실행 방법

```bash
# 패키지 설치
pnpm install

# 개발 서버 실행 (로컬 스토리지 - 기본값)
pnpm dev

# E2E 테스트 실행
pnpm run e2e:run || pnpm run e2e:open
```

## 📋 주요 기능

### 멤버 관리
- **추가**: 모달을 통한 새 멤버 등록
- **수정**: 기존 멤버 정보 수정
- **삭제**: 멤버 제거
- **필터링**: 각 필드별 데이터 필터링

### 데이터 저장
- **인메모리 모드**: 새로고침 시 데이터 초기화 (기본값)
- **로컬 스토리지 모드**: 브라우저 재시작 후에도 데이터 유지

## 🛠 기술 스택

- **React** + **TypeScript**: 컴포넌트 기반 UI 및 타입 안전성
- **Ant Design**: 디자인 시스템 및 UI 컴포넌트
- **TanStack Router**: 파일 기반 라우팅
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **Vite**: 빌드 도구 및 개발 서버
- **Cypress**: E2E 테스트

## 🏗 핵심 설계 사항

### 1. 타입 시스템 기반 추상화

필드와 레코드 구조를 타입스크립트로 엄격하게 정의하여 확장성을 확보했습니다.

```typescript
export interface BaseField<T extends FieldType = FieldType> {
  readonly id: string
  readonly fieldType: T
  readonly label: string
  readonly required: boolean
}

export interface TextField {
  readonly type: 'text'
  readonly constraints: TextFieldConstraints
}
```

### 2. 확장 가능한 필드 시스템

커스텀 필드 추가를 위한 확장성을 미리 고려한 설계:

- 필드 타입별 제약사항 분리 관리
- 공통 인터페이스를 통한 일관성 유지
- 레코드 구조에 `customFields` 필드 사전 정의

### 3. 컴포넌트 상태 관리

Context API 대신 커스텀 훅을 활용한 가벼운 상태 관리:

- `useRecords`: 데이터 CRUD 및 저장 로직
- `useMemberModal`: 모달 상태 관리
- `useMemberManager`: 상위 두 훅의 통합 인터페이스

소규모 애플리케이션에서 불필요한 복잡도를 피하고 테스트 용이성을 높였습니다.

### 4. 폼 검증 및 스타일링

- **Ant Design Form**: 선언적 검증 규칙 및 일관된 에러 표시
- **StyleProvider**: Ant Design과 Tailwind CSS 간 스타일 충돌 방지

## 🧪 테스트

Cypress를 활용한 E2E 테스트로 주요 기능을 검증합니다.

### 테스트 커버리지
- **기본 기능**: 회원 목록 조회, 추가, 수정, 삭제
- **필터링**: 직업 필드별 데이터 필터링
- **체크박스 선택**: 전체/개별 행 선택 기능
- **데이터 지속성**: 로컬 스토리지 저장 및 복원

### 테스트 실행
```bash
# 헤드리스 모드로 테스트 실행
pnpm run e2e:run

# 브라우저에서 테스트 실행 (GUI)
pnpm run e2e:open
```

## 🔧 환경 변수 설정

```env
# 데이터 저장 모드 (in-memory 또는 local-storage)
STORAGE=local-storage
```

## 📊 초기 데이터

기본적으로 2개의 샘플 레코드가 제공됩니다:

1. **John Doe** - 서울 강남구, 개발자, 2024-10-02 가입
2. **Foo Bar** - 서울 서초구, PO, 2024-10-01 가입

## 🎯 기술적 의사결정

### TanStack Router 선택 이유
파일 기반 라우팅을 통한 직관적인 라우트 구조 관리

### Ant Design + Tailwind CSS 조합
- Ant Design: 완성도 높은 컴포넌트와 폼 검증
- Tailwind CSS: 빠른 커스텀 스타일링
- `@ant-design/cssinjs` StyleProvider로 스타일 레이어 분리

### 커스텀 훅 패턴
- 단순한 상태 관리로 Context API의 오버헤드 방지
- 로직의 재사용성과 테스트 용이성 확보
- 컴포넌트와 비즈니스 로직의 명확한 분리

## 📈 확장성 고려사항

### 커스텀 필드 지원 준비

향후 사용자 정의 필드 기능 추가를 위한 기반 구조 구현:

```typescript
// 확장 가능한 필드 구조 (예시)
const customFields: Field[] = [
  {
    id: 'department',
    label: '부서',
    required: false,
    fieldType: {
      type: 'text',
      constraints: { maxLength: 100 },
    },
  },
]
```

- 필드 타입별 동적 입력 컴포넌트 렌더링 구조
- 제약사항 검증 로직의 확장성
- 레코드 스키마의 유연한 확장 지원
