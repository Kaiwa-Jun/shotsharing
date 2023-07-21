class CreatePhotoCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :photo_categories do |t|
      t.references :photo, null: false, foreign_key: true
      t.references :category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
