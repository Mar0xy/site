import { useRef, useState, useEffect } from "react";
import Blog from "../components/blog";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import { Lines } from "../components/loading";

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(str, {
        language: lang,
        ignoreIllegals: true,
      }).value;
    }
    return "";
  },
});

const Message = ({ role, content, isLoading }) => {
  if (role === "user") {
    return (
      <div
        className="dark:bg-zinc-900 p-2"
        dangerouslySetInnerHTML={{
          __html: md.render(`○ ${content}`),
        }}
      ></div>
    );
  }
  if (isLoading) {
    return (
      <div className="dark:bg-zinc-900">
        <Lines />
      </div>
    );
  }
  return (
    <div
      className="dark:bg-zinc-800 py-4 prose-p:p-2 prose-p:my-0 prose-pre:px-6 prose-pre:my-0 prose-pre:break-words"
      dangerouslySetInnerHTML={{
        __html: md.render(`● ${content}`),
      }}
    ></div>
  );
};

const Chat = props => {
  const { q } = props;
  const [chat, setChat] = useState([]);
  const inputRef = useRef();
  const bottomRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
    (async function sendQ() {
      await send();
    })();
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleKeyDown = event => {
    if (event.keyCode === 13) {
      send();
    }
  };

  const send = async () => {
    const question = inputRef.current.value;
    if (question === "" || !question) {
      return;
    }
    chat.push({ role: "user", content: question });
    setChat([...chat]);
    inputRef.current.value = "";
    try {
      setIsLoading(true);
      await answer(question);
    } catch (error) {
      console.error(error);
    }
  };

  const answer = async question => {
    setChat([...chat]);
    const res = await fetch(process.env.NEXT_PUBLIC_CHAT_API, {
      method: "POST",
      body: JSON.stringify({
        messages: chat,
      }),
    });
    const result = await res.text();
    setIsLoading(false);
    chat.push({ role: "assistant", content: result });
    setChat([...chat]);
    inputRef.current.focus();
    const fly = await fetch(
      `${process.env.NEXT_PUBLIC_LOG_API}?message=${question}`
    );
    await fly.json();
  };

  const clear = () => {
    setChat([]);
  };

  return (
    <Blog
      noMeta
      noFooter
      title={`GPT Turbo ${q ? ": " + q : ""}`}
      description="Get instant answers, explanations, and examples for all of your questions."
    >
      {chat.map((messageObj, index) => {
        return (
          <Message
            content={messageObj.content}
            role={messageObj.role}
            key={index}
          />
        );
      })}
      {isLoading && <Message role={"assistant"} isLoading={true} />}
      <div ref={bottomRef} id="input" className="mt-20">
        <div className="flex">
          <input
            ref={inputRef}
            type="text"
            placeholder=""
            defaultValue={q}
            onKeyDown={handleKeyDown}
            className="h-12 pl-4 py-3 bg-zinc-100 flex-1 dark:bg-zinc-800 rounded-none outline-none"
          />
          <button
            className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-2xl"
            onClick={send}
          >
            ▲
          </button>
          {chat.length > 0 && (
            <button
              className="w-12 bg-zinc-100 dark:bg-zinc-800 text-2xl"
              onClick={clear}
            >
              ○
            </button>
          )}
        </div>
      </div>
    </Blog>
  );
};

export default Chat;

export async function getServerSideProps(context) {
  const { q } = context.query;
  if (q) {
    return {
      props: {
        q,
      },
    };
  } else {
    return {
      props: {},
    };
  }
}
