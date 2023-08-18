import React, { useState, useEffect } from "react";

function Quotes() {
  const [quote, setQuote] = useState(
    "Never give up because you never know if the next try is going to be the one that works."
  );
  const [author, setAuthor] = useState("Mary Kay Ash");
  const [loading, setLoading] = useState(false);
  const synth = window.speechSynthesis;

  useEffect(() => {
    randomQuote();
  }, []);

  const randomQuote = () => {
    setLoading(true);
    fetch("https://api.quotable.io/random")
      .then((response) => response.json())
      .then((result) => {
        setQuote(result.content);
        setAuthor(result.author);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quote:", error);
        setLoading(false);
      });
  };

  const handleSpeech = () => {
    if (!loading) {
      const utterance = new SpeechSynthesisUtterance(`${quote} by ${author}`);
      synth.speak(utterance);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${quote} - ${author}`);
  };

  const handleTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(tweetUrl, "_blank");
  };

  return (
    <div className="wrapper">
      <header>Quote of the Day</header>
      <div className="content">
        <div className="quote-area">
          <i className="fas fa-quote-left"></i>
          <p className="quote">{quote}</p>
          <i className="fas fa-quote-right"></i>
        </div>
        <div className="author">
          <span>__</span>
          <span className="name">{author}</span>
        </div>
      </div>
      <div className="buttons">
        <div className="features">
          <ul>
            <li
              className={`speech ${synth.speaking ? "active" : ""}`}
              onClick={handleSpeech}
            >
              <i className="fas fa-volume-up"></i>
            </li>
            <li className="copy" onClick={handleCopy}>
              <i className="fas fa-copy"></i>
            </li>
            <li className="twitter" onClick={handleTwitter}>
              <i className="fab fa-twitter"></i>
            </li>
          </ul>
          <button
            className={`quote-btn ${loading ? "loading" : ""}`}
            onClick={randomQuote}
          >
            {loading ? "Loading Quote..." : "New Quote"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quotes;
