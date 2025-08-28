export type UUID = string;


export type Block = {
id: UUID;
type: 'paragraph' | 'heading' | 'list' | 'todo' | 'code' | 'quote' | 'image' | 'embed';
content: string;
metadata?: Record<string, any>;
order: number;
};


export type Note = {
id: UUID;
title: string | null;
blocks: Block[];
tags: string[];
createdAt: string;
updatedAt: string;
source: 'voice' | 'manual' | 'ai';
draft?: boolean;
};