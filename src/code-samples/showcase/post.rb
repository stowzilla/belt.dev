class Post < ActiveItem::Base
  self.primary_key = :id

  attr_accessor :id, :user_id, :title, :body

  validates :title, presence: true
  before_create { self.id ||= SecureRandom.uuid }
end
