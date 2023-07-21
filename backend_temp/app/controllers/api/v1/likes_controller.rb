class Api::V1::LikesController < ApplicationController
  before_action :authenticate_user, only: [:show, :create, :destroy]
  before_action :set_photo, only: [:show, :destroy]
  before_action :set_like, only: [:show, :destroy]

  def index
    user = User.find_by(firebase_uid: params[:user_id])
    liked_photos = user.liked_photos
    render json: { photos: liked_photos }, status: :ok
  end

  def show
    likes_count = @photo.likes.size
    if @like
      render json: @like.attributes.merge({ liked: true, likes_count: likes_count })
    else
      render json: { liked: false, likes_count: likes_count }, status: :ok
    end
  end

  def create
    photo = Photo.find(params[:photo_id])
    like = photo.likes.find_or_initialize_by(user: current_user)
    if like.new_record?
      if like.save
        ActionCable.server.broadcast 'likes_channel', { photo_id: photo.id, likes_count: photo.likes.count }
        likes_count = photo.likes.count
        render json: like.attributes.merge({ likes_count: likes_count }), status: :created
      else
        render json: like.errors, status: :unprocessable_entity
      end
    else
      render json: { error: 'Like already exists' }, status: :unprocessable_entity
    end
  end

  def destroy
    if @like
      if @like.destroy
        ActionCable.server.broadcast 'likes_channel', { photo_id: @photo.id, likes_count: @photo.likes.count }
        likes_count = Like.where(photo_id: @photo.id).count
        render json: { success: true, likes_count: likes_count }, status: :ok
      else
        render json: { success: false, message: "Failed to delete like" }, status: :unprocessable_entity
      end
    else
      render json: { success: false, message: "Like not found" }, status: :not_found
    end
  end

  private

  def set_photo
    @photo = Photo.includes(:likes).find(params[:photo_id])
  end

  def set_like
    @like = @photo.likes.find_by(user_id: @current_user.id)
  end
end
