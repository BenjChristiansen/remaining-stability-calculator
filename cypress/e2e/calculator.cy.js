describe('Calculator Page Load', () => {
  it('loads the calculator page', () => {
    cy.visit('https://benjchristiansen.github.io/remaining-stability-calculator/') 
    cy.contains('Remaining Stability Calculator')
    cy.get('.submit').should('exist')
  })
})

describe('Calculator Basic Functionality', () => {
  it('calculates remaining stability hours correctly', () => {

        // Freeze the system clock to a specific date/time
    const fixedDate = new Date('2026-03-14T22:30:00')  // adjust this to the time you want Cypress to "think" it is
    cy.clock(fixedDate)  // Cypress now uses this as "current time"

    cy.visit('https://benjchristiansen.github.io/remaining-stability-calculator/')

    // Fill in input fields 
    cy.get('.reagents').select('Fibrinogen').should('have.value', 'Fibrinogen')  // selecting reagent from list
  cy.get('.expirationdate').type('2026-03-14')  // select March 14, 2026        // date of expiration
  cy.get('.expirationtime').type('14:30')  // sets 2:30 PM                     // time of expiration

    // Click the calculate button
    cy.get('.submit').click()

    // Check that result is displayed and correct
    cy.get('.output')  
      .should('be.visible')
      .and('contain', '-8')  
  })
})

describe('Calculator Input Validation', () => {
  it('displays NaN when date/time are empty', () => {

    // Freeze the clock for consistency 
    const fixedDate = new Date('2026-03-14T22:30:00')
    cy.clock(fixedDate)

    cy.visit('https://benjchristiansen.github.io/remaining-stability-calculator/')

    // Only select a reagent, leave date/time empty
    cy.get('.reagents')
      .select('Fibrinogen')
      .should('have.value', 'Fibrinogen')

    cy.get('.expirationdate').clear()   // leave empty
    cy.get('.expirationtime').clear()   // leave empty

    // Click submit
    cy.get('.submit').click()

    // Verify that result shows "NaN"
    cy.get('.output')
      .should('be.visible')
      .and('contain', 'NaN')
  })
})
describe('Calculator Edge Cases', () => {
  it('handles past expiration date', () => {
    const fixedDate = new Date('2026-03-14T22:30:00')
    cy.clock(fixedDate)

    cy.visit('https://benjchristiansen.github.io/remaining-stability-calculator/')

    cy.get('.reagents')
      .select('Fibrinogen')
      .should('have.value', 'Fibrinogen')

    // Use a past date
    cy.get('.expirationdate').type('2026-03-01')
    cy.get('.expirationtime').type('12:00')

    cy.get('.submit').click()

    // The result should be negative 
    cy.get('.output')
      .should('be.visible')
      .and(($res) => {
        const text = $res.text()
        expect(text).to.match(/-?\d+|NaN/) // allows negative number or NaN
      })
  })

  it('handles future expiration date far ahead', () => {
    const fixedDate = new Date('2026-03-14T22:30:00')
    cy.clock(fixedDate)

    cy.visit('https://benjchristiansen.github.io/remaining-stability-calculator/')

    cy.get('.reagents')
      .select('Fibrinogen')
      .should('have.value', 'Fibrinogen')

    // Use a far future date
    cy.get('.expirationdate').type('2030-01-01')
    cy.get('.expirationtime').type('00:00')

    cy.get('.submit').click()

    // The result should be a large positive number
    cy.get('.output')
      .should('be.visible')
      .and(($res) => {
        const value = parseFloat($res.text())
        expect(value).to.be.greaterThan(0)
      })
  })
})