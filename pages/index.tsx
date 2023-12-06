import { useState, useRef, ChangeEvent, FormEvent } from "react";
import Head from "next/head";
import Files from "@/components/Files";
import PdfUpload from "@/components/PdfUpload";

interface FormData {
  name: string;
  description: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
  });
  const inputFile = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async (fileToUpload: File) => {                                              
    try {
      setUploading(true);
      const jwtRes = await fetch("/api/files", { method: "POST" });
      const JWT = await jwtRes.text();
      
      const formData = new FormData();
      formData.append("file", fileToUpload, fileToUpload.name);
  
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
          body: formData,
        }
      );
      const json = await res.json();
      const { IpfsHash } = json;
      setCid(IpfsHash);
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };  

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      await uploadFile(file);
    }
  };

  const loadRecent = async () => {
    try {
      const res = await fetch("/api/files");
      const json = await res.json();
      setCid(json.ipfs_pin_hash);
    } catch (error) {
      console.log(error);
      alert("trouble loading files");
    }
  };

  return (
    <>
      <Head>
        <title>Simple IPFS</title>
        <meta name="description" content="Generated with create-pinata-app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/pinnie.png" />
      </Head>
      <main className="m-auto flex min-h-screen w-full flex-col items-center justify-center">
        <div className="m-auto flex h-full w-full flex-col items-center justify-center bg-cover bg-center">
          <div className="h-full max-w-screen-xl">
            <div className="m-auto flex h-full w-full items-center justify-center">
              <div className="m-auto w-3/4 text-center">
                <h1>Share files easily</h1>
                <p className="mt-2">
                  With Simple IPFS, you can upload a file, get a link, and share
                  it with anyone who needs to access the file. The link is
                  permanent, but it will only be shared once.
                </p>
                <input
                  type="file"
                  id="file"
                  ref={inputFile}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                <PdfUpload />
                <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-light p-2 text-center text-secondary">
                  <button
                    disabled={uploading}
                    onClick={() => inputFile.current?.click()}
                    className="align-center flex h-64 w-3/4 flex-row items-center justify-center rounded-3xl bg-secondary px-4 py-2 text-light transition-all duration-300 ease-in-out hover:bg-accent hover:text-light"
                  >
                    {uploading ? (
                      "Uploading..."
                    ) : (
                      <div>
                        <p className="text-lg font-light">
                          Select a file to upload to the IPFS network
                        </p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="m-auto mt-4 h-12 w-12 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
                {file && (
                  <form onSubmit={(event) => uploadFile(event as any)}>
                    <div className="mb-2">
                      <label htmlFor="name">Name</label>
                      <br />
                      <input
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="border border-secondary rounded-md p-2 outline-none"
                        id="name"
                        value={form.name}
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <label htmlFor="description">Description</label>
                      <br />
                      <textarea
                        className="border border-secondary rounded-md p-2 outline-none"
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        placeholder="Description..."
                      />
                    </div>
                    <button
                      className="rounded-lg bg-secondary text-white w-auto p-4"
                      type="submit"
                    >
                      Upload
                    </button>
                  </form>
                )}
                {cid && <Files cid={cid} />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};