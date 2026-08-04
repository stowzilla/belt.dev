# frozen_string_literal: true

class Message < ApplicationRecord
  belongs_to :conversation

  validates :role, presence: true, inclusion: { in: %w[user assistant] }
  validates :body, presence: true

  attr_accessor :role, :body, :sent_at
end
