require_relative 'application_controller'

module ApiControllers
  class CompletionsController < ApplicationController
    # POST /completions
    def create
      conversation = Conversation.find(params[:conversation_id])
      @assistant_reply = conversation.reply(params[:message])
    end
  end
end
