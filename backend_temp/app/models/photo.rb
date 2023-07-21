class Photo < ApplicationRecord
  belongs_to :user
  has_one_attached :image
  after_save :attach_image_url
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :photo_categories
  has_many :categories, through: :photo_categories

  def attach_image_url
    self.update_column(:file_url, self.image.service_url) unless self.file_url.present?
  end

  def public_image_url
    self.image.service_url.sub(/\?.*/, "")
  end

  def image_url
    Rails.application.routes.url_helpers.rails_blob_url(image) if image.attached?
  end

end
