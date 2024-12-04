import React, { useState, useEffect } from "react";

function Quotes() {
  const [quote, setQuote] = useState(
    "Never give up because you never know if the next try is going to be the one that works."
  );
  const [author, setAuthor] = useState("Mary Kay Ash");
  const [loading, setLoading] = useState(false);
  const synth = window.speechSynthesis;

  // Fetch a random quote on component mount
  useEffect(() => {
    randomQuote();
  }, []);

  // Fetch a random quote from the API
  const randomQuote = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://qapi.vercel.app/api/random");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result && result.quote && result.author) {
        setQuote(result.quote);
        setAuthor(result.author);
      } else {
        throw new Error("Unexpected API response structure.");
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
      setQuote("Failed to load quote.");
      setAuthor("Unknown");
    } finally {
      setLoading(false);
    }
  };

  // Speak the quote using SpeechSynthesis API
  const handleSpeech = () => {
    if (!loading && !synth.speaking) {
      const utterance = new SpeechSynthesisUtterance(`${quote} by ${author}`);
      synth.speak(utterance);
    }
  };

  // Copy the quote to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(`${quote} - ${author}`);
    alert("Quote copied to clipboard!");
  };

  // Share the quote on Twitter
  const handleTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `${quote} - ${author}`
    )}`;
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
            <li className="speech" onClick={handleSpeech}>
              <i className="bi bi-volume-up"></i> 
            </li>
            <li className="copy" onClick={handleCopy}>
              <i className="bi bi-clipboard"></i> 
            </li>
            <li className="twitter" onClick={handleTwitter}>
              <i className="bi bi-twitter"></i> 
            </li>
          </ul>
          <button
            className={`quote-btn ${loading ? "loading" : ""}`}
            onClick={randomQuote}
            disabled={loading}
          >
            {loading ? "Loading Quote..." : "New Quote"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quotes;
