/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { type HttpService } from '@nestjs/axios';
import { InternalServerErrorException, HttpException } from '@nestjs/common';
import { type AxiosResponse, type AxiosError } from 'axios';
import { of, throwError } from 'rxjs';
import { type EnvironmentService } from '../../environment';
import { FinancialCoreProxyAdapter } from '../financial-core';

describe('FinancialCoreProxyAdapter', () => {
  let httpService: jest.Mocked<HttpService>;
  let environmentService: jest.Mocked<EnvironmentService>;
  let proxy: FinancialCoreProxyAdapter;

  const mockConfig = {
    FINANCIAL_CORE_LAMBDA_FUNCTION: 'https://api.example.com/validate'
  };

  beforeEach(() => {
    httpService = {
      post: jest.fn()
    } as unknown as jest.Mocked<HttpService>;

    environmentService = {
      getConfig: jest.fn().mockResolvedValue(mockConfig)
    } as unknown as jest.Mocked<EnvironmentService>;

    proxy = new FinancialCoreProxyAdapter(
      httpService,
      environmentService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEventValidateProduct', () => {
    const mockPrice = 99.99;

    test('should return true for successful validation', async () => {
      // Mock successful response
      const mockResponse: AxiosResponse = {
        data: { message: 'OK' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      httpService.post.mockReturnValueOnce(of(mockResponse));

      const result = await proxy.sendEventValidateProduct(mockPrice);

      expect(result).toBe(true);
      expect(httpService.post).toHaveBeenCalledWith(
        mockConfig.FINANCIAL_CORE_LAMBDA_FUNCTION,
        { price: mockPrice },
        { headers: { 'Content-Type': 'application/json' } }
      );
    });

    test('should throw HttpException for non-OK response', async () => {
      const mockResponse: AxiosResponse = {
        data: { message: 'Invalid price' },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any
      };

      httpService.post.mockReturnValueOnce(of(mockResponse));

      await expect(proxy.sendEventValidateProduct(mockPrice))
        .rejects.toThrow(HttpException);
    });

    test('should handle Axios errors with response', async () => {
      const error = {
        response: {
          status: 503,
          data: { message: 'Service Unavailable' }
        }
      } as AxiosError;

      httpService.post.mockReturnValueOnce(throwError(() => error));

      await expect(proxy.sendEventValidateProduct(mockPrice))
        .rejects.toThrow(HttpException);
    });

    test('should handle Axios errors without response', async () => {
      const error = {
        message: 'Network Error'
      } as AxiosError;

      httpService.post.mockReturnValueOnce(throwError(() => error));

      await expect(proxy.sendEventValidateProduct(mockPrice))
        .rejects.toThrow(InternalServerErrorException);
    });

    test('should handle generic errors', async () => {
      httpService.post.mockReturnValueOnce(throwError(() => new Error('Unexpected error')));

      await expect(proxy.sendEventValidateProduct(mockPrice))
        .rejects.toThrow(InternalServerErrorException);
    });

    test('should use configuration from environment service', async () => {
      const mockResponse: AxiosResponse = {
        data: { message: 'OK' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };

      httpService.post.mockReturnValueOnce(of(mockResponse));

      await proxy.sendEventValidateProduct(mockPrice);

      expect(environmentService.getConfig).toHaveBeenCalled();
    });
  });
});