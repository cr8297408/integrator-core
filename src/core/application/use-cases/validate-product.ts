import { Injectable } from '@nestjs/common';
import { FinancialCoreProxyPort } from 'src/core/domain/ports/financial-core-proxy';
import { ILoggerPort } from 'src/core/domain/ports/logger';

@Injectable()
export class ValidateProductUseCase {
  constructor(
    private readonly productProxy: FinancialCoreProxyPort,
    private readonly logger: ILoggerPort
  ) {}

  async execute(price: number) {
    this.logger.info('Validating product');
    const validated = await this.productProxy.sendEventValidateProduct(price);
    this.logger.info('Product validated');
    return validated;
  }
}
