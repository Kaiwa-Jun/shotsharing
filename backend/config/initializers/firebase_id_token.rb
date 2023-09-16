FirebaseIdToken.configure do |config|
  config.redis = Redis.new(url: ENV['REDIS_URL'])
  config.project_ids = [Rails.application.secrets.firebase_project_id]
end

# Update Google's certificates
FirebaseIdToken::Certificates.request
