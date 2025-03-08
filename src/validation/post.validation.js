import { z } from 'zod';

const deletePosts = z.object({
  body: z.object({
    ids: z.array(z.string()),
  }),
});

const deletePost = z.object({
  body: z.object({
    id: z.string({ required_error: 'id is required' }),
  }),
});

const editPost = z.object({
  body: z.object({
    id: z.string({ required_error: 'id is required' }),
    url: z.string({ required_error: 'url is required' }).url(),
    thumbnail: z.string({ required_error: 'url is required' }),
  }),
});

const addPost = z.object({
  body: z.object({
    url: z.string({ required_error: 'url is required' }).url(),
    thumbnail: z.string({ required_error: 'url is required' }),
  }),
});

export const PostValidation = {
  deletePosts,
  deletePost,
  editPost,
  addPost,
};
