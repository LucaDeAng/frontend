import { MemStorage } from '../storage';
import articlesBackup from '../articles-backup.json';
import * as fs from 'fs/promises';
import { jest } from '@jest/globals';

jest.mock('fs/promises');
jest.mock('../../client/src/lib/markdown', () => ({
  extractFrontmatter: jest.fn(() => ({
    meta: {
      slug: 'test',
      title: '',
      date: '2024-01-01',
      summary: '',
      author: '',
      category: '',
      tags: []
    },
    content: ''
  }))
}));

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('getArticles filesystem interactions', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('reads articles from filesystem when directory exists', async () => {
    mockedFs.access.mockResolvedValue(undefined as any);
    mockedFs.readdir.mockResolvedValue(['test.md'] as any);
    mockedFs.readFile.mockResolvedValue('' as any);

    const storage = new MemStorage();
    const articles = await storage.getArticles();

    expect(mockedFs.readdir).toHaveBeenCalled();
    expect(articles[0].slug).toBe('test');
  });

  it('falls back to backup when directory is missing', async () => {
    mockedFs.access.mockRejectedValue(new Error('missing'));

    const storage = new MemStorage();
    const articles = await storage.getArticles();

    const expected = [...(articlesBackup as any)].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    expect(articles).toEqual(expected);
    expect(mockedFs.readdir).not.toHaveBeenCalled();
  });
});
