class AddCommentCountToPhotos < ActiveRecord::Migration[6.1]
  def change
    add_column :photos, :comments_count, :integer, default: 0
  end
end
