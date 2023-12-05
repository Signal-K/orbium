import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

export const config = {
  api: {
    bodyParser: false,
  },
};

const keyRestrictions = {
  keyName: 'Signed Upload JWT',
  maxUses: 1,
  permissions: {
    endpoints: {
      data: {
        pinList: false,
        userPinnedDataTotal: false
      },
      pinning: {
        pinFileToIPFS: true,
        pinJSONToIPFS: false,
        pinJobs: false,
        unpin: false,
        userPinPolicy: false
      }
    }
  }    
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.PINATA_JWT}`
        }, 
        body: JSON.stringify(keyRestrictions)
      };
  
      const jwtRepsonse = await fetch('https://api.pinata.cloud/users/generateApiKey', options);
      const json = await jwtRepsonse.json();
      const { JWT } = json;
      res.send(JWT);
    } catch (e) {
      console.log(e);
      res.status(500).send("Server Error");
    };
  };
}
