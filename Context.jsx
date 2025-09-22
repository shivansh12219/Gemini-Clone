import { createContext, useState } from "react";
import { runGemini } from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]); // store {prompt, response}
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };
  const newChat = () =>{
    setLoading(false)
    setShowResult(false)
  }

  const onSet = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    let response ="";
    let currentPrompt = prompt !== undefined ? prompt : input;

    try {
      response = await runGemini(currentPrompt);
      if (!response || typeof response !== "string") {
        throw new Error("Invalid Gemini response");
      }

      // formatting response
      let responseArray = response.split("**");
      let newResponse = "";
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<b>" + responseArray[i] + "</b>";
        }
      }
      let newResponse2 = newResponse.split("*").join("</br>");
      let newResponseArray = newResponse2.split(" ");

      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }

      // save to prevPrompts as {prompt, response}
      setPrevPrompts((prev) => [...prev, { prompt: currentPrompt, response: newResponse2 }]);
      setRecentPrompt(currentPrompt);

    } catch (err) {
      console.error("Gemini API error:", err);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  // when user clicks a previous prompt
  const showPrevPrompt = (item) => {
    setRecentPrompt(item.prompt);
    setResultData(item.response); // load stored response
    setShowResult(true);
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSet,
    showPrevPrompt,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;

