declare module 'turndown' {
  interface TurndownService {
    turndown(html: string): string;
    use(plugin: any): void;
    addRule(key: string, rule: any): void;
  }
  
  interface TurndownConstructor {
    new (options?: {
      headingStyle?: 'setext' | 'atx';
      codeBlockStyle?: 'indented' | 'fenced';
    }): TurndownService;
  }
  
  const TurndownService: TurndownConstructor;
  export default TurndownService;
}

declare module 'turndown-plugin-gfm' {
  export const gfm: any;
} 