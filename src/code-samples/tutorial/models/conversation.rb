# frozen_string_literal: true

class Conversation < ApplicationRecord
  has_many :messages

  validates :title, presence: true

  attr_accessor :title, :last_message_at, :last_message

  # Add a user message and get an AI response via Bedrock
  def reply(user_message)
    messages.create!(role: 'user', body: user_message)

    assistant_text = ask_bedrock
    assistant_msg = messages.create!(role: 'assistant', body: assistant_text)

    update(last_message_at: assistant_msg.sent_at, last_message: assistant_text&.slice(0, 100))

    assistant_msg
  end

  # Build the message history in Bedrock's Converse API format
  def bedrock_messages(limit: 20)
    messages.to_a
            .sort_by { |m| m.sent_at || m.created_at }
            .last(limit)
            .map { |m| { role: m.role, content: [{ text: m.body }] } }
  end

  private

  def ask_bedrock
    client = Aws::BedrockRuntime::Client.new(region: 'us-east-1')
    response = client.converse(
      model_id: 'us.anthropic.claude-haiku-4-5-20251001-v1:0',
      messages: bedrock_messages,
      system: [{ text: 'You are a helpful AI assistant.' }],
      inference_config: { max_tokens: 2048, temperature: 0.7 }
    )
    response.output.message.content.first.text
  end
end
