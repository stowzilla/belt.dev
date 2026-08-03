# frozen_string_literal: true

class Message < ApplicationRecord
  belongs_to :conversation

  attr_accessor :role, :body, :sent_at
end
