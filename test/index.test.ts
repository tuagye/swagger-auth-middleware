import { Request, Response, NextFunction } from 'express';
import createAuthMiddleware from '../src/index';
import { generatePasswordHash } from '../src/passwordUtils';

describe('Swagger Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  it('should call next() for valid credentials', async () => {
    const hashedPassword = await generatePasswordHash('password123');
    process.env.SWAGGER_USERS = JSON.stringify({ testuser: hashedPassword });

    const authMiddleware = createAuthMiddleware();

    mockRequest.headers = {
      authorization: 'Basic ' + Buffer.from('testuser:password123').toString('base64')
    };

    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 401 for invalid credentials', async () => {
    const hashedPassword = await generatePasswordHash('password123');
    process.env.SWAGGER_USERS = JSON.stringify({ testuser: hashedPassword });

    const authMiddleware = createAuthMiddleware();

    mockRequest.headers = {
      authorization: 'Basic ' + Buffer.from('testuser:wrongpassword').toString('base64')
    };

    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledWith('Invalid credentials');
  });

  it('should work with raw passwords when useRawPasswords is true', async () => {
    process.env.SWAGGER_USERS = JSON.stringify({ testuser: 'rawpassword123' });

    const authMiddleware = createAuthMiddleware({ useRawPasswords: true });

    mockRequest.headers = {
      authorization: 'Basic ' + Buffer.from('testuser:rawpassword123').toString('base64')
    };

    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });
});