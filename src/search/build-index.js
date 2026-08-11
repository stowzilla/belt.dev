/**
 * Build-time script to generate a search index from markdown docs.
 * Outputs a JSON file that the client loads for searching.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

const DOCS_DIR = join(import.meta.dirname, '../docs');
const OUTPUT_DIR = join(import.meta.dirname, '../../public');
const OUTPUT_FILE = join(OUTPUT_DIR, 'search-index.json');

const TOPICS = {
  routing: 'Routing',
  controllers: 'Controllers',
  models: 'Models',
  lambda_handler: 'Lambda Handler',
  observability: 'Observability',
  deployment: 'Deployment',
  generators: 'Generators',
  console: 'Console',
  backups: 'Backups',
  plugins: 'Plugins',
  structure: 'Project Structure',
};

function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/`[^`]+`/g, '') // remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text
    .replace(/[#*_~>|]/g, '') // remove markdown symbols
    .replace(/\|[^\n]+\|/g, '') // remove table rows
    .replace(/-{3,}/g, '') // remove hr
    .replace(/\n{2,}/g, '\n')
    .trim();
}

function extractSections(markdown, topic) {
  const sections = [];
  const lines = markdown.split('\n');
  let currentHeading = TOPICS[topic] || topic;
  let currentLevel = 1;
  let currentContent = [];
  let currentAnchor = '';

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      // Flush previous section
      if (currentContent.length > 0) {
        const text = stripMarkdown(currentContent.join('\n'));
        if (text.length > 20) {
          sections.push({
            topic,
            heading: currentHeading,
            anchor: currentAnchor,
            text: text.slice(0, 500),
          });
        }
      }
      currentLevel = headingMatch[1].length;
      currentHeading = headingMatch[2];
      currentAnchor = currentHeading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Flush last section
  if (currentContent.length > 0) {
    const text = stripMarkdown(currentContent.join('\n'));
    if (text.length > 20) {
      sections.push({
        topic,
        heading: currentHeading,
        anchor: currentAnchor,
        text: text.slice(0, 500),
      });
    }
  }

  return sections;
}

function buildIndex() {
  const files = readdirSync(DOCS_DIR).filter(f => f.endsWith('.md'));
  const allSections = [];

  for (const file of files) {
    const topic = basename(file, '.md');
    const content = readFileSync(join(DOCS_DIR, file), 'utf-8');
    const sections = extractSections(content, topic);
    allSections.push(...sections);
  }

  // Each section gets an ID for referencing
  const index = allSections.map((section, id) => ({
    id,
    ...section,
  }));

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
  console.log(`Search index built: ${index.length} sections from ${files.length} docs`);
}

buildIndex();
