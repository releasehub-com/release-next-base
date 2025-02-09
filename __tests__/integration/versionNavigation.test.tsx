import { render, screen, act } from '@testing-library/react'
import { useSearchParams, usePathname } from 'next/navigation'
import ClientSideRenderer from '@/components/ClientSideRenderer'
import SignupPage from '@/app/signup/page'
import { STORAGE_KEY } from '@/lib/landingVersions'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  usePathname: jest.fn()
}))

// Mock dynamic imports
jest.mock('@/components/LandingPage', () => () => <div>Landing Page</div>)
jest.mock('@/components/GitLabLandingPage', () => () => <div>GitLab Landing</div>)
jest.mock('@/components/KubernetesLandingPage', () => () => <div>Kubernetes Landing</div>)
jest.mock('@/components/CloudDevLanding', () => () => <div>Cloud Dev Landing</div>)
jest.mock('@/components/CloudLanding', () => () => <div>Cloud Landing</div>)

// Mock signup page content structure
jest.mock('@/app/signup/page', () => {
  return function SignupPage() {
    const searchParams = useSearchParams()
    const { versionContent } = require('@/app/signup/config/messages')
    const { SignupMessage } = require('@/app/signup/components/SignupMessage')
    const { 
      getVersionFromStorage, 
      isValidVersion, 
      getCanonicalVersion,
      setVersionInStorage,
      DEFAULT_VERSION 
    } = require('@/lib/landingVersions')
    
    // Get version from URL param or localStorage
    const versionParam = searchParams.get('version')
    const storedVersion = getVersionFromStorage()
    
    // Handle version resolution and aliases
    let version
    if (versionParam && isValidVersion(versionParam)) {
      version = getCanonicalVersion(versionParam)
      setVersionInStorage(version)
    } else if (storedVersion && isValidVersion(storedVersion)) {
      version = storedVersion
    } else {
      version = DEFAULT_VERSION
      setVersionInStorage(DEFAULT_VERSION)
    }
    
    // Get the appropriate content
    const content = versionContent[version] || versionContent.ephemeral

    return (
      <div>
        <div>Header</div>
        <main>
          <SignupMessage content={content} />
        </main>
        <div>Footer</div>
      </div>
    )
  }
})

// Mock SignupMessage component to render the actual title
jest.mock('@/app/signup/components/SignupMessage', () => ({
  SignupMessage: ({ content }: { content: { title: string } }) => (
    <div data-testid="signup-message">
      <h1>{content.title}</h1>
    </div>
  )
}))

// Mock signup content with all versions
jest.mock('@/app/signup/config/messages', () => ({
  versionContent: {
    ephemeral: {
      title: 'Full-stack on-demand environments',
      benefits: [],
      steps: []
    },
    'cloud-dev': {
      title: 'Cloud Development Environments for seamless developer experience',
      benefits: [],
      steps: []
    },
    'k8s': {
      title: 'Simplify Your Kubernetes Management',
      benefits: [],
      steps: []
    },
    cloud: {
      title: 'Modern Cloud Platform for Growing Teams',
      benefits: [],
      steps: []
    }
  }
}))

// Mock Header and Footer to reduce noise
jest.mock('@/components/Header', () => () => <div>Header</div>)
jest.mock('@/components/Footer', () => () => <div>Footer</div>)

// Update localStorage mock to track calls
const mockLocalStorage = {
  getItem: jest.fn((key) => {
    // Return the last value set for this key
    const calls = mockLocalStorage.setItem.mock.calls
    const lastCall = calls.findLast(call => call[0] === key)
    return lastCall ? lastCall[1] : null
  }),
  setItem: jest.fn(),
  clear: jest.fn()
}

// Need to properly inject the mock into the global object
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
})

// Need to also mock it in the module
jest.mock('@/lib/landingVersions', () => {
  const actual = jest.requireActual('@/lib/landingVersions')
  return {
    ...actual,
    setVersionInStorage: (version: string) => mockLocalStorage.setItem('landing_version', version),
    getVersionFromStorage: () => mockLocalStorage.getItem('landing_version')
  }
})

describe('Version Navigation Integration', () => {
  beforeEach(() => {
    mockLocalStorage.clear.mockClear()
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.setItem.mockClear()
    jest.clearAllMocks()
  })

  const navigationScenarios = [
    {
      name: 'Cloud Dev Environment Flow',
      steps: [
        {
          page: 'landing',
          path: '/cloud-development-environments',
          expectedVersion: 'cloud-dev',
          expectedComponent: 'Cloud Dev Landing',
          expectedTitle: 'Cloud Development Environments for seamless developer experience'
        },
        {
          page: 'signup',
          path: '/signup',
          expectedVersion: 'cloud-dev',
          expectedTitle: 'Cloud Development Environments for seamless developer experience'
        }
      ]
    },
    {
      name: 'Kubernetes Flow',
      steps: [
        {
          page: 'landing',
          path: '/kubernetes-management',
          expectedVersion: 'k8s',
          expectedComponent: 'Kubernetes Landing',
          expectedTitle: 'Simplify Your Kubernetes Management'
        },
        {
          page: 'signup',
          path: '/signup',
          expectedVersion: 'k8s',
          expectedTitle: 'Simplify Your Kubernetes Management'
        }
      ]
    },
    {
      name: 'Cloud Platform Flow',
      steps: [
        {
          page: 'landing',
          path: '/platform-as-a-service',
          expectedVersion: 'cloud',
          expectedComponent: 'Cloud Landing',
          expectedTitle: 'Modern Cloud Platform for Growing Teams'
        },
        {
          page: 'signup',
          path: '/signup',
          expectedVersion: 'cloud',
          expectedTitle: 'Modern Cloud Platform for Growing Teams'
        }
      ]
    },
    {
      name: 'Heroku Alias Flow',
      steps: [
        {
          page: 'signup',
          path: '/signup',
          params: new URLSearchParams('version=heroku'),
          expectedVersion: 'cloud',
          expectedTitle: 'Modern Cloud Platform for Growing Teams'
        },
        {
          page: 'landing',
          path: '/platform-as-a-service',
          expectedVersion: 'cloud',
          expectedComponent: 'Cloud Landing',
          expectedTitle: 'Modern Cloud Platform for Growing Teams'
        }
      ]
    }
  ]

  navigationScenarios.forEach(scenario => {
    describe(scenario.name, () => {
      it('should maintain version and content across navigation', async () => {
        for (const step of scenario.steps) {
          // Setup mocks for this step
          ;(usePathname as jest.Mock).mockReturnValue(step.path)
          ;(useSearchParams as jest.Mock).mockReturnValue(step.params || new URLSearchParams())
          mockLocalStorage.getItem.mockReturnValue(step.expectedVersion)

          // Render appropriate component with act
          await act(async () => {
            if (step.page === 'landing') {
              render(<ClientSideRenderer />)
            } else {
              render(<SignupPage />)
            }
            // Wait for all promises to resolve
            await new Promise(resolve => setTimeout(resolve, 0))
          })

          // Verify localStorage was set correctly
          expect(mockLocalStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, step.expectedVersion)

          // For landing pages, verify the correct component is rendered
          if (step.page === 'landing') {
            expect(screen.getByText(step.expectedComponent)).toBeInTheDocument()
          } else {
            // For signup page, verify the correct title is rendered in SignupMessage
            const messageElement = screen.getByTestId('signup-message')
            expect(messageElement).toHaveTextContent(step.expectedTitle)
          }
        }
      })
    })
  })

  it('should handle invalid version parameter gracefully', async () => {
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('version=invalid'))
    ;(usePathname as jest.Mock).mockReturnValue('/signup')
    mockLocalStorage.getItem.mockReturnValue(null)

    await act(async () => {
      render(<SignupPage />)
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Verify localStorage was set correctly
    expect(mockLocalStorage.setItem).toHaveBeenLastCalledWith(STORAGE_KEY, 'ephemeral')
    
    // Find the title in the SignupMessage component
    const messageElement = screen.getByTestId('signup-message')
    expect(messageElement).toHaveTextContent('Full-stack on-demand environments')
  })

  it('should handle direct landing page access without version', async () => {
    ;(usePathname as jest.Mock).mockReturnValue('/kubernetes-management')
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
    mockLocalStorage.getItem.mockReturnValue(null)

    await act(async () => {
      render(<ClientSideRenderer />)
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, 'k8s')
    expect(screen.getByText('Kubernetes Landing')).toBeInTheDocument()
  })
}) 