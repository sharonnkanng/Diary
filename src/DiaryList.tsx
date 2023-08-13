import React from "react";
import DiaryItem from "./DiaryItem";
import { DiaryItemProps } from "./DiaryItemProps";

interface DiaryListProps {
    onEdit: (id: number, content: string) => void;
    onDelete: (id: number) => void;
    diaryList: DiaryItemProps[]; // Use DiaryItemProps type
  }

  const DiaryList: React.FC<DiaryListProps> = ({ onEdit, onDelete, diaryList }) => {
    return (
      <div className="DiaryList">
        <h2>My Diary List</h2>
        <h4>There are {diaryList.length} item(s) stored in the system</h4>
        <div>
          {diaryList.map((item) => (
            <DiaryItem
              key={item.id}
              {...item}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      </div>
    );
  };

DiaryList.defaultProps = {
    diaryList: [],
};

export default DiaryList;