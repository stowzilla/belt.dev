module ApiControllers
  class MessagesController < ApplicationController
    before_action :set_conversation

    # GET /conversations/:conversation_id/messages
    def index
      @messages = @conversation.messages
    end

    private

    def set_conversation
      @conversation = Conversation.find(params[:conversation_id])
    end
  end
end
