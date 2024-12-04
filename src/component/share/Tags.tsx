import React, { useState, useRef, useEffect } from 'react';
import { Input, Tag } from 'antd';
import type { InputRef } from 'antd';

interface TagsProps {
  tags: string[];
  handleAddNewCategory: (newCategory: string) => void;
  handleClose: (removedTag: string) => void;
  inputVisible: boolean; // Passed from parent to control input visibility
  setInputVisible: React.Dispatch<React.SetStateAction<boolean>>; // To close the input from child
}

const Tags: React.FC<TagsProps> = ({
  tags,
  handleAddNewCategory,
  handleClose,
  inputVisible,
  setInputVisible,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible && inputRef.current) {
      inputRef.current.focus(); // Focus on the input when it's visible
    }
  }, [inputVisible]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Confirm and add a new tag
  const handleInputConfirm = () => {
    if (inputValue) {
      handleAddNewCategory(inputValue); // Call the add new category function from parent
    }
    setInputVisible(false); // Hide the input after confirming
    setInputValue(''); // Clear the input field
  };

  return (
    <div>
      {tags.map((tag, index) => (
        <Tag
          key={index}
          closable
          onClose={() => handleClose(tag)}
           className="mb-2 py-1 bg-gray-200 rounded-2xl"
        >
          {tag}
        </Tag>
      ))}
      {inputVisible && (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{ width: 100 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
    </div>
  );
};

export default Tags;
