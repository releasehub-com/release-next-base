import { render, screen, act } from "@testing-library/react";
import ClientSideRenderer from "@/components/ClientSideRenderer";
import { useSearchParams, usePathname } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

describe("ClientSideRenderer", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should handle URL parameters", () => {
    const mockSearchParams = new URLSearchParams("version=cloud-dev");
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (usePathname as jest.Mock).mockReturnValue("/");

    render(<ClientSideRenderer />);

    expect(localStorage.getItem("landing_version")).toBe("cloud-dev");
  });

  it("should handle direct path access", () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    (usePathname as jest.Mock).mockReturnValue("/kubernetes-management");

    render(<ClientSideRenderer />);

    expect(localStorage.getItem("landing_version")).toBe("k8s");
  });

  it("should prioritize URL params over path", () => {
    const mockSearchParams = new URLSearchParams("version=gitlab");
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (usePathname as jest.Mock).mockReturnValue("/kubernetes-management");

    render(<ClientSideRenderer />);

    expect(localStorage.getItem("landing_version")).toBe("gitlab");
  });
});
