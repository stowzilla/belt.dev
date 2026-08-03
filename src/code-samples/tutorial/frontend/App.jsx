import { useState, useEffect, useRef } from 'react'
import { apiClient } from './lib/apiClient'
import './App.css'

function App() {
  const [conversations, setConversations] = useState([])
  const [activeConvId, setActiveConvId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const sendingRef = useRef(false)

  useEffect(() => { loadConversations() }, [])

  useEffect(() => {
    if (activeConvId && !sendingRef.current) loadMessages(activeConvId)
    else if (!activeConvId) setMessages([])
  }, [activeConvId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  async function loadConversations() {
    const data = await apiClient('/conversations')
    const convs = data.conversations || data
    setConversations(Array.isArray(convs) ? convs.sort((a, b) =>
      (b.updated_at || '').localeCompare(a.updated_at || '')) : [])
  }

  async function loadMessages(convId) {
    const data = await apiClient(`/messages?conversation_id=${convId}`)
    const msgs = data.messages || data
    setMessages(Array.isArray(msgs) ? msgs.sort((a, b) =>
      (a.sent_at || a.created_at || '').localeCompare(b.sent_at || b.created_at || '')) : [])
  }

  async function handleSend(e) {
    e.preventDefault()
    if (!input.trim() || thinking) return

    const userMessage = input.trim()
    setInput('')

    // Create conversation on first message
    let convId = activeConvId
    if (!convId) {
      sendingRef.current = true
      const data = await apiClient('/conversations', {
        method: 'POST', body: { title: userMessage.slice(0, 60) }
      })
      convId = data.conversation?.id || data.id
      setActiveConvId(convId)
      loadConversations()
    }

    // Optimistic UI — show user message immediately
    const tempId = `temp-${Date.now()}`
    setMessages(prev => [...prev, { id: tempId, role: 'user', body: userMessage }])
    setThinking(true)

    // Call completions → Bedrock → response
    const data = await apiClient('/completions', {
      method: 'POST',
      body: { conversation_id: convId, message: userMessage }
    })

    setMessages(prev => [...prev, data.assistant_message])
    setThinking(false)
    sendingRef.current = false
    loadConversations()
  }

  function handleNewChat() {
    setActiveConvId(null)
    setMessages([])
    inputRef.current?.focus()
  }

  return (
    <div className="chat-app">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={handleNewChat}>
            + New Chat
          </button>
        </div>
        <div className="conversation-list">
          {conversations.map(conv => (
            <div key={conv.id}
              className={`conversation-item ${conv.id === activeConvId ? 'active' : ''}`}
              onClick={() => setActiveConvId(conv.id)}>
              {conv.title || 'Untitled'}
            </div>
          ))}
        </div>
      </aside>

      <main className="chat-main">
        <div className="messages-container">
          {messages.length === 0 && !thinking && (
            <div className="empty-state">
              <h2>🤖 SpaceChat</h2>
              <p>Send a message to start a conversation</p>
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-body">{msg.body}</div>
            </div>
          ))}
          {thinking && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-body thinking">● ● ●</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-area" onSubmit={handleSend}>
          <textarea ref={inputRef} value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); handleSend(e)
              }
            }}
            placeholder="Send a message..." rows={1} disabled={thinking}
          />
          <button type="submit" disabled={!input.trim() || thinking}>↑</button>
        </form>
      </main>
    </div>
  )
}

export default App
