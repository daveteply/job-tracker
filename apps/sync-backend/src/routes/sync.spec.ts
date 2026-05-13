import Fastify from 'fastify';

import syncRoutes from './sync';

describe('Sync Routes', () => {
  let server: any;
  let mockPrisma: any;

  beforeEach(async () => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      betaApplication: {
        findUnique: jest.fn(),
      },
      syncEvent: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
      $transaction: jest.fn((promises) => Promise.all(promises)),
    };

    server = Fastify();
    server.decorate('prisma', mockPrisma);
    server.register(syncRoutes);
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('Authorization Hook', () => {
    it('should return 400 if X-User-Id is missing', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/pull',
        body: { collection: 'test' },
      });
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).error).toContain('X-User-Id');
    });

    it('should return 403 if user is not found and not approved', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.betaApplication.findUnique.mockResolvedValue(null);

      const response = await server.inject({
        method: 'POST',
        url: '/pull',
        headers: { 'x-user-id': 'u1' },
        body: { collection: 'test' },
      });
      expect(response.statusCode).toBe(403);
    });

    it('should handle race condition during auto-provisioning', async () => {
      const uid = 'u-race';
      mockPrisma.user.findUnique
        .mockResolvedValueOnce(null) // first check
        .mockResolvedValueOnce({ id: uid, isActive: true }); // second check after error
      mockPrisma.betaApplication.findUnique.mockResolvedValue({
        email: 'race@example.com',
        status: 'APPROVED',
      });
      mockPrisma.user.create.mockRejectedValue(new Error('Duplicate'));
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.syncEvent.findMany.mockResolvedValue([]);

      const response = await server.inject({
        method: 'POST',
        url: '/pull',
        headers: { 'x-user-id': uid, 'x-user-email': 'race@example.com' },
        body: { collection: 'test' },
      });

      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(response.statusCode).toBe(200);
    });
  });

  describe('POST /pull', () => {
    it('should return documents and next checkpoint', async () => {
      const uid = 'u-pull';
      mockPrisma.user.findUnique.mockResolvedValue({ id: uid, isActive: true });
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.syncEvent.findMany.mockResolvedValue([
        { id: 'e1', serverTimestamp: BigInt(100), payload: { id: 'd1', foo: 'bar' } },
      ]);

      const response = await server.inject({
        method: 'POST',
        url: '/pull',
        headers: { 'x-user-id': uid },
        body: { collection: 'test', checkpoint: { serverTimestamp: '0', id: '' } },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.documents).toHaveLength(1);
      expect(body.checkpoint.serverTimestamp).toBe('100');
    });
  });

  describe('POST /push', () => {
    it('should create sync events', async () => {
      const uid = 'u-push';
      mockPrisma.user.findUnique.mockResolvedValue({ id: uid, isActive: true });
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.syncEvent.create.mockResolvedValue({});

      const response = await server.inject({
        method: 'POST',
        url: '/push',
        query: { collection: 'test' },
        headers: { 'x-user-id': uid },
        body: [{ newDocumentState: { id: 'd1', version: 1 } }],
      });

      expect(response.statusCode).toBe(200);
      expect(mockPrisma.syncEvent.create).toHaveBeenCalled();
    });

    it('should return 400 if collection is missing', async () => {
      const uid = 'u-push-fail';
      mockPrisma.user.findUnique.mockResolvedValue({ id: uid, isActive: true });
      mockPrisma.user.update.mockResolvedValue({});

      const response = await server.inject({
        method: 'POST',
        url: '/push',
        headers: { 'x-user-id': uid },
        body: [],
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
