import React from 'react';

const MessageBox = ({ content, dir, idx }:{
    content: string | undefined,
    dir: 'left' | 'right',
    idx: number
}) => {
  const dirClassNames = {
    left: "mr-auto bg-gray-200 text-black rounded-lg p-3 max-w-[70%] mb-2",
    right: "ml-auto bg-blue-500 text-white rounded-lg p-3 max-w-[70%] mb-2",
  };

  return (
    <div className={`${dirClassNames[dir]} break-words`}>
      {content}
    </div>
  );
};

export default MessageBox;