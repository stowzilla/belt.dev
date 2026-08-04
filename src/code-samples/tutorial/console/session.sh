# Open the console connected to your dev environment
$ belt console

Belt Console (dev)
Type 'reload!' to reload code.

# Create a conversation
irb> convo = Conversation.create!(title: "My first chat")
=> #<Conversation id: "abc123..." title: "My first chat" ...>

# Send a message and get an AI reply
irb> convo.reply("What is serverless computing?")
=> #<Message id: "def456..." role: "assistant" body: "Serverless computing is..." ...>

# Check the conversation history
irb> convo.messages.count
=> 2

irb> convo.messages.map { |m| [m.role, m.body[0..40]] }
=> [["user", "What is serverless computing?"], ["assistant", "Serverless computing is a cloud execution..."]]

# Validations in action
irb> convo.messages.create!(role: "hacker", body: "nope")
=> ActiveItem::RecordInvalid: Role is not included in the list
