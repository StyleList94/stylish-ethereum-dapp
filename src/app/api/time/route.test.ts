import { GET } from './route';

describe('api/time', () => {
  const anniversary = new Date('2017-04-25T09:34:56.789Z');

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(anniversary);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should return serverTime in ISO string format', async () => {
    const response = GET();
    expect(response).toBeInstanceOf(Response);

    const body = (await response.json()) as { serverTime: string };
    expect(body).toHaveProperty('serverTime');

    expect(body.serverTime).toMatch(/2017-04-25T09:34:56.789Z/);
  });
});
