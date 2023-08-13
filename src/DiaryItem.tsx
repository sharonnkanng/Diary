import React,{ useEffect, useRef, useState } from "react";

interface DiaryItemProps {
    onEdit: (id: number, content: string) => void;
    onDelete: (id: number) => void;
    id: number;
    author: string;
    content: string;
    emotion: number;
    created_time: number;
    // Add any other properties here
  }

const emotionDict: {[key:number]: string} = {
  1: "😫",
  2: "😑",
  3: "🙂",
  4: "😚",
  5: "😍"
}


const DiaryItem: React.FC<DiaryItemProps>  = ({
  onEdit,
  onDelete,
  id,
  author,
  content,
  emotion,
  created_time,
}) => {

  useEffect(() => {
    console.log(`${id}th Item Rendered!`);
  });

  const [isEdit, setIsEdit] = useState(false);
  const toggleIsEdit = () => setIsEdit(!isEdit);
  const [localValue, setLocalValue] = useState(content);
  const localValueInput = useRef<HTMLTextAreaElement | null>(null);

  const handleDelete = () => {
    if (window.confirm(`${id}: Do you want to delete this diary?`)) {
      onDelete(id);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    setLocalValue(content);
  };

  const handleEdit = () => {
    if (localValue.length < 5) {
      localValueInput.current?.focus();
      return;
    } else {
      if (window.confirm(`Do you want to edit the content as ${localValue}?`))
        onEdit(id, localValue);
      toggleIsEdit();
    }
  };

  return (
    <div className="DiaryItem">
      <div className="info">
        <span>
          {author} || Emotion Score : {emotionDict[emotion]}
        </span>
        <br />
        <span className="Date">{new Date(created_time).toLocaleString()}</span>
      </div>
      <span className="Content">
        {isEdit ? (
          <>
            <textarea
            // useRef 로 DOM 사용하는 거 여기라고 말해주기
              ref={localValueInput}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
            ></textarea>
          </>
        ) : (
          <>{content}</>
        )}
      </span>
      {isEdit ? (
        <div>
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleEdit}>Submit</button>
        </div>
      ) : (
        <div>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={toggleIsEdit}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default React.memo(DiaryItem);