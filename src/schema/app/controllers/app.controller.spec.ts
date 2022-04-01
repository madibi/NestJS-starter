import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './../services/app.service';

describe('AppController', () => {
  let appController: AppController;

  const mockAppService = {
      ping: jest.fn(() => {
          return 'pong';
      })
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
          {
              provide: AppService,
              useValue: mockAppService
          },          
        ],
    })
    .overrideProvider(AppService).useValue(mockAppService)
    .compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('app controller', () => {
    it('ping should return pong', async () => {
      expect(appController.ping()).toBe('pong'); 
    });
  });
});