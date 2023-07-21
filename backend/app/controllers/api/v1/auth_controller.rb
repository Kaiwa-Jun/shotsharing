
  class Api::V1::AuthController < ApplicationController
    def verify_id_token
      id_token = params[:id_token]

      begin
        decoded_token = auth.verify_id_token(id_token)
        render json: { valid: true, uid: decoded_token['uid'] }, status: :ok
      rescue => e
        render json: { valid: false, error: e.message }, status: :unauthorized
      end
    end

    private

    def auth
      project_id = 'shotsharing-login'
      Google::Cloud::Firestore.new project_id: project_id
    end
  end

