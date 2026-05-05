import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const MediaUploader = ({ capsuleId, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!capsuleId) {
      toast.error('Save capsule draft first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append('media', file);
    });

    try {
      const { data } = await api.post(`/capsules/${capsuleId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Files uploaded successfully');
      onUploadComplete(data.data.media);
      setPreviews([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [capsuleId, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'video/mp4': ['.mp4'],
      'audio/mpeg': ['.mp3'],
      'application/pdf': ['.pdf'],
    }
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20' 
            : 'border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          {uploading ? (
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-3" />
          ) : (
            <Upload className="w-10 h-10 text-slate-400 mb-3" />
          )}
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            {isDragActive ? 'Drop files here' : 'Drag & drop media here, or click to select'}
          </p>
          <p className="text-xs text-slate-500 mt-1">Images, MP4, MP3, PDF (Max 10MB)</p>
        </div>
      </div>
    </div>
  );
};

export default MediaUploader;
