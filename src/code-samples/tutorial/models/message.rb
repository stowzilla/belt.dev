# frozen_string_literal: true

class Message < ApplicationRecord
  belongs_to :conversation

  validates :role, presence: true, inclusion: { in: %w[user assistant] }
  validates :body, presence: true

  before_create :set_sent_at

  attr_accessor :role, :body, :sent_at

  private

  def set_sent_at
    self.sent_at ||= Time.now.utc.iso8601
  end
end
