import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, Search, X, AlertCircle } from "lucide-react";

const ACCEPTED = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
};

export default function UploadPanel({ onSubmit, loading, error, onReset }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((accepted) => {
    if (accepted.length === 0) return;
    const f = accepted[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
    if (onReset) onReset();
  }, [onReset]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleSubmit = () => {
    if (file && !loading) onSubmit(file);
  };

  const clear = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (onReset) onReset();
  };

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={`solana-gradient-border rounded-2xl p-6 cursor-pointer transition-all
          ${isDragActive ? "scale-[1.02] ring-2 ring-solana-green/40" : ""}
          ${file ? "py-4" : "py-10"}`}
      >
        <input {...getInputProps()} />
        {!file && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-solana-purple/15 mb-3">
              <Upload className="w-5 h-5 text-solana-purple" />
            </div>
            <p className="text-text-primary font-medium mb-1">
              {isDragActive ? "Drop your logo crop here" : "Upload your logo crop"}
            </p>
            <p className="text-xs text-text-tertiary">
              PNG, JPG or WEBP · up to 5MB
            </p>
          </div>
        )}
        {file && preview && (
          <div className="flex items-center gap-3">
            <img
              src={preview}
              alt="logo crop preview"
              className="w-14 h-14 rounded-lg object-cover border border-border-emphasis"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary truncate">{file.name}</p>
              <p className="text-xs text-text-tertiary">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clear();
              }}
              className="p-1.5 rounded-md hover:bg-bg-tertiary text-text-tertiary"
              aria-label="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <motion.button
        onClick={handleSubmit}
        disabled={!file || loading}
        whileHover={file && !loading ? { scale: 1.02 } : {}}
        whileTap={file && !loading ? { scale: 0.98 } : {}}
        className={`w-full py-3.5 rounded-xl font-semibold text-base relative overflow-hidden
          transition-all flex items-center justify-center gap-2
          ${
            file && !loading
              ? "bg-gradient-to-r from-solana-purple via-solana-green to-solana-cyan text-bg-primary shadow-[0_0_30px_rgba(20,241,149,0.35)]"
              : "bg-bg-tertiary text-text-tertiary cursor-not-allowed"
          }`}
      >
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            />
            <span>Scanning the mosaic...</span>
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            <span>Find Me in the Mosaic</span>
          </>
        )}
      </motion.button>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg p-3"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
}
