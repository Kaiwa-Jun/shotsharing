class Api::V1::SearchController < ApplicationController
  def index
    keyword = params[:keyword]
    @photos = Photo.joins(:categories).where("photos.file_url LIKE ? OR categories.name LIKE ? OR categories.japanese_name LIKE ?", "%#{keyword}%", "%#{keyword}%", "%#{keyword}%")
    render json: @photos.to_json(include: :categories)
  end
end
