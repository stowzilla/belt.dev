module ApiControllers
  class MessagesController < ApplicationController
    # GET /messages?conversation_id=xxx
    def index
      if params[:conversation_id]
        messages = Message.where(conversation_id: params[:conversation_id])
      else
        messages = Message.all
      end
      success_response(messages: messages.map(&:to_h))
    end
  end
end
