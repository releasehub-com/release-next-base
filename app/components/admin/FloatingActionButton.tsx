"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import type { SocialAccount } from "@/lib/db/schema";
import type {
  Platform,
  ModalState as MarketingModalState,
} from "./marketing-modal/types";
import AIMarketingModal from "./marketing-modal/AIMarketingModal";

interface ModalState extends Omit<MarketingModalState, "selectedPlatform"> {
  selectedPlatform: Platform | null;
}

interface UserMetadata {
  username?: string;
  [key: string]: unknown;
}

export default function FloatingActionButton() {
  const { data: session } = useSession();
  const pathname = usePathname();
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
      hackernews: [
        {
          role: "assistant",
          content: `Hi! I'm your AI marketing assistant. I can help you create a Hacker News title for this page.\n\nLet me know what kind of title you'd like to create.`,
        },
      ],
    },
    selectedPlatform: null,
    preview: {},
    editedPreviews: {
      twitter: "",
      linkedin: "",
      hackernews: "",
    },
    isPreviewMode: false,
    versions: {
      twitter: [],
      linkedin: [],
      hackernews: [],
    },
    imageAssets: {
      twitter: [],
      linkedin: [],
    },
  });

  // Add effect to track modal state
  useEffect(() => {
    console.log("isModalOpen changed to:", isModalOpen);
  }, [isModalOpen]);

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
            hackernews: [
              {
                role: "assistant",
                content: `Hi! I'm your AI marketing assistant. I can help you create a Hacker News title for this page:\n\n${newContext.title}\n\nLet me know what kind of title you'd like to create.`,
              },
            ],
          },
          selectedPlatform: (accounts[0]?.provider as Platform) || null,
          preview: {},
          editedPreviews: {
            twitter: "",
            linkedin: "",
            hackernews: "",
          },
          isPreviewMode: false,
          versions: {
            twitter: [],
            linkedin: [],
            hackernews: [],
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
        selectedPlatform: accounts[0].provider as Platform,
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

  // Only render for admin users and non-admin pages
  if (!session?.user?.isAdmin || pathname.startsWith("/admin")) {
    return null;
  }

  // Debug logging
  console.log("Rendering AIMarketingModal with props:", {
    isOpen: isModalOpen,
    accountsLength: accounts.length,
    pageContext,
    modalState,
  });

  return (
    <>
      <div
        className={`fixed right-0 bottom-8 z-50 ${isModalOpen ? "hidden" : ""}`}
      >
        {/* Main Button */}
        <button
          onClick={() => {
            console.log("Button clicked, setting isModalOpen to true");
            setIsModalOpen(true);
          }}
          className="bg-gray-800 text-white rounded-l-xl p-4 shadow-xl hover:bg-gray-700 transition-colors flex flex-col items-center gap-3 relative group border border-r-0 border-indigo-500/50"
          aria-label="Open AI Marketing Assistant"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-l-xl bg-gradient-to-r from-indigo-500/20 via-indigo-500/10 to-transparent" />
          <div className="absolute inset-0 rounded-l-xl shadow-[inset_0_0_15px_rgba(99,102,241,0.2)]" />

          <div className="flex flex-col gap-3 relative">
            {isLoading ? (
              <div className="animate-pulse flex flex-col gap-3">
                <div className="h-7 w-7 bg-gray-700/50 rounded-full"></div>
                <div className="h-7 w-7 bg-gray-700/50 rounded-full"></div>
              </div>
            ) : accounts.length === 0 ? (
              <div className="p-1.5 rounded-full bg-gray-700/50 backdrop-blur-sm">
                <svg
                  className="w-6 h-6 text-indigo-400"
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
              </div>
            ) : (
              accounts.map((account) => (
                <div
                  key={account.id}
                  className="p-1.5 rounded-full bg-gray-700/50 backdrop-blur-sm hover:bg-gray-700 transition-colors"
                  title={`${account.provider} - ${(account.metadata as UserMetadata)?.username || account.providerAccountId}`}
                >
                  {account.provider === "twitter" ? (
                    <svg
                      className="w-6 h-6 text-teal-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-teal-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2ZM8.09 18.74h-3v-9h3ZM6.59 8.48a1.56 1.56 0 1 1 0-3.12 1.57 1.57 0 1 1 0 3.12Zm12.32 10.26h-3v-4.83c0-1.21-.43-2-1.52-2A1.65 1.65 0 0 0 12.85 13a2 2 0 0 0-.1.73v5h-3v-9h3V11a3 3 0 0 1 2.71-1.5c2 0 3.45 1.29 3.45 4.06Z" />
                    </svg>
                  )}
                </div>
              ))
            )}
          </div>
          <svg
            className="w-5 h-5 text-indigo-500/70 mt-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <AIMarketingModal
        isOpen={isModalOpen}
        onClose={() => {
          console.log("Modal closing, setting isModalOpen to false");
          setIsModalOpen(false);
        }}
        pageContext={pageContext}
        accounts={accounts}
        modalState={modalState}
        onModalStateChange={setModalState}
      />

      {/* No accounts modal */}
      {isModalOpen && accounts.length === 0 && !isLoading && (
        <div className="fixed inset-y-0 right-0 bg-gray-900/95 border-l border-gray-600/20 shadow-xl z-50 flex flex-col transform transition-transform duration-300 w-full md:w-[400px] backdrop-blur-sm translate-x-0">
          <div className="flex items-center justify-between py-2 px-3 border-b border-gray-600/20 bg-gray-800/50">
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5" />
              <h2 className="text-sm font-medium text-gray-100">
                AI Assistant
              </h2>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-300 p-1 rounded-lg hover:bg-gray-700/50"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-gray-800/50 p-4 rounded-xl border border-indigo-500/20 mb-6">
              <svg
                className="w-12 h-12 text-indigo-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <h3 className="text-lg font-medium text-white mb-2">
                Connect Your Social Accounts
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                To start creating AI-powered social media posts, you'll need to
                connect your Twitter and LinkedIn accounts.
              </p>
              <a
                href="/admin/social"
                className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Connect Accounts
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
