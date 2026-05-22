import { tagApi } from '../api/tagApi';
import type { Tag } from '../types/tag.types';
import type { ErrorMsg } from '../types/error.types';
import { catchApiError } from './serviceHelpers';

/* ITAG SERVICE INTERFACE */
interface ITagService {
  getAll(): Promise<Tag[] | ErrorMsg>;
  create(name: string): Promise<Tag | ErrorMsg>;
  remove(id: number): Promise<void | ErrorMsg>;
}

/* TAG SERVICE */
class TagService implements ITagService {
  /* GET ALL */
  async getAll(): Promise<Tag[] | ErrorMsg> {
    try {
      const res = await tagApi.getAll();
      return res.data.data ?? [];
    } catch (error) {
      return catchApiError(error);
    }
  }

  /* CREATE */
  async create(name: string): Promise<Tag | ErrorMsg> {
    try {
      const res = await tagApi.create(name);
      return res.data.data as Tag;
    } catch (error) {
      return catchApiError(error);
    }
  }

  /* REMOVE */
  async remove(id: number): Promise<void | ErrorMsg> {
    try {
      await tagApi.remove(id);
    } catch (error) {
      return catchApiError(error);
    }
  }
}

export const tagService = new TagService();
