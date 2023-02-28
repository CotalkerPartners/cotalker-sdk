import { ObjectId } from '@customTypes/custom'

type COTFileContentType = 'image' | 'audio' | 'video' | 'document'
type COTFileStatus = 'pending' | 'processing' | 'uploaded' | 'deleted' | 'error'
export declare interface COTFile {
  contentType: COTFileContentType;
  company?: ObjectId;
  status: COTFileStatus;
  user?: ObjectId;
  createdAt: string;
  modifiedAt: string;
  public: boolean;
  url?: string;
  extension?: string;
  mimeType?: string;
  fileName?: string;
  size?: number;
}

export declare interface COTFileUploaded extends COTFile {
  status: 'uploaded';
  url: string;
  extension: string;
  mimeType: string;
  fileName: string;
  size: number;
}
