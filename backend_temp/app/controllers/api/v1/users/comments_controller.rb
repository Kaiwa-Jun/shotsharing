class Api::V1::Users::CommentsController < ApplicationController
  before_action :authenticate_user, only: %i[create destroy]

  def index
    user = User.find_by!(firebase_uid: params[:user_id])
    comments = user.comments.includes(:photo).map do |comment|
      comment.as_json.merge(
        # photo: comment.photo.as_json(only: [:id, :iso, :shutter_speed, :f_value, :camera_model, :image_url, :likes_count, :taken_at, :created_at]),
        # photo: comment.photo.as_json(methods: :created_at),
        photo: comment.photo.as_json(only: [:id, :url, :created_at]),
        user: comment.user.as_json
      )
    end
    render json: comments
  end
end
