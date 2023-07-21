class AddJapaneseNameToCategories < ActiveRecord::Migration[6.1]
  def change
    add_column :categories, :japanese_name, :string
  end
end
