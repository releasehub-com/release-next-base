import OpenAI from 'openai';

export class V9ComponentGenerator {
  private client: OpenAI;
  private systemMessage: string = `
    You are a React component generator. Your job is to generate React components using Shadcn UI, styled with Tailwind CSS, and incorporate Lucide icons where necessary. 
    Always use functional components and include any necessary imports for Tailwind CSS, Shadcn UI components, and Lucide icons.
  `;
  private model: string;
  private basePrompt: string = `
  INSTRUCTIONS:
    Generate a React component using Shadcn UI, styled with Tailwind CSS, and incorporate Lucide icons where necessary.
    Always use 'export default function' for the generatoed components.
    Try to name the component based on the context provided in the prompt.
    Component names like HomeButtton, ProfileCard, etc. are preferred.
    If data is needed for the component, generate it as well.
    Include any necessary imports for Shadcn UI components, and Lucide icons.
    Do not include unnecessary imports like react only import things that the generated compnent needs.
    Shadcn/ui components like (Button, Card, Sheet) are located in @/components/ui
    Shadcn/ui components are always downcased like this @/components/ui/button.
    The generated components should always be valid tsx files.
    Consider the landing page sections and choose the appropriate components to generate.
    when creating tesimonials, use realisitic names and comments.
    DO NOT use names like John Doe, Jane Doe, Alice Johnson, etc.
    use real names like David McPherson, Sam Winters, etc.
    you can only have one default export in the generated component.
    ALWAYS REMEMBER TO CREATE A TOP LEVEL COMPONENT IF THE GENERATED COMPONENT IS A CHILD COMPONENT.
    TRY TO LIMIT THE NUMBER OF FILES GENERATED TO ONE.

  LANDING PAGE SECTIONS: { "landingPageSections": [ { "section": "Hero Section", "elements": ["Headline", "Subheadline", "CTA Button", "Visuals (images, video, or animation)"] }, { "section": "Features/Benefits", "elements": ["Highlight key features", "List user benefits"] }, { "section": "About Us", "elements": ["Brief company description", "Mission or vision statement"] }, { "section": "Product/Service Overview", "elements": ["Detailed explanation of product/service", "How it works (steps, process)"] }, { "section": "Social Proof", "elements": ["Customer testimonials", "Case studies", "User reviews or ratings", "Logos of clients or media mentions"] }, { "section": "Call-to-Action (CTA) Blocks", "elements": ["Clear, repeated CTAs throughout the page"] }, { "section": "Pricing Plans", "elements": ["Different pricing tiers", "Breakdown of features for each tier"] }, { "section": "Frequently Asked Questions (FAQs)", "elements": ["Common questions and answers"] }, { "section": "Demo/Trial Offer Section", "elements": ["Invitation to try demo or free trial", "CTA to sign up or get started"] }, { "section": "Contact Form/Lead Capture", "elements": ["Email signup", "Contact form for inquiries"] }, { "section": "Newsletter Signup", "elements": ["Subscription to newsletter"] }, { "section": "Blog/Resources", "elements": ["Links to valuable content, blog posts, or resources"] }, { "section": "Footer", "elements": ["Links to important pages (Privacy Policy, Terms of Service, etc.)", "Social media icons", "Contact information"] } ] }
  `;

  constructor(apiKey?: string, model: string = 'gpt-4o') {
    this.client = new OpenAI({ apiKey: apiKey || process.env['OPENAI_API_KEY'] });
    this.model = model;
  }

  async generateComponent(prompt: string): Promise<string> {
    try {
      const params: OpenAI.Chat.ChatCompletionCreateParams = {
        model: this.model,
        messages: [
          { role: 'system', content: this.systemMessage },
          { role: 'user', content: `${this.basePrompt} USER PROMPT: ${prompt}` },
        ],
      };

      const chatCompletion = await this.client.chat.completions.create(params);
      const generatedComponent = (chatCompletion?.choices[0]?.message?.content ?? "").trim();

      if (!generatedComponent) {
        throw new Error('No component generated.');
      }

      return generatedComponent;
    } catch (error) {
      console.error('Error generating component:', error);
      throw new Error('Failed to generate component');
    }
  }
}
