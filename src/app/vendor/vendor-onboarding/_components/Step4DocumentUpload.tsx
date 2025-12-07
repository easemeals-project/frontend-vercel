"use client";

import React, { useState } from "react";
import { Button } from "antd";
import { QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { CiFileOn } from "react-icons/ci";
import UploadModal from "./UploadModal";

// Mock types for documents
export type DocFile = {
  name: string;
  size: string;
  type: "business" | "id";
  file?: File;
};

interface Step4Props {
  documents: DocFile[];
  setDocuments: React.Dispatch<React.SetStateAction<DocFile[]>>;
}

export default function Step4DocumentUpload({
  documents,
  setDocuments,
}: Step4Props) {
  const [activeModal, setActiveModal] = useState<"business" | "id" | null>(
    null
  );

  const handleUpload = (file: File) => {
    if (!activeModal) return;

    // Simulate file processing
    const newDoc: DocFile = {
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      type: activeModal,
      file: file,
    };

    // Replace existing doc of same type or add new
    setDocuments((prev) => {
      const filtered = prev.filter((d) => d.type !== activeModal);
      return [...filtered, newDoc];
    });

    setActiveModal(null);
  };

  const handleRemove = (type: "business" | "id") => {
    setDocuments((prev) => prev.filter((d) => d.type !== type));
  };

  const businessDoc = documents.find((d) => d.type === "business");
  const idDoc = documents.find((d) => d.type === "id");

  return (
    <>
      <div className="flex justify-between items-start pb-6 px-6">
        <div>
          <h2 className="text-xl font-bold text-black mb-1">
            Step 4: Document Upload
          </h2>
          <p className="text-text2 text-sm">
            Upload required documents for verification.
          </p>
        </div>
        <QuestionCircleOutlined className="text-gray-400 text-lg cursor-help" />
      </div>

      {/* Upload Cards */}
      <div className="px-6 pt-6 border-t-2 border-gray-200 ">
<div className="mb-8 ">
        <h3 className="text-sm font-bold text-gray-700 mb-2">
          Upload Required Documents
        </h3>
        <p className="text-xs text-text2 mb-6">
          Please upload clear images of your business registration and ID card.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Registration Card */}
          <div className="border border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center text-center">
            <div className="w-12 h-10 rounded-full bg-green-50 flex items-center justify-center mb-4 text-app_primary">
              <CiFileOn className="text-xl" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">
              Business Registration
            </h4>
            <p className="text-xs text-gray-500 mb-6">
              Upload your CAC certificate or business registration document
            </p>
            <Button
              icon={<UploadOutlined />}
              onClick={() => setActiveModal("business")}
              className="bg-app_primary! hover:bg-app_primary/90! border-none text-white! font-medium rounded-lg h-9 px-6"
            >
              Upload
            </Button>
          </div>

          {/* ID Card */}
          <div className="border border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center text-center">
            <div className="w-12 h-10 rounded-full bg-green-50 flex items-center justify-center mb-4 text-app_primary">
              <CiFileOn className="text-xl" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">ID Card</h4>
            <p className="text-xs text-gray-500 mb-6">
              Upload a valid government-issued ID card (National ID, Voter&apos;s
              Card, etc.)
            </p>
            <Button 
              icon={<UploadOutlined />}
              onClick={() => setActiveModal("id")}
              className="bg-app_primary! hover:bg-app_primary/90! border-none text-white! font-medium rounded-lg h-9 px-6"
            >
              Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-4">
          Uploaded Documents
        </h3>

        {documents.length === 0 ? (
          <p className="text-sm text-gray-400 italic">
            No documents uploaded yet
          </p>
        ) : (
          <div className="border rounded-lg border-gray-100 divide-y divide-gray-100">
            {/* Business Doc Item */}
            {businessDoc && (
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                    <CiFileOn style={{ fontSize: "20px" }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Business Registration
                    </p>
                    <p className="text-xs text-gray-500">
                      {businessDoc.name} • {businessDoc.size}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove("business")}
                  className="text-red-500 text-xs font-medium cursor-pointer hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            )}

            {/* ID Doc Item */}
            {idDoc && (
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                    <CiFileOn style={{ fontSize: "20px" }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">ID Card</p>
                    <p className="text-xs text-gray-500">
                      {idDoc.name} • {idDoc.size}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove("id")}
                  className="text-red-500 text-xs cursor-pointer font-medium hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={activeModal === "business"}
        onClose={() => setActiveModal(null)}
        title="Upload Business Registration"
        description="Select a file from your computer to upload. We accept PDF, JPG, and PNG formats up to 10MB."
        onFileSelect={handleUpload}
      />

      <UploadModal
        isOpen={activeModal === "id"}
        onClose={() => setActiveModal(null)}
        title="Upload ID Card"
        description="Select a file from your computer to upload. We accept PDF, JPG, and PNG formats up to 10MB."
        onFileSelect={handleUpload}
      />
      </div>
    </>
      
  );
}
