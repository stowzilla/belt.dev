require 'aws-sdk-bedrockruntime'
require_relative 'application_controller'

module ApiControllers
  class CompletionsController < ApplicationController
    MODEL_ID = 'us.anthropic.claude-haiku-4-5-20251001-v1:0'

    # POST /completions
    def create
      conversation_id = params[:conversation_id]
      user_message = params[:message]

      # Save the user's message
      user_msg = Message.new(
        conversation_id: conversation_id,
        role: 'user',
        body: user_message,
        sent_at: Time.now.utc.iso8601
      )
      user_msg.save

      # Load conversation history for context
      history = Message.where(conversation_id: conversation_id)
                       .sort_by { |m| m.sent_at || m.created_at }
                       .last(20)

      # Build the Bedrock messages array
      messages = history.map do |msg|
        { role: msg.role, content: [{ text: msg.body }] }
      end

      # Call Bedrock's Converse API
      client = Aws::BedrockRuntime::Client.new(region: 'us-east-1')
      response = client.converse(
        model_id: MODEL_ID,
        messages: messages,
        system: [{ text: "You are a helpful AI assistant." }],
        inference_config: { max_tokens: 2048, temperature: 0.7 }
      )

      assistant_text = response.output.message.content.first.text

      # Save the AI response
      assistant_msg = Message.new(
        conversation_id: conversation_id,
        role: 'assistant',
        body: assistant_text,
        sent_at: Time.now.utc.iso8601
      )
      assistant_msg.save

      # Update conversation metadata
      conversation = Conversation.find_by(id: conversation_id)
      if conversation
        conversation.update(
          last_message_at: assistant_msg.sent_at,
          last_message: assistant_text&.slice(0, 100)
        )
      end

      success_response(
        assistant_message: assistant_msg.to_h
      )
    end
  end
end
