# Generate conversations (stores chat history)
$ belt generate scaffold conversation title last_message_at:datetime last_message
  create  lambda/models/conversation.rb
  create  lambda/controllers/api/conversations_controller.rb
  update  config/routes.rb
  update  config/contracts.rb
  update  infrastructure/modules/app/dynamodb.tf
  create  frontend/src/pages/conversations/ConversationsIndex.jsx
  create  frontend/src/pages/conversations/ConversationShow.jsx
  create  frontend/src/pages/conversations/ConversationNew.jsx
  create  frontend/src/pages/conversations/ConversationEdit.jsx
  create  frontend/src/pages/conversations/ConversationForm.jsx
  update  frontend/src/App.jsx

# Generate messages (user + AI messages)
$ belt generate scaffold message conversation:references role body sent_at:datetime
  create  lambda/models/message.rb
  create  lambda/controllers/api/messages_controller.rb
  update  config/routes.rb
  update  config/contracts.rb
  update  lambda/models/conversation.rb
  update  infrastructure/modules/app/dynamodb.tf
  create  frontend/src/pages/messages/MessagesIndex.jsx
  create  frontend/src/pages/messages/MessageShow.jsx
  create  frontend/src/pages/messages/MessageNew.jsx
  create  frontend/src/pages/messages/MessageEdit.jsx
  create  frontend/src/pages/messages/MessageForm.jsx
  update  frontend/src/App.jsx
