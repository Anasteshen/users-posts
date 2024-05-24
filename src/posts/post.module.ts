import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Post } from './post.entity';
import { AwsS3Service } from 'src/utils/aws-s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag])],
  controllers: [PostsController],
  providers: [PostsService, AwsS3Service],
})
export class PostModule {}
