import React, { useState } from 'react';
import axios from 'axios';
import UploadButton from './ui/UploadButton';
import FileList from './FileList';

const PdfUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          maxContentLength: Infinity,
          headers: {
            'Content-Type': 'multipart/form-data',
            pinata_api_key: process.env.API_KEY,
            pinata_secret_api_key: process.env.API_SECRET,
          },
        }
      );

      const fileInfo = {
        name: file.name,
        type: file.type,
        size: file.size,
        ipfsUrl: `ipfs://${res.data.IpfsHash}`,
        timestamp: new Date().toISOString(),
        // Additional metadata like description, uploader, etc.
      };

      setUploadedFiles([...uploadedFiles, fileInfo]);
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
    }
  };

  return (
    <div className="App">
      <UploadButton onUpload={handleUpload} />
      <FileList files={uploadedFiles} />
    </div>
  );
};

export default PdfUpload;