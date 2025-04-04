/// <reference types="jest" />
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import SignupPage from "@/app/signup/page";
import { VersionProvider } from "@/lib/version/VersionContext";

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  }),
) as jest.Mock;

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    length: 0,
    key: jest.fn(),
    removeItem: jest.fn(),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("SignupPage", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    // Mock window.location.href
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { href: "" },
      writable: true,
    });
  });

  afterEach(() => {
    // Restore window.location
    Object.defineProperty(window, "location", {
      configurable: true,
      value: window.location,
      writable: true,
    });
  });

  describe("Version Resolution", () => {
    it("should use ai-pipeline version when ?version=ai is present", async () => {
      // Mock URL params
      const mockParams = new URLSearchParams();
      mockParams.set("version", "ai");
      (global.__mocks__.mockUseSearchParams as jest.Mock).mockImplementation(
        () => mockParams,
      );

      await act(async () => {
        render(
          <VersionProvider>
            <SignupPage />
          </VersionProvider>,
        );
      });

      // Should store ai-pipeline version
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          "landing_version",
          "ai-pipeline",
        );
      });

      // Should show AI content
      expect(
        screen.getByText("Deploy High-Performance AI Models with Ease"),
      ).toBeInTheDocument();
    });

    it("should use version from URL param when valid version is provided", async () => {
      // Mock URL params with 'cloud' version
      const mockParams = new URLSearchParams();
      mockParams.set("version", "cloud");
      (global.__mocks__.mockUseSearchParams as jest.Mock).mockImplementation(
        () => mockParams,
      );

      await act(async () => {
        render(
          <VersionProvider>
            <SignupPage />
          </VersionProvider>,
        );
      });

      // Should store cloud version
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          "landing_version",
          "cloud",
        );
      });

      // Should show cloud content
      expect(
        screen.getByText("Modern Cloud Platform for Growing Teams"),
      ).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should validate email format", async () => {
      await act(async () => {
        render(
          <VersionProvider>
            <SignupPage />
          </VersionProvider>,
        );
      });

      // Fill out the form
      const emailInput = screen.getByLabelText(/email address/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole("button", { name: /sign up/i });

      // Fill required fields
      await act(async () => {
        fireEvent.change(lastNameInput, { target: { value: "Doe" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.change(confirmPasswordInput, {
          target: { value: "password123" },
        });
      });

      // Test invalid email
      await act(async () => {
        fireEvent.change(emailInput, {
          target: { value: "invalid-email@test" },
        });
      });

      await act(async () => {
        fireEvent.submit(screen.getByRole("form", { name: /user/i }));
      });

      // Should show error message
      await waitFor(() => {
        const errorContainer = screen
          .getByText("Please enter a valid email address")
          .closest("div.p-3");
        expect(errorContainer).toHaveClass("text-red-500");
      });

      // Test valid email
      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "valid@email.com" } });
      });

      await act(async () => {
        fireEvent.submit(screen.getByRole("form", { name: /user/i }));
      });

      // Error message should be gone
      await waitFor(() => {
        expect(
          screen.queryByText("Please enter a valid email address"),
        ).not.toBeInTheDocument();
      });
    });

    it("should validate password matching", async () => {
      await act(async () => {
        render(
          <VersionProvider>
            <SignupPage />
          </VersionProvider>,
        );
      });

      // Fill out the form
      const emailInput = screen.getByLabelText(/email address/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      // Fill required fields
      await act(async () => {
        fireEvent.change(lastNameInput, { target: { value: "Doe" } });
        fireEvent.change(emailInput, { target: { value: "valid@email.com" } });
      });

      // Enter mismatched passwords
      await act(async () => {
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.change(confirmPasswordInput, {
          target: { value: "password456" },
        });
      });

      await act(async () => {
        fireEvent.submit(screen.getByRole("form", { name: /user/i }));
      });

      // Should show error message
      await waitFor(() => {
        const errorContainer = screen
          .getByText("Passwords do not match")
          .closest("div.p-3");
        expect(errorContainer).toHaveClass("text-red-500");
      });

      // Fix password mismatch
      await act(async () => {
        fireEvent.change(confirmPasswordInput, {
          target: { value: "password123" },
        });
      });

      await act(async () => {
        fireEvent.submit(screen.getByRole("form", { name: /user/i }));
      });

      // Error message should be gone
      await waitFor(() => {
        expect(
          screen.queryByText("Passwords do not match"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("should handle successful signup and redirect", async () => {
      await act(async () => {
        render(
          <VersionProvider>
            <SignupPage />
          </VersionProvider>,
        );
      });

      // Mock successful API response with redirect URL
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              redirectUrl: "https://example.com/verify",
            }),
        }),
      );

      // Fill out the form
      const emailInput = screen.getByLabelText(/email address/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      await act(async () => {
        fireEvent.change(lastNameInput, { target: { value: "Doe" } });
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.change(confirmPasswordInput, {
          target: { value: "password123" },
        });
      });

      // Submit the form
      await act(async () => {
        fireEvent.submit(screen.getByRole("form", { name: /user/i }));
      });

      // Verify API call and redirect
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/signup",
          expect.any(Object),
        );
        expect(window.location.href).toBe("https://example.com/verify");
      });
    });
  });
});
