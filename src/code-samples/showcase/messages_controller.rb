class MessagesController < ApplicationController
  before_action :set_conversation

  def index
    @messages = @conversation.messages
  end

  def create
    @assistant_reply = @conversation.reply(params[:body])
  end

  private

  def set_conversation
    @conversation = Conversation.find(params[:conversation_id])
  end
end
