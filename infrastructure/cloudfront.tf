resource "aws_cloudfront_origin_access_control" "default" {
  name                              = "CloudFront S3 OAC"
  description                       = "CloudFront S3 OAC"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "default" {
  origin {
    domain_name = aws_s3_bucket.main.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.main.id

    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  http_version        = "http2and3"

  default_cache_behavior {
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = aws_s3_bucket.main.id
    compress                   = true
    cache_policy_id            = aws_cloudfront_cache_policy.assets.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.assets.id
    viewer_protocol_policy     = "redirect-to-https"
  }

  ordered_cache_behavior {
    path_pattern               = "/index.html"
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = aws_s3_bucket.main.id
    compress                   = true
    cache_policy_id            = aws_cloudfront_cache_policy.html.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.html.id
    viewer_protocol_policy     = "redirect-to-https"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_cloudfront_cache_policy" "assets" {
  name = "AssetsCachePolicy"

  default_ttl = 31536000 // 365d
  min_ttl     = 31536000 // 365d
  max_ttl     = 31536000 // 365d

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    cookies_config {
      cookie_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
  }
}

resource "aws_cloudfront_cache_policy" "html" {
  name = "HtmlCachePolicy"

  default_ttl = 1296000 // 15d
  min_ttl     = 1296000 // 15d
  max_ttl     = 2592000 // 30d

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    cookies_config {
      cookie_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
  }
}

resource "aws_cloudfront_response_headers_policy" "assets" {
  name    = "Assets"
  comment = "Response Headers for assets (includes images, js, css)"

  custom_headers_config {
    items {
      header   = "Cache-Control"
      override = true
      value = format(
        "immutable, max-age=%d",
        aws_cloudfront_cache_policy.assets.default_ttl
      )
    }
  }
}

resource "aws_cloudfront_response_headers_policy" "html" {
  name    = "Html"
  comment = "Response Headers for html"

  custom_headers_config {
    items {
      header   = "Cache-Control"
      override = true
      // max-age=1h, stale-while-revalidate=15d
      value = format(
        "max-age=3600, stale-while-revalidate=%d",
        aws_cloudfront_cache_policy.html.default_ttl
      )
    }
  }
}
