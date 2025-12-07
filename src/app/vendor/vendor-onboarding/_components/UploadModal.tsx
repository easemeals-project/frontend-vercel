"use client";

import React, { useState, useRef } from "react";
import { Modal, Button } from "antd";
import { LuUpload } from "react-icons/lu";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onFileSelect: (file: File) => void;
}

export default function UploadModal({
  isOpen,
  onClose,
  title,
  description,
  onFileSelect,
}: UploadModalProps) {
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
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      className="p-0"
      closeIcon={null}
      styles={{
        content: { padding: 0, borderRadius: "0.75rem", overflow: "hidden" },
      }}
    >
      <div className="p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6">{description}</p>

        <div
          className={`border-2 border-dashed relative rounded-xl p-12 text-center transition-colors ${
            dragActive
              ? "border-app_primary bg-app_primary/5"
              : "border-gray-200"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer "
            onChange={handleChange}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <div className="flex flex-col items-center justify-center">
            
            <LuUpload className="text-4xl text-gray-400 mb-4" />
            <p className="text-gray-900 font-medium mb-1">
              Click to select a file
            </p>
            <p className="text-gray-500 text-xs">or drag and drop here</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-8 py-4 flex justify-end gap-3 border-t border-gray-100">
        <Button onClick={onClose} className="h-10 px-6 rounded-lg text-gray-600 border-gray-300">
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={onButtonClick}
          className="h-10 px-6 rounded-lg bg-app_primary hover:bg-app_primary/90 border-none font-medium"
        >
          Select File
        </Button>
      </div>
    </Modal>
  );
}
