class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :email, presence: true, if: :email_required?
  validates :email, uniqueness: { case_sensitive: false }, allow_blank: true, if: :email_changed?
  validates_format_of :email, with: Devise.email_regexp, allow_blank: true, if: :email_changed?

  validates :password, presence: true, if: :password_required?
  validates :password, confirmation: true, if: :password_required?
  validates :password, length: { within: Devise.password_length, allow_blank: true }

  has_many :photos
  has_many :likes, dependent: :destroy
  has_many :liked_photos, through: :likes, source: :photo
  has_many :comments

  private

  def password_required?
    provider.blank?
  end

  def email_required?
    true  # あなたの要件に応じて変更
  end
end
