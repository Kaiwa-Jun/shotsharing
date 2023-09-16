FirebaseIdToken.configure do |config|
  config.redis = Redis.new(url: ENV['REDIS_URL'], ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE })
  config.project_ids = [Rails.application.secrets.firebase_project_id]
end

# Update Google's certificates
FirebaseIdToken::Certificates.request
