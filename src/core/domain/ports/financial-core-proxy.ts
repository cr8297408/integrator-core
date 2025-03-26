export interface FinancialCoreProxyPort{
    sendEventValidateProduct(price: number): Promise<boolean>;
}