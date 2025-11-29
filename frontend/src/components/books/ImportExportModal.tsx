import React, { useState, useRef } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useBookStore } from "../../store/bookStore";

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"import" | "export">("export");
  const [file, setFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { exportBooks, importBooks, isLoading } = useBookStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImportStatus(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      await importBooks(file);
      setImportStatus({
        message: "Books imported successfully!",
        type: "success",
      });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => {
        onClose();
        setImportStatus(null);
      }, 2000);
    } catch (error) {
      setImportStatus({
        message: "Failed to import books. Please check the file format.",
        type: "error",
      });
    }
  };

  const handleExport = async (format: "csv" | "json") => {
    try {
      await exportBooks(format);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import / Export Library">
      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === "export"
              ? "text-neon-cyan border-b-2 border-neon-cyan"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("export")}
        >
          Export
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === "import"
              ? "text-neon-cyan border-b-2 border-neon-cyan"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("import")}
        >
          Import
        </button>
      </div>

      {activeTab === "export" ? (
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            Download your entire library to backup your data or transfer it to
            another device.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleExport("csv")}
              className="flex flex-col items-center justify-center p-6 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 hover:border-neon-cyan transition-all group"
            >
              <DocumentTextIcon className="w-8 h-8 text-gray-400 group-hover:text-neon-cyan mb-2" />
              <span className="text-white font-medium">CSV Format</span>
              <span className="text-xs text-gray-500 mt-1">
                Best for spreadsheets
              </span>
            </button>
            <button
              onClick={() => handleExport("json")}
              className="flex flex-col items-center justify-center p-6 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 hover:border-neon-cyan transition-all group"
            >
              <code className="text-xl text-gray-400 group-hover:text-neon-cyan mb-2">
                {"{ }"}
              </code>
              <span className="text-white font-medium">JSON Format</span>
              <span className="text-xs text-gray-500 mt-1">
                Best for developers
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            Upload a CSV or JSON file to add books to your library. Duplicates
            will be skipped.
          </p>

          <div
            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-neon-cyan transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <ArrowDownTrayIcon className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-300 font-medium">
              {file ? file.name : "Click to select a file"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: .csv, .json
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,.json"
              className="hidden"
            />
          </div>

          {importStatus && (
            <div
              className={`p-3 rounded-md text-sm ${
                importStatus.type === "success"
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {importStatus.message}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleImport}
              disabled={!file || isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading ? "Importing..." : "Start Import"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
