import React,{ useCallback, useEffect, useMemo, useRef, useReducer } from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor.tsx";
import DiaryList from "./DiaryList";
// import OptimizeText from "./OptimazeTest";

enum DataActionKind {
  INIT = "INIT",
  CREATE = "CREATE",
  DELETE = "DELETE",
  EDIT = "EDIT",
}

// An interface for our actions
interface DataAction {
  type: string;
  payload: ProcessedComment[];
}

// An interface for our state
interface DataState {
  data: ProcessedComment[];
}


interface Comment {
  email: string;
  body: string;
}
interface ProcessedComment {
  author: string;
  content: string;
  emotion: number;
  created_time: number;
  id: number;
}

const diaryReducer = (state: DataState, action:DataAction) => {
  const { type, payload } = action;
  switch (type) {
    case DataActionKind.INIT:
      return payload;
    case DataActionKind.CREATE:
      return [action.payload, ...];
    case DataActionKind.DELETE:
      return state.filter((it) => it.id !== action.targetID);
    case DataActionKind.EDIT:
      return state.map((it) =>
        it.id === action.data.id ? { ...it, content: action.payload.content } : it
      );
    default:
      return state;
  }
}
function App() {

  // const [data, setData] = useState<ProcessedComment[]>([]);
  const [data, dispatch] = useReducer(diaryReducer, []);

  const getData = async (): Promise<void> => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/comments");
      const comments: Comment[] = await res.json();

      const initData: ProcessedComment[] = comments.slice(0, 20).map((comment) => {
        return {
          author: comment.email,
          content: comment.body,
          emotion: Math.floor(Math.random() * 5) + 1,
          created_time: new Date().getTime(),
          id: userID.current++, // Make sure userID.current is defined and incremented elsewhere
      };
    });

      dispatch({type:"INIT", payload: initData}); // Assuming setData function is available and handles setting data
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // dependency array에 있는 게 바뀌면 콜백 함수가 invoked됨
  useEffect(() => {
    getData();
  },[]);

  const userID = useRef(0);

  const onCreate = useCallback((author: string, content: string, emotion: number) => {
    const created_time = new Date().getTime();

    const newItem = {
      author,
      content,
      emotion,
      created_time,
      id: userID.current,
    };
    userID.current += 1;
    // setData에 함수 전달 : 함수형 업데이트
    
  },
  // 여기에 아무것도 안넣어주면 일기 추가 했을 때 빈 배열만 나타남,
  // 근데 data 넣어주면 일기 없어지면서 변화가 일어나서 다시 re-render됨
  []
  );

  const onDelete = useCallback((targetID: number) => {
    alert(`${targetID} has been deleted`);
    dispatch({type: "DELETE", data: targetID});
  }, []);

  //데이터는 항상 위에서 아래로 떨어짐. 그래서 onEdit을 DiaryItem 에서 써도 App.js에서 declare 해줘야 함
  const onEdit = useCallback((contentid: number, newContent: string) => {
    setData(
      (data) =>
      data.map((it) =>
        it.id === contentid ? { ...it, content: newContent } : it
      )
    );
  },[]);

  // useMemo는 callback 함수가 return 하는 값을 사용함
  const getDiaryAnalysis = useMemo (
    () => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return {goodCount, badCount, goodRatio};
  },[data.length]
  );

  const {goodCount, badCount, goodRatio} = getDiaryAnalysis;

  return (
    <div className="App">
    {/* <OptimizeText/> */}
      <DiaryEditor onCreate={onCreate} />
      <div>All diary : {data.length}</div>
      <div>Good diary : {goodCount}</div>
      <div>Bad diary : {badCount}</div>
      <div>Good diary Ratio : {goodRatio}%</div>
      <DiaryList onDelete={onDelete} onEdit={onEdit} diaryList={data} />
    </div>
  );
}

export default App;