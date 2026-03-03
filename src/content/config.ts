import { defineCollection, z } from 'astro:content';

// ブログ記事のスキーマ定義
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.string().optional(),
    thumbnail: z.string().optional(),
    excerpt: z.string().optional(),
  }),
});

// 活動実績のスキーマ定義
const worksCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    thumbnail: z.string(),
    link: z.string().url(),
    description: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  works: worksCollection,
};
