class AddExposureTimeToPhotos < ActiveRecord::Migration[6.1]
  def change
    add_column :photos, :exposure_time, :decimal
  end
end
