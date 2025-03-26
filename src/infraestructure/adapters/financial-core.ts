import { Injectable, HttpException, InternalServerErrorException } from '@nestjs/common';
import { FinancialCoreProxyPort } from 'src/core/domain/ports/financial-core-proxy';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EnvironmentService } from '../environment';
import { AxiosError } from 'axios';
import { LoggerInstance } from '../shared/logger';

@Injectable()
export class FinancialCoreProxyAdapter implements FinancialCoreProxyPort {
  constructor(private readonly httpService: HttpService, private readonly environmentService: EnvironmentService) {}

  async sendEventValidateProduct(price: number): Promise<boolean> {

    const { FINANCIAL_CORE_LAMBDA_FUNCTION} = await this.environmentService.getConfig();

    try {
      const response = await firstValueFrom(
        this.httpService.post(
            FINANCIAL_CORE_LAMBDA_FUNCTION,
          { price: price },
          { headers: { 'Content-Type': 'application/json' } }
        )
      );

      if (response.data.message !== 'OK') {
        throw new HttpException('Product validation failed', 400);
      }

      LoggerInstance.info(`Response Financial Core: ${JSON.stringify(response.data)}`)

      return true;
    } catch (error) {
        console.log(error)
        if (error instanceof AxiosError) {
            const statusCode = error.response?.status || 500;
            const errorMessage = error.response?.data?.message || 'External validation service error';
            throw new HttpException(errorMessage, statusCode);
          } else {
            throw new InternalServerErrorException('Unexpected error during product validation');
          }
        }
    }
}
