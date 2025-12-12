import { useState, useEffect } from 'react';
import './App.css';
import topicsList from './data/topics.json'; // Initial lightweight list
import YouGlishWidget from './components/YouGlishWidget';

function App() {
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedVocab, setSelectedVocab] = useState(null);
  const [topicData, setTopicData] = useState(null); // Loaded async
  const [loading, setLoading] = useState(false);

  const availableTopics = topicsList.filter(t => t.hasContent);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleTopicClick = async (id) => {
    setSelectedTopicId(id);
    setIsMenuOpen(false);
    setSelectedVocab(null);
    setLoading(true);
    setTopicData(null);

    try {
      // Dynamic import of the JSON file
      // Note: Vite can analyze this if the path is static enough or using import.meta.glob
      // A simple import like this works if the file exists in src
      const data = await import(`./data/topics/${id}.json`);
      setTopicData(data.default);
    } catch (error) {
      console.error("Failed to load topic data", error);
    } finally {
      setLoading(false);
    }
  };

  const openConversation = (vocab) => {
    setSelectedVocab(vocab);
  };

  const closeConversation = () => {
    setSelectedVocab(null);
  };

  return (
    <div className="app-container">
      <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        {isMenuOpen ? '✕' : '☰'}
      </button>

      <aside className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <h2>Topics</h2>
        <ul className="topic-list">
          {availableTopics.map(topic => (
            <li
              key={topic.id}
              className={selectedTopicId === topic.id ? 'active' : ''}
              onClick={() => handleTopicClick(topic.id)}
            >
              {topic.title}
            </li>
          ))}
        </ul>
      </aside>
      <main className="content-area">
        {!selectedTopicId ? (
          <div className="placeholder">
            <h1>Welcome to English Web Show</h1>
            <p>Select a topic from the sidebar to start learning.</p>
          </div>
        ) : (
          <div className="topic-content">
            {loading ? (
              <div className="placeholder">
                <p>Loading topic...</p>
              </div>
            ) : topicData ? (
              <>
                <h1>{topicData.title}</h1>

                <section className="section">
                  <h2>Vocabulary (Click to practice)</h2>
                  {topicData.vocabulary.length === 0 ? (
                    <p>No vocabulary available for this topic yet.</p>
                  ) : (
                    <div className="vocab-list">
                      {topicData.vocabulary.map((vocab, index) => (
                        <div key={index} className="vocab-card" onClick={() => openConversation(vocab)}>
                          <div className="vocab-header">
                            <span className="word">{vocab.word}</span>
                            <span className="ipa">{vocab.ipa}</span>
                          </div>
                          <div className="vocab-body">
                            <span className="meaning">{vocab.meaning}</span>
                            <p className="example">"{vocab.example.en}"</p>
                            <p className="example">"{vocab.example.vi}"</p>
                          </div>
                          <div className="card-hint">Tap for Conversation</div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            ) : (
              <p>Error loading content.</p>
            )}
          </div>
        )}

        {/* Full Screen Conversation Modal */}
        {selectedVocab && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-button" onClick={closeConversation}>✕</button>

              <div className="modal-header">
                <h2>Conversation Practice</h2>
                <div className="focus-word-container">
                  <div className="fw-main">
                    <span className="fw-word">{selectedVocab.word}</span>
                    <span className="fw-ipa">{selectedVocab.ipa}</span>
                  </div>
                  <div className="fw-details">
                    <span className="fw-meaning">{selectedVocab.meaning}</span>
                    <p className="fw-example">"{selectedVocab.example.en}"</p>
                    <p className="fw-example">"{selectedVocab.example.vi}"</p>
                  </div>
                </div>
              </div>

              <div className="conversation-container">
                <div className="conversation">
                  {selectedVocab.conversation.map((item, index) => (
                    <div key={index} className={`conversation-item ${item.speaker === 'John' ? 'speaker-john' : 'speaker-sarah'}`}>
                      <div className="avatar-placeholder">{item.speaker[0]}</div>
                      <div className="bubble">
                        <p className="text-en">{item.en}</p>
                        <p className="text-vi">{item.vi}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedVocab.word && (
                  <YouGlishWidget word={selectedVocab.word} />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
