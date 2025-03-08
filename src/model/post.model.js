import { model, Schema } from 'mongoose';
import mongoosePlugin from 'mongoose-aggregate-paginate-v2';

const PostSchema = Schema(
  {
    url: {
      type: String,
      trim: true,
      required: [true, 'url is required'],
    },
    thumbnail: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      required: [true, 'thumbnail is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

PostSchema.plugin(mongoosePlugin);

const Post = model('Post', PostSchema);

export default Post;
