class CreatePhotos < ActiveRecord::Migration[6.1]
  def change
    create_table :photos do |t|
      t.references :user, null: false, foreign_key: true
      t.string :file_url
      t.integer :iso
      t.decimal :shutter_speed
      t.decimal :f_value
      t.string :camera_model
      t.decimal :latitude
      t.decimal :longitude
      t.boolean :location_enabled
      t.datetime :taken_at

      t.timestamps
    end
  end
end
