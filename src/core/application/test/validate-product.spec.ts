import { type FinancialCoreProxyPort } from 'src/core/domain/ports/financial-core-proxy';
import { LoggerInstance } from '../../../infraestructure/shared/logger';
import { ValidateProductUseCase } from '../use-cases/validate-product';

describe('ValidateProductUseCase', () => {
  let productProxy: jest.Mocked<FinancialCoreProxyPort>;
  let useCase: ValidateProductUseCase;

  const mockPrice = 99.99;
  const mockValidationResult = true;

  beforeEach(() => {
    productProxy = {
      sendEventValidateProduct: jest.fn().mockResolvedValue(mockValidationResult),
    } as unknown as jest.Mocked<FinancialCoreProxyPort>;

    useCase = new ValidateProductUseCase(
      productProxy,
      LoggerInstance
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should validate product with correct price', async () => {
    const result = await useCase.execute(mockPrice);

    expect(productProxy.sendEventValidateProduct)
      .toHaveBeenCalledWith(mockPrice);
    expect(result).toBe(mockValidationResult);
  });

  test('should return different validation results', async () => {
    const falseValidation = false;
    productProxy.sendEventValidateProduct.mockResolvedValueOnce(false);

    const result = await useCase.execute(50.0);
    expect(result).toBe(falseValidation);
  });

  test('should propagate proxy errors', async () => {
    const mockError = new Error('Validation service unavailable');
    productProxy.sendEventValidateProduct.mockRejectedValueOnce(mockError);

    await expect(useCase.execute(mockPrice)).rejects.toThrow(mockError);
  });

  test('should handle zero price validation', async () => {
    await useCase.execute(0);
    expect(productProxy.sendEventValidateProduct).toHaveBeenCalledWith(0);
  });

  test('should handle negative price validation', async () => {
    await useCase.execute(-10.5);
    expect(productProxy.sendEventValidateProduct).toHaveBeenCalledWith(-10.5);
  });
});