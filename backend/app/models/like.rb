class Like < ApplicationRecord
  belongs_to :user
  belongs_to :photo, counter_cache: :likes_count

  after_create_commit { LikeBroadcastJob.perform_later(self) }
  after_destroy_commit { LikeBroadcastJob.perform_later(self) }
end
