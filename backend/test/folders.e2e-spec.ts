import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('FoldersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/folders (GET)', () => {
    return request(app.getHttpServer())
      .get('/folders')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('folders');
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('page');
        expect(res.body).toHaveProperty('totalPages');
      });
  });

  it('/folders (POST)', () => {
    const createFolderDto = {
      name: 'Test Folder',
      description: 'Test Description',
      userId: 'test-user-id',
      status: 'pending',
    };

    return request(app.getHttpServer())
      .post('/folders')
      .send(createFolderDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe(createFolderDto.name);
        expect(res.body.userId).toBe(createFolderDto.userId);
      });
  });
});
