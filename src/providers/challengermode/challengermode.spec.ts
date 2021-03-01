import { Test, TestingModule } from '@nestjs/testing';
import { Challengermode } from './challengermode';

describe('Challengermode', () => {
  let provider: Challengermode;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Challengermode],
    }).compile();

    provider = module.get<Challengermode>(Challengermode);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
