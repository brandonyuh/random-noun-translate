import { useEffect, useState } from "react";
import "./Content.scss";
import Languages from "../../data/languages.json";
import CommonNouns from "../../data/CommonNouns.json";
import axios from "axios";

function Content() {
  const [randomNoun, setRandomNoun] = useState(CommonNouns[Math.floor(Math.random() * CommonNouns.length)]);
  const [currentLanguages, setCurrentLanguages] = useState(["Chinese Simplified", "Dutch"]);
  const [translations, setTranslations] = useState({});
  const [translation, setTranslation] = useState("");
  const getNewRandomNoun = () => {
    setRandomNoun(CommonNouns[Math.floor(Math.random() * CommonNouns.length)]);
  };
  const getTranslations = () => {
    currentLanguages.map((language) =>
      axios.get(`https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_GOOGLE_API_KEY}&q=the ${randomNoun}&target=${Languages[language]}&source=en`).then((response) => {
        translations[Languages[language]] = response.data.data.translations[0].translatedText;
        setTranslation(response.data.data.translations[0].translatedText);
      })
    );
  };

  useEffect(() => {
    getTranslations();
    return () => {};
  }, [randomNoun, currentLanguages]);

  return (
    <>
      <h1>Random Noun</h1>
      <div className="container">
        <div>
          <p>Made with React.js</p>
          <button onClick={getNewRandomNoun}>Get new random noun</button>
          <p>The {randomNoun}</p>
          <h2>Translate</h2>
          <ul>
            {currentLanguages.map((language) => (
              <li key={language}>{translations[Languages[language]]} : {language}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Languages to show</h2>
          <ul>
            {Object.keys(Languages).map((language) => (
              <li key={language}>
                <input
                  type="checkbox"
                  id={language}
                  name={language}
                  value={language}
                  checked={currentLanguages.includes(language)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCurrentLanguages([...currentLanguages, e.target.value]);
                    } else {
                      setCurrentLanguages(currentLanguages.filter((l) => l !== e.target.value));
                    }
                  }}
                />
                <label htmlFor={language}>{language}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Content;
