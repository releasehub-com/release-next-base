"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import type { SocialAccount } from "@/lib/db/schema";
import AIMarketingModal from "./AIMarketingModal";

interface ModalState {
  message: string;
  conversations: {
    twitter: Array<{ role: "user" | "assistant"; content: string }>;
    linkedin: Array<{ role: "user" | "assistant"; content: string }>;
  };
  selectedPlatform: string | null;
  preview: { twitter?: string; linkedin?: string };
  editedPreviews: { twitter?: string; linkedin?: string };
  isPreviewMode: boolean;
  versions: {
    twitter: Array<{
      content: string;
      timestamp: number;
      source: "ai" | "user";
    }>;
    linkedin: Array<{
      content: string;
      timestamp: number;
      source: "ai" | "user";
    }>;
  };
  imageAssets: {
    twitter: Array<{ asset: string; displayUrl: string }>;
    linkedin: Array<{ asset: string; displayUrl: string }>;
  };
}

interface UserMetadata {
  username?: string;
  [key: string]: unknown;
}

export default function FloatingActionButton() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageContext, setPageContext] = useState({
    title: "",
    description: "",
    url: "",
    content: "",
  });
  const [showButton, setShowButton] = useState(false);

  // Add state for modal persistence
  const [modalState, setModalState] = useState<ModalState>({
    message: "",
    conversations: {
      twitter: [
        {
          role: "assistant",
          content: `Hi! I'm your AI marketing assistant. I can help you create Twitter posts about this page.\n\nLet me know what kind of post you'd like to create.`,
        },
      ],
      linkedin: [
        {
          role: "assistant",
          content: `Hi! I'm your AI marketing assistant. I can help you create LinkedIn posts about this page.\n\nLet me know what kind of post you'd like to create.`,
        },
      ],
    },
    selectedPlatform: null,
    preview: {},
    editedPreviews: {},
    isPreviewMode: false,
    versions: {
      twitter: [],
      linkedin: [],
    },
    imageAssets: {
      twitter: [],
      linkedin: [],
    },
  });

  useEffect(() => {
    if (session?.user?.isAdmin) {
      const fetchAccounts = async () => {
        try {
          const response = await fetch("/api/admin/social-accounts");
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to fetch accounts");
          }

          setAccounts(data.accounts);
        } catch (error) {
          console.error("Error fetching accounts:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAccounts();
    }
  }, [session?.user?.isAdmin]);

  // Reset modal state when pathname changes
  useEffect(() => {
    if (session?.user?.isAdmin) {
      // Extract page context
      const timer = setTimeout(() => {
        const newContext = extractPageContext();
        setPageContext(newContext);

        // Reset modal state for new page with initial AI messages
        setModalState({
          message: "",
          conversations: {
            twitter: [
              {
                role: "assistant",
                content: `Hi! I'm your AI marketing assistant. I can help you create Twitter posts about this page:\n\n${newContext.title}\n\nLet me know what kind of post you'd like to create.`,
              },
            ],
            linkedin: [
              {
                role: "assistant",
                content: `Hi! I'm your AI marketing assistant. I can help you create LinkedIn posts about this page:\n\n${newContext.title}\n\nLet me know what kind of post you'd like to create.`,
              },
            ],
          },
          selectedPlatform: accounts[0]?.provider || null,
          preview: {},
          editedPreviews: {},
          isPreviewMode: false,
          versions: {
            twitter: [],
            linkedin: [],
          },
          imageAssets: {
            twitter: [],
            linkedin: [],
          },
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname, accounts, session?.user?.isAdmin]);

  // Add effect to set initial platform when accounts are loaded
  useEffect(() => {
    if (accounts.length > 0 && !modalState.selectedPlatform) {
      setModalState((prevState) => ({
        ...prevState,
        selectedPlatform: accounts[0].provider,
      }));
    }
  }, [accounts, modalState.selectedPlatform]);

  useEffect(() => {
    if (session?.user?.isAdmin) {
      setShowButton(true);
    }
  }, [session?.user?.isAdmin]);

  const extractPageContext = () => {
    // Get page title
    const title = document.title || "";

    // Get meta description
    const metaDescription =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content") || "";

    // Get current URL
    const url = window.location.href;

    // Get main content
    // Try different selectors to find the main content
    const mainContent =
      document.querySelector("main")?.textContent?.trim() || "";
    const articleContent =
      document.querySelector("article")?.textContent?.trim() || "";
    const content =
      mainContent || articleContent || document.body.textContent?.trim() || "";

    return {
      title,
      description: metaDescription,
      url,
      content: content.substring(0, 5000), // Limit content length to avoid token limits
    };
  };

  // Only render for admin users
  if (!session?.user?.isAdmin) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>

        {/* Expandable Menu */}
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">
                AI Marketing Assistant
              </h3>
              <p className="text-sm text-gray-300">
                Create and manage social posts
              </p>
            </div>

            {/* Connected Accounts */}
            <div className="p-4 border-b border-gray-700">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Connected Accounts
              </h4>
              {isLoading ? (
                <div className="animate-pulse flex space-x-2">
                  <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
                </div>
              ) : accounts.length === 0 ? (
                <p className="text-sm text-gray-400">No accounts connected</p>
              ) : (
                <div className="flex space-x-2">
                  {accounts.map((account) => {
                    const metadata = account.metadata as UserMetadata;
                    const username = metadata?.username;
                    return (
                      <div
                        key={account.id}
                        className="bg-gray-700 rounded-full p-2"
                        title={`${account.provider} - ${username || account.providerAccountId}`}
                      >
                        {account.provider === "twitter" ? (
                          <svg
                            className="w-4 h-4 text-blue-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2ZM8.09 18.74h-3v-9h3ZM6.59 8.48a1.56 1.56 0 1 1 0-3.12 1.57 1.57 0 1 1 0 3.12Zm12.32 10.26h-3v-4.83c0-1.21-.43-2-1.52-2A1.65 1.65 0 0 0 12.85 13a2 2 0 0 0-.1.73v5h-3v-9h3V11a3 3 0 0 1 2.71-1.5c2 0 3.45 1.29 3.45 4.06Z" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setIsOpen(false);
                }}
                disabled={accounts.length === 0}
                className="w-full bg-indigo-600 text-white rounded-md py-2 px-4 hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <span>Open Assistant</span>
              </button>
              {accounts.length === 0 && (
                <p className="mt-2 text-sm text-gray-400 text-center">
                  Connect social accounts to get started
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <AIMarketingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pageContext={pageContext}
        accounts={accounts}
        // Pass modal state and update function
        modalState={modalState}
        onModalStateChange={setModalState}
      />
    </>
  );
}
