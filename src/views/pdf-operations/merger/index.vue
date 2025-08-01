<template>
  <FeatureDemo
    :title="t('features.pdfOperations.merger.title')"
    :description="t('features.pdfOperations.merger.description')"
    path="src/views/pdf-operations/merger"
  >
    <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop="handleDrop">
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="application/pdf"
        style="display: none"
        @change="handleFileSelect"
      />
      <el-icon :size="48" class="upload-icon"><Document /></el-icon>
      <p>{{ t('features.pdfOperations.merger.reorderHint') }}</p>
      <p v-if="pdfFiles.length > 0" class="selected-files">
        {{ pdfFiles.length }}
        {{ pdfFiles.length > 1 ? 'files' : 'file' }} selected
      </p>
    </div>

    <draggable
      v-if="pdfFiles.length > 0"
      v-model="pdfFiles"
      class="pdf-list"
      item-key="id"
      handle=".drag-handle"
      ghost-class="ghost"
    >
      <template #item="{ element, index }">
        <div class="pdf-item">
          <div class="drag-handle">
            <el-icon><Rank /></el-icon>
          </div>
          <div class="pdf-icon">
            <el-icon :size="32"><Document /></el-icon>
          </div>
          <div class="pdf-info">
            <div class="pdf-name">{{ element.file.name }}</div>
            <div class="pdf-size">{{ formatFileSize(element.file.size) }}</div>
          </div>
          <div class="pdf-actions">
            <el-button type="danger" circle @click="removeFile(index)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </template>
    </draggable>

    <div class="action-buttons">
      <el-button type="primary" :disabled="pdfFiles.length < 2" @click="mergePdfs">
        {{ t('features.pdfOperations.merger.mergeButton') }}
      </el-button>
      <el-button type="success" :disabled="!mergedPdf" @click="downloadMergedPdf">
        {{ t('features.pdfOperations.merger.downloadButton') }}
      </el-button>
      <el-button @click="clearFiles">
        {{ t('features.pdfOperations.merger.clearButton') }}
      </el-button>
    </div>
  </FeatureDemo>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { Document, Delete, Rank } from '@element-plus/icons-vue';
import draggable from 'vuedraggable';
import { FeatureDemo } from '@/components/common';

const { t } = useI18n();

// File input reference
const fileInput = ref<HTMLInputElement | null>(null);

// PDF files
interface PdfFile {
  id: string;
  file: File;
}

const pdfFiles = ref<PdfFile[]>([]);
const mergedPdf = ref<string | null>(null);

// File handling functions
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    const files = Array.from(input.files);
    // Filter for PDF files
    const newPdfFiles = files
      .filter(file => file.type === 'application/pdf')
      .map(file => ({
        id: generateId(),
        file,
      }));

    pdfFiles.value = [...pdfFiles.value, ...newPdfFiles];
    input.value = ''; // Reset input
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer?.files) {
    const files = Array.from(event.dataTransfer.files);
    // Filter for PDF files
    const newPdfFiles = files
      .filter(file => file.type === 'application/pdf')
      .map(file => ({
        id: generateId(),
        file,
      }));

    pdfFiles.value = [...pdfFiles.value, ...newPdfFiles];
  }
};

const removeFile = (index: number) => {
  pdfFiles.value.splice(index, 1);
};

const clearFiles = () => {
  pdfFiles.value = [];
  mergedPdf.value = null;
};

// Utility functions
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// PDF merging function
const mergePdfs = () => {
  if (pdfFiles.value.length < 2) {
    ElMessage.warning(t('features.pdfOperations.merger.noFilesSelected'));
    return;
  }

  // In a real implementation, you would use a library like PDF.js or jsPDF to merge PDFs
  // For demonstration purposes, we'll just show a success message
  ElMessage.info('PDF merging is not fully implemented in this demo.');

  // Simulate processing
  setTimeout(() => {
    mergedPdf.value = 'merged-pdf-data-url';
    ElMessage.success(t('features.pdfOperations.merger.mergeSuccess'));
  }, 1500);
};

const downloadMergedPdf = () => {
  if (!mergedPdf.value) return;

  // In a real implementation, you would create a download link with the merged PDF data
  // For demonstration purposes, we'll just show a success message
  ElMessage.success('Download functionality would be implemented here.');

  // Example of how it would work with a real data URL:
  // const link = document.createElement('a');
  // link.href = mergedPdf.value;
  // link.download = 'merged.pdf';
  // link.click();
};
</script>

<style scoped lang="scss">
.app-container {
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.description {
  margin-bottom: 20px;
  color: var(--el-text-color-secondary);
}

.upload-area {
  padding: 40px;
  margin: 20px 0;
  text-align: center;
  cursor: pointer;
  background-color: #f0f7ff;
  border: 2px dashed #a0cfff;
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    background-color: #e6f1fc;
    border-color: var(--el-color-primary);
  }

  .upload-icon {
    margin-bottom: 10px;
    font-size: 48px;
    color: var(--el-color-primary);
  }

  p {
    margin: 10px 0;
    font-size: 16px;
    color: var(--el-text-color-secondary);
  }

  .selected-files {
    font-weight: bold;
    color: var(--el-color-success);
  }
}

.pdf-list {
  max-height: 400px;
  margin: 20px 0;
  overflow-y: auto;

  .pdf-item {
    display: flex;
    align-items: center;
    padding: 10px;
    margin-bottom: 10px;
    background-color: var(--el-fill-color-light);
    border: 1px solid var(--el-border-color-light);
    border-radius: 4px;

    .drag-handle {
      padding: 10px;
      color: var(--el-text-color-secondary);
      cursor: move;

      &:hover {
        color: var(--el-color-primary);
      }
    }

    .pdf-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin-right: 15px;
      color: var(--el-color-danger);
    }

    .pdf-info {
      flex: 1;

      .pdf-name {
        max-width: 300px;
        margin-bottom: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: bold;
        white-space: nowrap;
      }

      .pdf-size {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.ghost {
  background: var(--el-color-primary-light-9);
  opacity: 0.5;
}
</style>
