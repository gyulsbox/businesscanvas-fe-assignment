describe('회원 관리 시스템', () => {
  beforeEach(() => {
    // 매 테스트 전에 페이지 방문
    cy.visit('/')
    
    // 로컬 스토리지 초기화 (테스트 간 독립성 보장)
    cy.window().then((win) => {
      win.localStorage.clear()
    })
  })

  it('회원 목록 테이블이 표시되어야 함', () => {
    cy.get('[data-cy=member-table]').should('be.visible')
    // 초기 데이터 2개가 보여야 함
    cy.get('[data-cy=member-table] tbody tr').should('have.length', 2)
  })

  it('회원 추가 기능이 동작해야 함', () => {
    // 추가 버튼 클릭
    cy.get('[data-cy=add-member-button]').click()
    
    // 모달이 나타나야 함
    cy.get('[data-cy=member-form-modal]').should('be.visible')
    
    // 폼 입력
    cy.get('[data-cy=input-name]').type('테스트 회원')
    cy.get('.ant-picker').click() // 날짜 선택기 클릭
    cy.get('.ant-picker-cell-today').click() // 오늘 날짜 선택
    
    // 저장 버튼 클릭
    cy.get('[data-cy=submit-button]').click()
    
    // 테이블에 새 회원이 추가되어야 함
    cy.get('[data-cy=member-table] tbody tr').should('have.length', 3)
    cy.contains('테스트 회원').should('be.visible')
  })

  it('회원 수정 기능이 동작해야 함', () => {
    // 첫 번째 회원의 수정 버튼 클릭 (드롭다운 열기)
    cy.get('[data-cy^=action-button-]').first().click()
    
    // 드롭다운 메뉴에서 '수정' 클릭
    cy.get('.data-cy-edit-action').click()
    
    // 모달이 나타나야 함
    cy.get('[data-cy=member-form-modal]').should('be.visible')
    
    // 이름 수정
    cy.get('[data-cy=input-name]').clear().type('수정된 회원')
    
    // 저장 버튼 클릭
    cy.get('[data-cy=submit-button]').click()
    
    // 테이블에 수정된 회원 정보가 표시되어야 함
    cy.contains('수정된 회원').should('be.visible')
  })

  it('회원 삭제 기능이 동작해야 함', () => {
    // 초기 행 수 확인
    cy.get('[data-cy=member-table] tbody tr').then($rows => {
      const initialRowCount = $rows.length
      
      // 첫 번째 회원의 삭제 버튼 클릭 (드롭다운 열기)
      cy.get('[data-cy^=action-button-]').first().click()
      
      // 드롭다운 메뉴에서 '삭제' 클릭
      cy.get('.data-cy-delete-action').click()
      
      // 테이블에서 행이 삭제되어야 함
      cy.get('[data-cy=member-table] tbody tr').should('have.length', initialRowCount - 1)
    })
  })

  it('필터링 기능이 동작해야 함', () => {
    // 직업 컬럼 필터 버튼 클릭
    cy.get('[data-cy=member-table]').contains('직업').parent().find('.ant-table-filter-trigger').click()
    
    // 개발자 옵션 선택
    cy.get('[data-cy=filter-dropdown-container]').should('be.visible')
    cy.get('[data-cy=filter-option-개발자]').click()
    
    // 필터링된 결과 확인 (개발자만 표시)
    cy.get('[data-cy=member-table] tbody tr').should('have.length', 1)
    cy.contains('개발자').should('be.visible')
    
    // 개발자 옵션 선택 초기화
    cy.get('[data-cy=filter-dropdown-container]').should('be.visible')
    cy.get('[data-cy=filter-option-개발자]').click()
    
    // 모든 회원이 다시 표시되어야 함
    cy.get('[data-cy=member-table] tbody tr').should('have.length', 2)
  })

  // 체크박스 선택 기능 테스트
  it('체크박스 선택 기능이 동작해야 함', () => {
    // 첫 번째 행 선택
    cy.get('.ant-table-selection > .ant-checkbox-wrapper > .ant-checkbox > .ant-checkbox-input').check()
    
    // 모든 행이 선택되어야 함
    cy.get('[data-cy=member-table] tbody tr .selection-checkbox input[type="checkbox"]:checked').should('have.length', 2)
    
    // 선택 해제
    cy.get('.ant-table-selection > .ant-checkbox-wrapper > .ant-checkbox > .ant-checkbox-input').uncheck()
    
    // 모든 행이 선택 해제되어야 함
    cy.get('[data-cy=member-table] tbody tr .selection-checkbox input[type="checkbox"]:checked').should('have.length', 0)
  })

  // 로컬 스토리지 저장 테스트
  it('회원 데이터가 로컬 스토리지에 저장되어야 함', () => {
    // 로컬 스토리지 비우기
    cy.window().then((win) => {
      win.localStorage.clear()
    })
    
    // 페이지 새로고침
    cy.reload()
    
    // 초기 데이터 확인
    cy.get('[data-cy=member-table] tbody tr').should('have.length', 2)
    
    // 회원 추가
    cy.get('[data-cy=add-member-button]').click()
    cy.get('[data-cy=input-name]').type('로컬 스토리지 테스트')
    cy.get('.ant-picker').click()
    cy.get('.ant-picker-cell-today').click()
    cy.get('[data-cy=submit-button]').click()
    
    // 페이지 새로고침
    cy.reload()
    
    // 추가된 회원이 유지되어야 함
    cy.get('[data-cy=member-table] tbody tr').should('have.length', 3)
    cy.contains('로컬 스토리지 테스트').should('be.visible')
  })
})
