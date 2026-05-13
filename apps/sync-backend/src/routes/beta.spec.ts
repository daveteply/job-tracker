import Fastify from 'fastify';

import betaRoutes from './beta';

describe('Beta Routes', () => {
  let server: any;
  let mockPrisma: any;

  beforeEach(async () => {
    mockPrisma = {
      betaApplication: {
        upsert: jest.fn(),
      },
      betaToken: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn((promises) => Promise.all(promises)),
    };

    server = Fastify();
    server.decorate('prisma', mockPrisma);
    server.register(betaRoutes);
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('POST /apply', () => {
    it('should submit an application', async () => {
      mockPrisma.betaApplication.upsert.mockResolvedValue({});

      const response = await server.inject({
        method: 'POST',
        url: '/apply',
        body: { email: 'test@example.com', name: 'Test' },
      });

      expect(response.statusCode).toBe(200);
      expect(mockPrisma.betaApplication.upsert).toHaveBeenCalled();
    });
  });

  describe('POST /validate', () => {
    it('should validate a valid token', async () => {
      const mockToken = {
        id: 't1',
        token: 'VALID',
        uses: 0,
        maxUses: 10,
        expiresAt: null,
      };
      mockPrisma.betaToken.findUnique.mockResolvedValue(mockToken);
      mockPrisma.betaToken.update.mockResolvedValue({});
      mockPrisma.betaApplication.upsert.mockResolvedValue({});

      const response = await server.inject({
        method: 'POST',
        url: '/validate',
        body: { token: 'VALID', email: 'test@example.com' },
      });

      expect(response.statusCode).toBe(200);
      expect(mockPrisma.betaToken.update).toHaveBeenCalled();
    });

    it('should return 400 for invalid token', async () => {
      mockPrisma.betaToken.findUnique.mockResolvedValue(null);

      const response = await server.inject({
        method: 'POST',
        url: '/validate',
        body: { token: 'INVALID', email: 'test@example.com' },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).error).toBe('invalidCode');
    });

    it('should return 400 for expired token', async () => {
      const mockToken = {
        id: 't1',
        token: 'EXPIRED',
        uses: 0,
        maxUses: 10,
        expiresAt: new Date(Date.now() - 1000),
      };
      mockPrisma.betaToken.findUnique.mockResolvedValue(mockToken);

      const response = await server.inject({
        method: 'POST',
        url: '/validate',
        body: { token: 'EXPIRED', email: 'test@example.com' },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).error).toBe('expiredCode');
    });

    it('should return 400 for fully used token', async () => {
      const mockToken = {
        id: 't1',
        token: 'USED',
        uses: 10,
        maxUses: 10,
        expiresAt: null,
      };
      mockPrisma.betaToken.findUnique.mockResolvedValue(mockToken);

      const response = await server.inject({
        method: 'POST',
        url: '/validate',
        body: { token: 'USED', email: 'test@example.com' },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).error).toBe('usedCode');
    });
  });
});
