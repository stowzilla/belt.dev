# frozen_string_literal: true

class Message < ApplicationRecord
  attr_accessor :role, :body, :sent_at

  belongs_to :conversation

  validates :role, presence: true, inclusion: { in: %w[user assistant] }
  validates :body, presence: true
end
