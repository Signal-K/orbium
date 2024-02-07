import React from 'react';

interface FileListItemProps {
  file: any;
}

const FileListItem: React.FC<FileListItemProps> = ({ file }) => {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  const fileIcon = 'test' /* determine file icon based on fileType */;

  return (
    <div>
      <img src={fileIcon} alt={fileType} />
      <span>{file.name}</span>
      <a href={file.ipfsUrl} target="_blank" rel="noreferrer">View</a>
      <p>Description: {/* Your description */}</p>
      <p>Uploaded on: {file.timestamp}</p>
      <p>Uploader: {/* User identifier */}</p>
    </div>
  );
};

interface FileListProps {
  files: any[];
}

const FileList: React.FC<FileListProps> = ({ files }) => {
  return (
    <div>
      {files.map((file) => (
        <FileListItem key={file.ipfsUrl} file={file} />
      ))}
    </div>
  );
};

export default FileList;