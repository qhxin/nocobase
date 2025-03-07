import { Collection } from '../collection';
import { Database } from '../database';
import { updateAssociation, updateAssociations } from '../update-associations';
import { mockDatabase } from './';

describe('update associations', () => {

  describe('belongsTo', () => {
    let db: Database;
    beforeEach(() => {
      db = mockDatabase();
    });
    afterEach(async () => {
      await db.close();
    });
    it('post.user', async () => {
      const User = db.collection({
        name: 'users',
        fields: [{ type: 'string', name: 'name' }],
      });
      const Post = db.collection({
        name: 'posts',
        fields: [
          { type: 'string', name: 'name' },
          { type: 'belongsTo', name: 'user' },
        ],
      });
      await db.sync();
      const user = await User.model.create<any>({ name: 'user1' });
      const post1 = await Post.model.create({ name: 'post1' });
      await updateAssociations(post1, {
        user,
      });
      expect(post1.toJSON()).toMatchObject({
        id: 1,
        name: 'post1',
        userId: 1,
        user: {
          id: 1,
          name: 'user1',
        },
      });
      const post2 = await Post.model.create({ name: 'post2' });
      await updateAssociations(post2, {
        user: user.id,
      });
      expect(post2.toJSON()).toMatchObject({
        id: 2,
        name: 'post2',
        userId: 1,
      });
      const post3 = await Post.model.create({ name: 'post3' });
      await updateAssociations(post3, {
        user: {
          name: 'user3',
        },
      });
      expect(post3.toJSON()).toMatchObject({
        id: 3,
        name: 'post3',
        userId: 2,
        user: {
          id: 2,
          name: 'user3',
        },
      });
      const post4 = await Post.model.create({ name: 'post4' });
      await updateAssociations(post4, {
        user: {
          id: user.id,
          name: 'user4',
        },
      });
      expect(post4.toJSON()).toMatchObject({
        id: 4,
        name: 'post4',
        userId: 1,
        user: {
          id: 1,
          name: 'user1',
        },
      });
    });
  });

  describe('hasMany', () => {
    let db: Database;
    let User: Collection;
    let Post: Collection;
    beforeEach(async () => {
      db = mockDatabase();
      User = db.collection({
        name: 'users',
        fields: [
          { type: 'string', name: 'name' },
          { type: 'hasMany', name: 'posts' },
        ],
      });
      Post = db.collection({
        name: 'posts',
        fields: [
          { type: 'string', name: 'name' },
        ],
      });
      await db.sync();
    });
    afterEach(async () => {
      await db.close();
    });
    it('user.posts', async () => {
      const user1 = await User.model.create<any>({ name: 'user1' });
      await updateAssociations(user1, {
        posts: {
          name: 'post1',
        },
      });
      expect(user1.toJSON()).toMatchObject({
        name: 'user1',
        posts: [
          {
            name: 'post1',
            userId: user1.id,
          }
        ],
      });
    });
    it('user.posts', async () => {
      const user1 = await User.model.create<any>({ name: 'user1' });
      await updateAssociations(user1, {
        posts: [{
          name: 'post1',
        }],
      });
      expect(user1.toJSON()).toMatchObject({
        name: 'user1',
        posts: [
          {
            name: 'post1',
            userId: user1.id,
          }
        ],
      });
    });
    it('user.posts', async () => {
      const user1 = await User.model.create<any>({ name: 'user1' });
      const post1 = await Post.model.create<any>({ name: 'post1' });
      await updateAssociations(user1, {
        posts: post1.id,
      });
      expect(user1.toJSON()).toMatchObject({
        name: 'user1',
      });
      const post11 = await Post.model.findByPk(post1.id);
      expect(post11.toJSON()).toMatchObject({
        userId: user1.id,
      });
    });
    it('user.posts', async () => {
      const user1 = await User.model.create<any>({ name: 'user1' });
      const post1 = await Post.model.create<any>({ name: 'post1' });
      await updateAssociations(user1, {
        posts: post1,
      });
      console.log(JSON.stringify(user1, null, 2));
      expect(user1.toJSON()).toMatchObject({
        name: 'user1',
      });
      const post11 = await Post.model.findByPk(post1.id);
      expect(post11.toJSON()).toMatchObject({
        userId: user1.id,
      });
    });
    it('user.posts', async () => {
      const user1 = await User.model.create<any>({ name: 'user1' });
      const post1 = await Post.model.create<any>({ name: 'post1' });
      await updateAssociations(user1, {
        posts: {
          id: post1.id,
          name: 'post111',
        },
      });
      console.log(JSON.stringify(user1, null, 2));
      expect(user1.toJSON()).toMatchObject({
        name: 'user1',
      });
      const post11 = await Post.model.findByPk(post1.id);
      expect(post11.toJSON()).toMatchObject({
        userId: user1.id,
        name: 'post1',
      });
    });
    it('user.posts', async () => {
      const user1 = await User.model.create<any>({ name: 'user1' });
      const post1 = await Post.model.create<any>({ name: 'post1' });
      const post2 = await Post.model.create<any>({ name: 'post2' });
      const post3 = await Post.model.create<any>({ name: 'post3' });
      await updateAssociations(user1, {
        posts: [
          {
            id: post1.id,
            name: 'post111',
          },
          post2.id,
          post3,
        ]
      });
      console.log(JSON.stringify(user1, null, 2));
      expect(user1.toJSON()).toMatchObject({
        name: 'user1',
      });
      const post11 = await Post.model.findByPk(post1.id);
      expect(post11.toJSON()).toMatchObject({
        userId: user1.id,
        name: 'post1',
      });
      const post22 = await Post.model.findByPk(post2.id);
      expect(post22.toJSON()).toMatchObject({
        userId: user1.id,
        name: 'post2',
      });
      const post33 = await Post.model.findByPk(post3.id);
      expect(post33.toJSON()).toMatchObject({
        userId: user1.id,
        name: 'post3',
      });
    });
  });

  describe('nested', () => {
    let db: Database;
    let User: Collection;
    let Post: Collection;
    let Comment: Collection;

    beforeEach(async () => {
      db = mockDatabase();
      User = db.collection({
        name: 'users',
        fields: [
          { type: 'string', name: 'name' },
          { type: 'hasMany', name: 'posts' },
        ],
      });
      Post = db.collection({
        name: 'posts',
        fields: [
          { type: 'string', name: 'name' },
          { type: 'belongsTo', name: 'user' },
          { type: 'hasMany', name: 'comments' },
        ],
      });
      Comment = db.collection({
        name: 'comments',
        fields: [
          { type: 'string', name: 'name' },
          { type: 'belongsTo', name: 'post' },
        ],
      });
      await db.sync();
    });

    afterEach(async () => {
      await db.close();
    });

    it('nested', async () => {
      const user = await User.model.create<any>({ name: 'user1' });
      await updateAssociations(user, {
        posts: [
          {
            name: 'post1',
            comments: [
              {
                name: 'comment1',
              },
            ],
          },
        ],
      });
      const post1 = await Post.model.findOne({
        where: { name: 'post1' }
      });
      const comment1 = await Comment.model.findOne({
        where: { name: 'comment1' }
      });
      expect(post1).toMatchObject({
        userId: user.get('id'),
      });
      expect(comment1).toMatchObject({
        postId: post1.get('id'),
      });
    });
  });
});
