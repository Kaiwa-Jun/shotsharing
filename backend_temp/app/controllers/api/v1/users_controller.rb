require 'firebase_id_token'
module Api
  module V1
    class Api::V1::UsersController < ApplicationController
      before_action :authenticate

      def create
        @user = User.new(user_params)
        @user.provider = 'firebase'
        if @user.save
          render json: @user, status: :created
        else
          # バリデーションエラーをログに出力
          Rails.logger.debug @user.errors.inspect
          render json: @user.errors, status: :unprocessable_entity
        end
      end

      def update
        user = User.find_by(firebase_uid: params[:firebase_uid])
        if user
          user.display_name = params[:display_name] if params[:display_name]
          user.avatar_url = params[:avatar_url] if params[:avatar_url]
          if user.save
            render json: { message: 'User information updated successfully.' }, status: :ok
          else
            render json: { message: 'Failed to update user information.' }, status: :unprocessable_entity
          end
        else
          render json: { message: 'User not found.' }, status: :not_found
        end
      end

      private

      def user_params
        params.require(:user).permit(:firebase_uid, :display_name, :email, :avatar_url)
      end

      def authenticate
        # Get the ID token from the Authorization header
        auth_header = request.headers['Authorization']
        id_token = auth_header.split(' ').last if auth_header

        Rails.logger.debug "Authorization Header: #{auth_header}"

        begin
          FirebaseIdToken::Certificates.request
        rescue => e
          Rails.logger.debug "Certificates request failed with error: #{e.inspect}"
        end

        begin
          @decoded_token = FirebaseIdToken::Signature.verify(id_token)
        rescue => e
          Rails.logger.debug "Token verification failed with error: #{e.inspect}"
          @decoded_token = nil
        end

        Rails.logger.debug "Decoded token: #{@decoded_token.inspect}"

        unless @decoded_token
          render json: { message: '認証に失敗しました' }, status: :unauthorized
        end
      end
    end
  end
end
