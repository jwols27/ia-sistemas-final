import type { ModelMessage } from 'ai';
import { readFileSync } from 'fs';
import { join } from 'path';

export function loadDocs(): ModelMessage[] {
    const docsPath = join(process.cwd(), 'static', 'docs');

    try {
        const dados = readFileSync(join(docsPath, "base_conhecimento.md"), 'utf-8');
        const personalidade = readFileSync(join(docsPath, "personalidade.md"), 'utf-8');

        const response: ModelMessage[] = [dados, personalidade].map((content) => ({
            role: "system",
            content
        }));

        return response;
    } catch (error) {
        console.error('Error loading docs:', error);
        return [];
    }
}