import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Testing Setup', () => {
  it('should work with basic DOM assertions', () => {
    render(<div data-testid="test-element">Test Content</div>)
    expect(screen.getByTestId('test-element')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeVisible()
  })
}) 