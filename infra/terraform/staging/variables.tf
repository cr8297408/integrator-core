variable "aws_account" {
  description = "aws account id number"
}

variable "aws_region" {
  description = "name region into aws"
}

variable "api_stage" {
  description = "name stage api gateway"
  default     = "v1"
}
