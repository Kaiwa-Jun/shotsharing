class Api::V1::CommentsController < ApplicationController
  before_action :authenticate_user, only: [:create, :destroy]
  after_action :update_comment_counts, only: [:create, :destroy]

  def index
    photo = Photo.includes(comments: :user).find(params[:photo_id])
    comments = photo.comments.map do |comment|
      comment.as_json.merge(user: comment.user.as_json)
    end
    render json: comments
  end


  def create
    @comment = Comment.new(comment_params)
    @comment.user_id = current_user.id

    if @comment.save
      render json: @comment, status: :created
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  def show
    comment = Comment.find(params[:id])
    render json: comment
  end

  private

  def update_comment_counts
    photo = Photo.find(params[:photo_id])
    photo.update(comments_count: photo.comments.count)
  end

  def comment_params
    params.require(:comment).permit(:photo_id, :content)
  end
end
