# frozen_string_literal: true

class Conversation < ApplicationRecord
  has_many :messages

  attr_accessor :title, :last_message_at, :last_message
end
