import React from 'react';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4ZDI0YmU0MS04MzNmLTRkY2EtYTkwNS1iOWI2YmEyNmQwNTEiLCJlbWFpbCI6ImxpYW1Ac2tpbmV0aWNzLnRlY2giLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5IjoiMjkyNDlkMDgwOWViMWNjODExOTAiLCJzY29wZWRLZXlTZWNyZXQiOiJhNDAwZjA3MjE5NWViNTA3YjU4ZTEwMGI0YWQ4ZDlhODI0ZmRjMzg1ZjZlZjFhNjQzYzAxYjcwOWE0M2E1MTc4IiwiaWF0IjoxNzA3MjEyOTU4fQ.TRkHNtdCIK-AEF_Wh7artjH0ZkKscFzS4hFK4THia-4';

interface PinataResponse {
  data: {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
  };
}

const PinataUpload: React.FC = () => {
    const pinFileToIPFS = async () => {
      const formData = new FormData();
      const src = "public/bg.png";
      
      const file = fs.createReadStream(src);
      formData.append('file', file);
      
      const pinataMetadata = JSON.stringify({
        name: 'File name',
      });
      formData.append('pinataMetadata', pinataMetadata);
      
      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions', pinataOptions);
  
      try {
        const res = await axios.post<PinataResponse>(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              'Authorization': `Bearer ${JWT}`
            }
          }
        );
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  
    return (
      <button onClick={pinFileToIPFS}>Upload to Pinata</button>
    );
  }
  
export default PinataUpload;