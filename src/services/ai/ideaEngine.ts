import { Note } from '../../packages/types';


function makeId(prefix = '') {
return prefix + Math.random().toString(36).slice(2, 9);
}


export function postProcessJournalTranscript(transcript: string): Note {
const now = new Date().toISOString();
const title = generateTitle(transcript);
const blocks = generateBlocks(transcript);
const tags = generateTags(transcript);
return {
id: makeId('note_'),
title,
blocks,
tags,
createdAt: now,
updatedAt: now,
source: 'voice',
draft: false
} as Note;
}


export function generateTitle(text: string) {
const firstSentence = text.split(/[\.\!\?]\s/)[0];
const words = firstSentence.split(/\s+/).slice(0, 8).join(' ');
return words.trim();
}


export function generateBlocks(text: string) {
const sentences = text.split(/(?<=[\.\!\?])\s+/).filter(Boolean);
return sentences.map((s, i) => ({ id: `b_${i}_${Date.now()}`, type: 'paragraph', content: s.trim(), order: i }));
}


export function generateTags(text: string) {
const candidates = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
const freq: Record<string, number> = {};
for (const c of candidates) freq[c] = (freq[c] || 0) + 1;
const sorted = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
return sorted.slice(0, 5);
}