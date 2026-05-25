import type { SafeAttachment } from '../types';

const maxAttachmentBytes = 200 * 1024;
const allowedAttachmentTypes = ['text/plain', 'text/markdown', 'application/json', 'text/csv', 'application/pdf'];

export function isAllowedAttachment(file: File) {
  return file.size <= maxAttachmentBytes && allowedAttachmentTypes.includes(file.type || 'text/plain');
}

export function attachmentPolicyText() {
  return 'Attach small generic notes only. Do not attach screenshots, ticket exports, credentials, IP lists, hostnames, or client-sensitive files.';
}

export function readSafeAttachment(file: File): Promise<SafeAttachment> {
  return new Promise((resolve, reject) => {
    if (!isAllowedAttachment(file)) {
      reject(new Error('Attachment must be a small text, Markdown, JSON, CSV, or PDF file under 200 KB.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: `att-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: file.name,
        type: file.type || 'text/plain',
        size: file.size,
        dataUrl: String(reader.result),
        addedAt: new Date().toISOString()
      });
    };
    reader.onerror = () => reject(new Error('Could not read attachment.'));
    reader.readAsDataURL(file);
  });
}

export function downloadAttachment(attachment: SafeAttachment) {
  const link = document.createElement('a');
  link.href = attachment.dataUrl;
  link.download = attachment.name;
  link.click();
}
