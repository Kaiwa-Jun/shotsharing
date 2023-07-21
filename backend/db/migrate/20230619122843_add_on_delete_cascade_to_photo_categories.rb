class AddOnDeleteCascadeToPhotoCategories < ActiveRecord::Migration[6.1]
  def up
    remove_foreign_key :photo_categories, :photos
    add_foreign_key :photo_categories, :photos, on_delete: :cascade
  end

  def down
    remove_foreign_key :photo_categories, :photos
    add_foreign_key :photo_categories, :photos
  end
end
