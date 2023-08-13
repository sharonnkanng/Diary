import React, { useRef, useState } from "react";

interface DiaryEditorProps {
    onCreate: (author: string, content: string, emotion: number) => void;
  }

const emotionDict: {[key:number]: string} = {
    1: "😫",
    2: "😑",
    3: "🙂",
    4: "😚",
    5: "😍"
}

const DiaryEditor: React.FC<DiaryEditorProps> = ({ onCreate }) =>{

  //mutable reference object가 variable 에 담김
  const authorInput = useRef<HTMLInputElement>(null);
  const contentInput = useRef<HTMLTextAreaElement>(null);

  const [state, setState] = useState({
    author: "",
    content: "",
    emotion: 3,
  });

  const handleEventState = (e: React.FormEvent<HTMLTextAreaElement|HTMLSelectElement|HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    const newName = e.currentTarget.name;
    setState({
      // state를 앞에 적어야 나중에 새로운 input으로 덮어쓸 수 있음
      ...state,
      [newName]: newValue,
    });
  };

  const handleSubmit = () => {
    if (state.author.length < 1) {
      // alert보다는 focus! 이게 더 trendy함
      // 현재 가리키는 값 current
      authorInput.current?.focus();
      // return 해서 더 이상 process 하지 않도록 방지
      return;
    }
    if (state.content.length < 5) {
    contentInput.current?.focus();
      return;
    }

    onCreate(state.author, state.content, state.emotion);
    setState({
      author: "",
      content: "",
      emotion: 3,
    });

    console.log(state);
    alert("Successfully Submitted!");
  };

  return (
    <div className="DiaryEditor">
      <h2>Diary for Today</h2>
      <div>
        <input
          ref={authorInput}
          name="author"
          value={state.author}
          onChange={handleEventState}
        /> 
      </div>
      <div>
        <textarea
          ref={contentInput}
          name="content"
          value={state.content}
          onChange={handleEventState}
        />
      </div>
      <div>
        <span> Feeling Score of the day : </span>
        <select
          name="emotion"
          value={state.emotion}
          onChange={handleEventState}
        >
          {Object.keys(emotionDict).map((key) => (
            <option key={key} value={key}>
            {emotionDict[parseInt(key)]} {/* Display emoji string */}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default React.memo(DiaryEditor);