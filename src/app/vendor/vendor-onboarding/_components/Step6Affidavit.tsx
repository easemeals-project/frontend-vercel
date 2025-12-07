"use client";

import React, { useRef, useState } from "react";
import { Button } from "antd";
import { QuestionCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { SlPicture } from "react-icons/sl";

interface Step6Props {
  affidavitFile: File | null;
  setAffidavitFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function Step6Affidavit({
  affidavitFile,
  setAffidavitFile,
}: Step6Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAffidavitFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setAffidavitFile(e.target.files[0]);
    }
  };

  const onAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setAffidavitFile(null);
  };

  return (
    <>
      <div className="flex justify-between items-start pb-6 px-6">
        <div>
          <h2 className="text-xl font-bold text-black mb-1">
            Step 6: Affidavit
          </h2>
          <p className="text-text2 text-sm">
            Download, sign, and upload the affidavit.
          </p>
        </div>
        <QuestionCircleOutlined className="text-gray-400 text-lg cursor-help" />
      </div>

      <div className="px-6 pt-6 border-t-2 border-gray-200">
        <div className="space-y-6">
          {/* Header Section */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-1">
              Affidavit Upload
            </h3>
            <p className="text-sm text-text2">
              Download, sign, and upload the affidavit form.
            </p>
          </div>

          {/* Download Button */}
          <div>
            <Button
              className="bg-app_secondary! hover:bg-app_secondary/80! border-none text-white! border-app_secondary! font-medium h-10 px-6 rounded-lg text-sm"
              onClick={() => {
                // Mock download action
                console.log("Downloading affidavit...");
              }}
            >
              Download Affidavit Form
            </Button>
          </div>

          {/* Upload Area */}
          {!affidavitFile ? (
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
                dragActive
                  ? "border-app_primary bg-app_primary/5"
                  : "border-gray-200 bg-white"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={onAreaClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
                accept=".pdf"
              />
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-4">
                    <SlPicture className="text-4xl text-gray-300" />
                    <PlusOutlined className="absolute -top-1 -right-2 text-xs text-gray-400 bg-white rounded-full p-0.5" />
                </div>
                
                <p className="text-gray-900 font-medium mb-1 text-sm">
                  <span className="text-app_primary">Upload signed affidavit</span> or
                  drag and drop
                </p>
                <p className="text-gray-400 text-xs">PDF format only, up to 5MB</p>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-app_primary">
                    <SlPicture />
                 </div>
                 <div>
                    <p className="text-sm font-medium text-gray-900">{affidavitFile.name}</p>
                    <p className="text-xs text-text2">{(affidavitFile.size / 1024).toFixed(1)} KB</p>
                 </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                className="text-red-500 text-xs font-medium hover:text-red-600 cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
