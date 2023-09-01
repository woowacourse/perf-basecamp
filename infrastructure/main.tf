terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-2"
}

resource "aws_s3_bucket" "main" {
  bucket = "perf-basecamp-solo5star"
}

resource "aws_s3_bucket_public_access_block" "default" {
  bucket = aws_s3_bucket.main.id

  block_public_acls = false
  block_public_policy = false
  restrict_public_buckets = false
  ignore_public_acls = true
}

resource "aws_s3_bucket_policy" "default" {
  bucket = aws_s3_bucket.main.id
  depends_on = [aws_s3_bucket_public_access_block.default]
  policy = data.aws_iam_policy_document.default.json
}

data "aws_iam_policy_document" "default" {
  statement {
    sid = "Allow all HTTP from anywhere"
    effect = "Allow"
    principals {
      type = "AWS"
      identifiers = ["*"]
    }
    actions = [
      "s3:GetObject"
    ]
    resources = [
      "arn:aws:s3:::${aws_s3_bucket.main.id}/*"
    ]
  }
}

resource "aws_s3_bucket_website_configuration" "default" {
  bucket = aws_s3_bucket.main.id

  index_document {
    suffix = "index.html"
  }
}
