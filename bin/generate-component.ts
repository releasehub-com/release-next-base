import 'dotenv/config';
import { V9ComponentGenerator } from '../lib/v9-component-generator';

// Usage
const componentGenerator = new V9ComponentGenerator(); // Uses the default 'gpt-4' model and environment API key

// const prompt = 'Create a button component with an icon using Shadcn UI and Tailwind CSS. Use the "Home" icon from Lucide.';
//const prompt = 'Create a landing page for Emerald Moving and Storage';
const prompt = 'Create a landing page for Ian\'s Pizza with a hero section, a menu section, and a contact section. Use a pizza icon for the logo.';
componentGenerator.generateComponent(prompt)
  .then((component: any) => {
    console.log('Generated Component:', component);
  })
  .catch((error: any) => {
    console.error('Error:', error);
  });
