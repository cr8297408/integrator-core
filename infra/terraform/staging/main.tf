terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "xell-terraform-states"
    key    = "accounting_service_stack_beta/terraform.tfstate"
  }
}

provider "aws" {
  region = var.aws_region
}

resource "null_resource" "accounting-service-stack-build-push-docker-beta" {
  provisioner "local-exec" {
    command = "${path.module}/../image_build_push.sh"
    environment = {
      NODE_ENV        = local.environment
      IMAGE_VERSION   = local.formatted_version
      REPO_NAME       = "${local.name}-${local.environment}"
      AWS_REGION      = var.aws_region
      AWS_ACCOUNT     = var.aws_account
      SECRET_NAME_AWS = local.aws_secret_name
    }
  }

  triggers = {
    always_run = timestamp()
  }
}

resource "aws_lambda_function" "accounting_service_stack_lambda_beta" {
  depends_on    = [null_resource.accounting-service-stack-build-push-docker-beta]
  function_name = local.aws_lambda_api_name
  role          = local.aws_lambda_role_exec
  timeout       = local.aws_lambda_timeout
  memory_size   = local.aws_lambda_memory
  image_uri     = "${var.aws_account}.dkr.ecr.${var.aws_region}.amazonaws.com/${local.name}-${local.environment}:${local.formatted_version}"
  package_type  = "Image"

  tags = {
    name        = local.aws_lambda_api_name
    environment = local.environment
  }

  vpc_config {
    subnet_ids         = local.aws_network_subnet_ids
    security_group_ids = local.aws_network_security_ids
  }
}

resource "aws_lambda_permission" "accounting_service_stack_lambda_permission_beta" {
  statement_id  = "AllowApiGatewayInvoke"
  action        = local.aws_lambda_permission_action
  function_name = aws_lambda_function.accounting_service_stack_lambda_beta.function_name
  principal     = local.aws_lambda_permission_source
}
