import 'dotenv/config';

import * as fs from 'fs';
import * as path from 'path';
import simpleGit from 'simple-git';
import yaml from 'js-yaml';
import OpenAI from 'openai';
import * as toml from 'toml'; // To parse pyproject.toml files

// Initialize OpenAI API client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Initialize simple-git
const git = simpleGit();

// List of common files indicating different types of applications
const applicationFiles: { [key: string]: string[] } = {
    "Node.js": ["package.json"],
    "Rails": ["Gemfile", "database.yml"],
    "Python": ["requirements.txt", "Pipfile", "pyproject.toml", "environment.yml", "settings.py"],
    "PHP": ["composer.json"],
    "Java": ["pom.xml", "build.gradle", "build.gradle.kts"],
    "Docker": ["Dockerfile", "docker-compose.yml"],
    "README": ["README.md"],
    "Env": [".env"]
};

// Class to represent an application
class Application {
    type: string;
    paths: string[];
    framework: string | null;
    dependencies: Set<string>;
    dockerfilePath: string | null;
    needsDockerfile: boolean;

    constructor(type: string) {
        this.type = type;
        this.paths = [];
        this.framework = null;
        this.dependencies = new Set();
        this.dockerfilePath = null;
        this.needsDockerfile = false;
    }

    addPath(filePath: string) {
        this.paths.push(filePath);
    }

    setFramework(framework: string) {
        this.framework = framework;
    }

    addDependencies(dependencies: Set<string>) {
        dependencies.forEach(dep => this.dependencies.add(dep));
    }

    setDockerfileInfo(dockerfilePath: string | null, needsDockerfile: boolean) {
        this.dockerfilePath = dockerfilePath;
        this.needsDockerfile = needsDockerfile;
    }

    getFormattedDetails(): string {
        let details = `\n${this.type}:`;
        this.paths.forEach(path => (details += `\n - ${path}`));
        if (this.framework) details += `\n   Framework: ${this.framework}`;
        if (this.dependencies.size > 0) {
            details += `\n   Dependencies: ${Array.from(this.dependencies).join(', ')}`;
        }
        if (this.dockerfilePath) {
            details += `\n   Dockerfile: ${this.dockerfilePath}`;
        } else if (this.needsDockerfile) {
            details += `\n   Dockerfile: Needs generation`;
        }
        return details;
    }
}

// In-memory database to store applications
class InMemoryDatabase {
    private applications: { [key: string]: Application } = {};

    addApplication(type: string, filePath: string, framework: string | null = null) {
        if (!this.applications[type]) {
            this.applications[type] = new Application(type);
        }
        this.applications[type].addPath(filePath);
        if (framework) {
            this.applications[type].setFramework(framework);
        }
    }

    addDependencies(type: string, dependencies: Set<string>) {
        if (this.applications[type]) {
            this.applications[type].addDependencies(dependencies);
        }
    }

    setDockerfileInfo(type: string, dockerfilePath: string | null, needsDockerfile: boolean) {
        if (this.applications[type]) {
            this.applications[type].setDockerfileInfo(dockerfilePath, needsDockerfile);
        }
    }

    getApplicationsDetails(): string {
        return Object.values(this.applications)
            .map(app => app.getFormattedDetails())
            .join('\n');
    }
}

// Utility function to get files tracked by Git
async function getGitFiles(rootDir: string): Promise<string[]> {
    try {
        const result = await git.cwd(rootDir).raw(['ls-files']);
        return result.trim().split('\n');
    } catch (error) {
        console.error('Error getting files from git:', error);
        return [];
    }
}

// Detect application framework
function detectFramework(appType: string, filePath: string): string | null {
    const content = fs.readFileSync(filePath, 'utf-8');
    switch (appType) {
        case 'Node.js':
            return detectNodeFramework(content);
        case 'Rails':
            if (content.includes('rails')) return 'Rails';
            break;
        case 'Python':
            return detectPythonFramework(filePath, content);
        case 'PHP':
            return detectPHPFramework(content);
        case 'Java':
            return detectJavaFramework(filePath, content);
        case 'Docker':
            return detectDockerFramework(filePath, content);
    }
    return null;
}

function detectNodeFramework(content: string): string | null {
    const packageJson = JSON.parse(content);
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    if (dependencies['next']) return 'Next.js';
    if (dependencies['express']) return 'Express';
    if (dependencies['react']) return 'React';
    return 'Node.js (Generic)';
}

function detectPythonFramework(filePath: string, content: string): string | null {
    if (filePath.endsWith('requirements.txt') || filePath.endsWith('Pipfile')) {
        if (content.includes('flask')) return 'Flask';
        if (content.includes('django')) return 'Django';
        return 'Python (Generic)';
    } else if (filePath.endsWith('pyproject.toml')) {
        const parsedToml = toml.parse(content);
        const dependencies = parsedToml['tool']?.['poetry']?.['dependencies'];
        if (dependencies) {
            if (dependencies['flask']) return 'Flask';
            if (dependencies['django']) return 'Django';
        }
        return 'Python (Poetry)';
    } else if (filePath.endsWith('environment.yml')) {
        try {
            const doc = yaml.load(content) as any;
            const dependencies = doc?.dependencies || [];
            for (const dep of dependencies) {
                if (typeof dep === 'string') {
                    if (dep.includes('flask')) return 'Flask';
                    if (dep.includes('django')) return 'Django';
                }
            }
        } catch (e) {
            console.error(`Error parsing environment.yml: ${e}`);
        }
        return 'Python (Conda)';
    }
    return null;
}

function detectPHPFramework(content: string): string | null {
    const composerJson = JSON.parse(content);
    if (composerJson.require && composerJson.require['laravel/framework']) {
        return 'Laravel';
    }
    return 'PHP (Generic)';
}

function detectJavaFramework(filePath: string, content: string): string | null {
    if (filePath.endsWith('pom.xml')) {
        if (content.includes('<groupId>org.springframework.boot</groupId>')) return 'Spring Boot';
        if (content.includes('<groupId>javax</groupId>')) return 'Java EE';
        return 'Maven';
    } else if (filePath.endsWith('build.gradle') || filePath.endsWith('build.gradle.kts')) {
        if (content.includes('spring-boot-starter')) return 'Spring Boot';
        return 'Gradle';
    }
    return 'Java (Generic)';
}

function detectDockerFramework(filePath: string, content: string): string | null {
    if (filePath.endsWith('Dockerfile')) {
        if (content.includes('npm install')) return 'Node.js';
        if (content.includes('gem install rails')) return 'Rails';
        if (content.includes('pip install flask')) return 'Flask';
        if (content.includes('pip install django')) return 'Django';
        if (content.includes('mvn install')) return 'Maven (Java)';
        if (content.includes('gradle build')) return 'Gradle (Java)';
    } else if (filePath.endsWith('docker-compose.yml')) {
        try {
            const doc = yaml.load(content) as any;
            const services = doc?.services || {};
            for (const service in services) {
                const image = services[service]?.image || '';
                if (image.includes('node')) return 'Node.js';
                if (image.includes('rails')) return 'Rails';
                if (image.includes('flask')) return 'Flask';
                if (image.includes('django')) return 'Django';
                if (image.includes('java')) return 'Java';
            }
        } catch (e) {
            console.error(`Error parsing docker-compose.yml: ${e}`);
        }
    }
    return null;
}

// Detect dependencies from file content
function detectDependencies(filePath: string): Set<string> {
    const dependencies = new Set<string>();
    const content = fs.readFileSync(filePath, 'utf-8');

    const dependencyPatterns = {
        postgres: /postgres|pg_/i,
        mysql: /mysql/i,
        redis: /redis/i,
        memcached: /memcache/i,
        elasticsearch: /elasticsearch|elastic/i
    };

    for (const [dependency, pattern] of Object.entries(dependencyPatterns)) {
        if (pattern.test(content)) {
            dependencies.add(dependency);
        }
    }

    return dependencies;
}

// Detect Dockerfile and docker-compose.yml
function detectDockerfile(rootDir: string, appPaths: string[]): { dockerfilePath: string | null, needsDockerfile: boolean } {
    for (const appPath of appPaths) {
        let currentDir = path.dirname(appPath);

        // Check the current directory and parent directories for Dockerfile or docker-compose.yml
        while (currentDir !== rootDir && currentDir !== '/') {
            const dockerfilePath = path.join(currentDir, 'Dockerfile');
            const dockerComposePath = path.join(currentDir, 'docker-compose.yml');
            if (fs.existsSync(dockerfilePath)) {
                return { dockerfilePath, needsDockerfile: false };
            }
            if (fs.existsSync(dockerComposePath)) {
                return { dockerfilePath: dockerComposePath, needsDockerfile: false };
            }
            currentDir = path.dirname(currentDir);  // Move up to the parent directory
        }
    }

    // If no Dockerfile or docker-compose.yml was found, indicate that we need to generate one
    return { dockerfilePath: null, needsDockerfile: true };
}

// Find applications and populate the database
function findApplications(files: string[], rootDir: string, db: InMemoryDatabase) {
    for (const [appType, fileNames] of Object.entries(applicationFiles)) {
        fileNames.forEach(fileName => {
            files.forEach(filePath => {
                if (path.basename(filePath) === fileName) {
                    const fullPath = path.join(rootDir, filePath);

                    const detectedFramework = detectFramework(appType, fullPath);
                    db.addApplication(appType, fullPath, detectedFramework);

                    const dependencies = detectDependencies(fullPath);
                    db.addDependencies(appType, dependencies);

                    const { dockerfilePath, needsDockerfile } = detectDockerfile(rootDir, [fullPath]);
                    db.setDockerfileInfo(appType, dockerfilePath, needsDockerfile);
                }
            });
        });
    }
}

// Main function
async function main() {
    const repoDir = process.argv[2];

    if (!repoDir) {
        console.error('Please provide the path to the repository directory as an argument.');
        process.exit(1);
    }

    // Initialize in-memory database
    const db = new InMemoryDatabase();

    // Get the list of files tracked by Git using simple-git
    const gitFiles = await getGitFiles(repoDir);

    // Find applications and their dependencies, populating the database
    findApplications(gitFiles, repoDir, db);

    // Display discovered applications and their details
    console.log('Discovered applications:');
    console.log(db.getApplicationsDetails());
}

main();

