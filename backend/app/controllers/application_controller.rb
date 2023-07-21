class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  private

def authenticate_user
  header = request.headers['Authorization']
  header = header.split(' ').last if header
  decoded_token = decode(header)
  uid = decoded_token['user_id'] # Firebaseからのレスポンスに合わせてキーを修正
  @current_user = User.find_by!(firebase_uid: uid)
rescue => e
  logger.error "Error in authenticate_user: #{e.message}"
  render json: { error: 'Not Authorized' }, status: :unauthorized
end


  def decode(token)

    project_id = 'shotsharing-login'
    cert_url = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
    certs = JSON.load(URI.open(cert_url))
    logger.info "certs: #{certs}"
    decoded_token = nil
    certs.each do |kid, cert|
      logger.info "kid: #{kid}, cert: #{cert}"
      decoded_token = JWT.decode(token, OpenSSL::X509::Certificate.new(cert).public_key, true, { algorithm: 'RS256', iss: "https://securetoken.google.com/#{project_id}", verify_iss: true, aud: project_id, verify_aud: true, verify_iat: true }) rescue nil
      break if decoded_token
    end
    raise JWT::DecodeError unless decoded_token
    logger.info "decoded_token: #{decoded_token}"
    decoded_token.first
  end

end


# リクエストヘッダーからIDトークンを取り出し、Firebase SDKを使用してそのトークンを検証します。検証が成功すれば、そのトークンに含まれるユーザーID（Firebase UID）を元にcurrent_userを設定
