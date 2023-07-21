class Api::V1::PhotoCommentsController < ApplicationController
  def index
    comments = Comment.where(photo_id: params[:photo_id])
    render json: comments
  end
end