import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './post.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import {
  CreatePostPayload,
  GetAllPostsPayload,
  UpdatePostPayload,
  UploadedFile,
} from './types';
import { AwsS3Service } from 'src/utils//aws-s3.service';
import { StreamingBlobPayloadOutputTypes } from '@smithy/types';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly s3Service: AwsS3Service,
  ) {}

  async getAllPosts(payload: GetAllPostsPayload = {}): Promise<Post[]> {
    const queryBilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tags');

    if (payload.tags && payload.tags.length > 0) {
      // todo: must contain ALL tags or ANY tag?
      // solution below search for any requested tag
      const tagsSubquery = 'select id from tags where tags.name in (:...tags)';
      queryBilder.where(
        `post.id IN (select post_id from posts_tags where posts_tags.tag_id in (${tagsSubquery}))`,
        { tags: payload.tags },
      );
    }

    if (payload.userUuid) {
      queryBilder.where('post.userUuid = :userUuid', {
        userUuid: payload.userUuid,
      });
    }

    return await queryBilder.getMany();
  }

  async getPostBy(field: string, value: any): Promise<Post> {
    return await this.postRepository.findOne({ where: { [field]: value } });
  }

  async getPictureByPostId(
    postId: number,
  ): Promise<{ file: StreamingBlobPayloadOutputTypes; fileName: string }> {
    const post = await this.postRepository.findOneBy({ id: postId });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const key = this.getPostPhotoKey(postId, post.fileName);
    const file = await this.s3Service.getFile(key);
    return { file, fileName: post.fileName };
  }

  async createPost(payload: CreatePostPayload): Promise<Post> {
    const postTags = await this.createNewTags(payload.tags);

    const post = new Post();
    post.title = payload.title;
    post.description = payload.description;
    post.userUuid = payload.userUuid;
    post.fileName = payload.file.fileName;
    post.tags = [...postTags.new, ...postTags.existing];

    // TODO: transaction must be used here
    await this.tagRepository.save(postTags.new);
    await this.postRepository.save(post);
    await this.uploadFile(payload.file, post.id);

    return post;
  }

  private async uploadFile(file: UploadedFile, postId: number): Promise<void> {
    if (file) {
      const key = this.getPostPhotoKey(postId, file.fileName);
      await this.s3Service.uploadedFile(file.dataBuffer, key, file.mimeType);
    }
  }

  async updatePost(payload: UpdatePostPayload): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: {
        id: payload.id,
        userUuid: payload.userUuid,
      },
      relations: ['tags'],
    });

    if (!post) {
      // todo: catchable NotFound error
      throw new Error('Post not found');
    }

    if (payload.title) {
      post.title = payload.title;
    }

    if (payload.description) {
      post.description = payload.description;
    }

    if (payload.tags) {
      const tags = await this.createNewTags(payload.tags);
      post.tags = [...tags.new, ...tags.existing];
      await this.tagRepository.save(tags.new);
    }

    return await this.postRepository.save(post);
  }

  async deletePost(id: number): Promise<void> {
    await this.postRepository.delete({ id });
  }

  private async createNewTags(
    tagNames: string[],
  ): Promise<{ new: Tag[]; existing: Tag[] }> {
    const existingTags = await this.tagRepository.find({
      where: { name: In(tagNames) },
    });

    if (existingTags.length === tagNames.length) {
      return { new: [], existing: existingTags };
    }

    const newTags = [];

    tagNames.forEach((tagName) => {
      const existingTag = existingTags.find((tag) => tag.name === tagName);
      if (!existingTag) {
        const newTag = new Tag();
        newTag.name = tagName;
        newTags.push(newTag);
      }
    });

    return { new: newTags, existing: existingTags };
  }

  private getPostPhotoKey(postId: number, filename: string): string {
    return `${postId}filename=${filename}`;
  }

  private parsePostPhotoKey(key: string): { postId: number; filename: string } {
    const [postId, filename] = key.split('filename=');
    if (postId === undefined || filename === undefined) {
      throw new Error('Invalid key format');
    }
    return { postId: parseInt(postId), filename };
  }
}
