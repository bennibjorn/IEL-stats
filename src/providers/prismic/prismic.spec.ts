import { Test, TestingModule } from '@nestjs/testing';
import { Prismic } from './prismic';

describe('Prismic', () => {
  let provider: Prismic;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Prismic],
    }).compile();

    provider = module.get<Prismic>(Prismic);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
