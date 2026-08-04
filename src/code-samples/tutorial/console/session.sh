# Open the console connected to your dev environment
$ belt console dev

Belt Console (dev)
Type 'reload!' to reload code.

# Check what's in there
irb> Conversation.count
=> 0

# Create a conversation
irb> convo = Conversation.create!(title: "My first chat")
=> #<Conversation id: "abc123..." title: "My first chat" ...>

# Build a message through the association (foreign key set automatically)
irb> msg = convo.messages.build(role: "user", body: "Hello!", sent_at: Time.now.utc.iso8601)
irb> msg.conversation_id
=> "abc123..."
irb> msg.save!

# Or create in one step
irb> convo.messages.create!(role: "assistant", body: "Hi there!", sent_at: Time.now.utc.iso8601)
=> #<Message id: "def456..." role: "assistant" body: "Hi there!" ...>

# Query like ActiveRecord
irb> convo.messages.count
=> 2

# Validations in action
irb> convo.messages.create!(role: "hacker", body: "nope")
=> ActiveItem::RecordInvalid: Role is not included in the list

# Use the reply method (calls Bedrock under the hood)
irb> convo.reply("What is serverless computing?")
=> #<Message id: "ghi789..." role: "assistant" body: "Serverless computing is..." ...>
