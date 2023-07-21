class PhotoCategory < ApplicationRecord
  belongs_to :photo
  belongs_to :category
end
