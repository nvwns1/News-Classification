import { useEffect, useRef, useState } from "react";

import SendSVG from "../assets/svg/SendSVG";
import instance from "../utils/api";
import { URLS } from "../constants";

const Dashboard = () => {
  const [conversation, setConversation] = useState([]);
  const [newsValue, setNewsValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const endOfConversationRef = useRef(null);

  useEffect(() => {
    let isMounted = true; // flag to track if the component is mounted

    const fetchConversation = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`${URLS.CONVERSATION}/user`);
        const messages = response.data.data.messages;
        if (messages && isMounted) {
          setConversation(messages);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setHasFetched(true); // Mark as fetched
        setLoading(false);
      }
    };
    fetchConversation();
    return () => {
      isMounted = false; // Cleanup function to set the flag to false on unmount
    };
  }, []);

  useEffect(() => {
    if (conversation.length > 0) {
      endOfConversationRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  const handleSubmit = async () => {
    try {
      if (!newsValue) {
        throw new Error("Please enter a message");
      }
      setLoading(true);

      //    Add the user's input to the conversation
      const userMessage = {
        sender: "user",
        message: newsValue,
        type: "success",
      };
      setConversation((prev) => [...prev, userMessage]);

      //   Make API Call
      const response = await instance.post(`${URLS.NEWS}/classify`, {
        news: newsValue,
      });

      //   Add the response to the conversation
      const modelMessage = {
        sender: "SVM Model",
        message: response.data.data.prediction,
        type: "success",
      };
      setConversation((prev) => [...prev, modelMessage]);

      //   Save the conversation to the database
      await instance.post(`${URLS.CONVERSATION}/save`, {
        messages: [userMessage, modelMessage],
      });
    } catch (e) {
      console.log(e);
      let errMsg = e?.response ? e.response.data.msg : "Something went wrong";
      if (e.message === "Please enter a message") {
        errMsg = e.message;
      }
      const errorMessage = {
        sender: "SVM Model",
        message: errMsg,
        type: "error",
      };
      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setNewsValue("");
    }
  };

  return (
    <div className="p-4 h-[100%]">
      <div className="pb-28">
        {loading ? (
          <div className="text-center text-2xl font-bold">Loading...</div>
        ) : (
          <>
            {hasFetched && conversation.length === 0 ? (
              <div className="text-center text-2xl font-bold">
                Start a conversation
              </div>
            ) : (
              conversation.map((message, index) => (
                <div key={index}>
                  {/* Message of User or ai model*/}
                  <div
                    className={`chat ${
                      message.sender === "user" ? "chat-end" : "chat-start"
                    } `}
                  >
                    {message.sender !== "user" && (
                      <>
                        <div className="chat-image avatar">
                          <div className="w-10 rounded-full">
                            <img
                              alt="Tailwind CSS chat bubble component"
                              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            />
                          </div>
                        </div>
                        <div className="chat-header">{message.sender}</div>
                      </>
                    )}
                    <div
                      className={`chat-bubble ${
                        message.type === "error" ? "chat-bubble-error" : ""
                      }`}
                    >
                      {message.message}
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
      <div ref={endOfConversationRef} />

      {/* TextArea */}
      <div className="flex flex-col fixed bottom-2 left-0 right-0 p-4">
        <div className="flex w-full gap-2">
          <textarea
            value={newsValue}
            onChange={(e) => setNewsValue(e.target.value)}
            placeholder="Enter News here"
            className="textarea flex-1 w-full textarea-bordered resize-none focus:ring-2 "
          ></textarea>
          <kbd
            className="kbd kbd-lg flex-shrink-0"
            style={{ width: "80px", height: "80px" }}
            onClick={handleSubmit}
            aria-disabled={loading}
          >
            <SendSVG />
          </kbd>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
