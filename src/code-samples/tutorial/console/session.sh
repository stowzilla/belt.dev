# Open the console connected to your dev environment
$ belt console dev

Belt Console (dev)
Type 'reload!' to reload code.

# Check what's in there
irb> Conversation.count
=> 0

# Create a conversation
irb> convo = Conversation.create!(title: "My first chat", last_message_at: Time.now.iso8601)
=> #<Conversation id: "abc123..." title: "My first chat" ...>

# Add a message
irb> Message.create!(conversation_id: convo.id, role: "user", body: "Hello!", sent_at: Time.now.iso8601)
=> #<Message id: "def456..." role: "user" body: "Hello!" ...>

# Query like ActiveRecord
irb> Message.where(conversation_id: convo.id).count
=> 1

irb> Conversation.first.messages
=> [#<Message id: "def456..." role: "user" body: "Hello!" ...>]

# Validations work too
irb> msg = Message.new(conversation_id: convo.id, body: "test")
irb> msg.valid?
=> false
irb> msg.errors.full_messages
=> ["Role is not included in the list"]
