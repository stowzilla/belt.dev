require 'aws-sdk-bedrockruntime'
require_relative 'application_controller'

module ApiControllers
  class CompletionsController < ApplicationController
    # POST /completions
    def create
      conversation = Conversation.find(params[:conversation_id])
      assistant_msg = conversation.reply(params[:message])

      success_response(assistant_message: assistant_msg.to_h)
    end
  end
end
