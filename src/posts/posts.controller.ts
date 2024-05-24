import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { Request } from 'express';
import { Post as UserPost } from './post.entity';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetAllPostsDto } from './dto/get-all-posts.dto';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from 'src/utils/aws-s3.service';
import { getFileValidator } from 'src/utils/validators/custom-file.validator';
import { Readable } from 'stream';
import { Response } from 'express';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly s3Service: AwsS3Service,
  ) {}

  @Get()
  @ApiQuery({ type: GetAllPostsDto })
  findAll(@Query() query: GetAllPostsDto): Promise<UserPost[]> {
    console.log(query);
    return this.postsService.getAllPosts(query);
  }

  @Get('/:id')
  findOne(@Param('id') id: number): Promise<UserPost> {
    return this.postsService.getPostBy('id', id);
  }
  @Get('/:id/picture')
  async findPicture(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<void> {
    const { file, fileName } = await this.postsService.getPictureByPostId(id);

    let streamF: Readable;
    if (file instanceof Readable) {
      streamF = file;
    } else {
      throw new Error('Failed to get readable stream from S3 object');
    }

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    streamF.pipe(res);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 201, description: 'The post successfully created.' })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
    @UploadedFile(getFileValidator())
    file: Express.Multer.File,
  ): Promise<UserPost> {
    return await this.postsService.createPost({
      ...createPostDto,
      userUuid: req.user['user_id'],
      file: {
        dataBuffer: file.buffer,
        fileName: file.originalname,
        mimeType: file.mimetype,
      },
    });
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ): Promise<UserPost> {
    return await this.postsService.updatePost({
      ...updatePostDto,
      userUuid: req.user['user_id'],
      id,
    });
  }

  @Delete('/:id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.postsService.deletePost(id);
  }

  // @Post('/upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(
  //   @UploadedFile(getFileValidator())
  //   file: Express.Multer.File,
  //   @Res() res: Response,
  // ) {
  //   await this.s3Service.uploadedFile(
  //     file.buffer,
  //     file.originalname,
  //     file.mimetype,
  //   );

  //   /// return file
  //   const fileDownloaded = await this.s3Service.getFile(file.originalname);

  //   let streamF: Readable;
  //   if (fileDownloaded.Body instanceof Readable) {
  //     streamF = fileDownloaded.Body;
  //   } else {
  //     throw new Error('Failed to get readable stream from S3 object');
  //   }

  //   res.setHeader(
  //     'Content-Disposition',
  //     `attachment; filename=${file.originalname}`,
  //   );
  //   res.setHeader('Content-Type', file.mimetype);

  //   // Pipe the file stream to the response
  //   streamF.pipe(res);
  // }
}
