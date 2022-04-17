import { TokenService } from './../../log/services/token.service';
import { ImageProcessorService } from './../../../services/image-processor/image-processor.service';
import { JwtService } from '@nestjs/jwt';
import { CachingService } from './../../../services/caching/caching.service';
import { SecurityService } from './security.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../repositories/user.repository';

describe('SecurityService', () => {
  let securityService: SecurityService;

  const mockUserRepository = {};
  const mockTokenService = {};
  const mockImageProcessorService = {
    createDifferentSizes: jest.fn().mockImplementation( () => {
      return null;
    }),              
  };
  const mockJwtService = {};
  const mockCachingService = {};

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockUserRepository,
        },
        TokenService,
        ImageProcessorService,
        JwtService,
        CachingService,
      ],
    })
      .overrideProvider(TokenService)
      .useValue(mockTokenService)
      .overrideProvider(ImageProcessorService)
      .useValue(mockImageProcessorService)
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .overrideProvider(CachingService)
      .useValue(mockCachingService)
      .compile();

    securityService = testingModule.get<SecurityService>(SecurityService);
  });

  // rid of error: 
  // A worker process has failed to exit gracefully and has been force exited. 
  // This is likely caused by tests leaking due to improper teardown.
  afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  it('should be defined', async () => {
    const _securityService = securityService;
    expect(_securityService).toBeDefined();
  });
});
