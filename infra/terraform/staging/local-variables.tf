locals {
  current_timestamp = timestamp()
  formatted_date    = formatdate("YYYYMMDD", local.current_timestamp)
  formatted_time    = formatdate("hhmm", local.current_timestamp)
  formatted_version = "1.0.${local.formatted_date}.${local.formatted_time}"
  # variables
  name            = "integrator-service-stack"
  environment     = "staging"
  aws_secret_name = "secret-${local.name}-${local.environment}"
  # definition
  aws_lambda_api_name    = "${local.name}-api-${local.environment}"
  aws_lambda_api_handler = "dist/index.handler"
  # resource
  aws_lambda_runtime = "nodejs18.x"
  aws_lambda_timeout = 60 * 2
  aws_lambda_memory  = 512
  # permissions
  aws_lambda_role_exec         = "arn:aws:iam::${var.aws_account}:role/XellExecutionRoleForLambda-${local.environment}"
  aws_lambda_permission_action = "lambda:InvokeFunction"
  aws_lambda_permission_source = "apigateway.amazonaws.com"
  # storage release
  aws_bucket_release_name = "services-releases-package-${local.environment}"
  release_name_zip        = "${local.name}-${local.environment}-${local.current_timestamp}.zip"
}
