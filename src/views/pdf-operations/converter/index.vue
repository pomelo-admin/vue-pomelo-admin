<template>
  <FeatureDemo
    :title="t('features.pdfOperations.converter.title')"
    :description="t('features.pdfOperations.converter.description')"
    path="src/views/pdf-operations/converter"
  >
    <el-tabs v-model="activeTab" class="converter-tabs">
      <el-tab-pane :label="t('features.pdfOperations.converter.imageToPdf')" name="imageToPdf">
        <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop="handleDrop">
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*"
            style="display: none"
            @change="handleFileSelect"
          />
          <el-icon :size="48" class="upload-icon"><Upload /></el-icon>
          <p>{{ t('features.pdfOperations.converter.dragDropHint') }}</p>
          <p v-if="selectedFiles.length > 0" class="selected-files">
            {{ selectedFiles.length }}
            {{ selectedFiles.length > 1 ? 'files' : 'file' }} selected
          </p>
        </div>

        <div v-if="selectedFiles.length > 0" class="file-list">
          <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
            <el-image
              :src="getImagePreview(file)"
              fit="contain"
              class="file-preview"
              :preview-src-list="[getImagePreview(file)]"
            />
            <div class="file-info">
              <div class="file-name">{{ file.name }}</div>
              <div class="file-size">{{ formatFileSize(file.size) }}</div>
            </div>
            <el-button type="danger" circle @click="removeFile(index)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>

        <div class="options-panel">
          <el-form label-position="top" :model="imageToPdfOptions">
            <el-form-item :label="t('features.pdfOperations.converter.pdfQuality')">
              <el-slider
                v-model="imageToPdfOptions.quality"
                :min="1"
                :max="10"
                :step="1"
                show-stops
              />
            </el-form-item>
          </el-form>
        </div>

        <div class="action-buttons">
          <el-button
            type="primary"
            :disabled="selectedFiles.length === 0"
            @click="convertImagesToPdf"
          >
            {{ t('features.pdfOperations.converter.convertButton') }}
          </el-button>
          <el-button type="success" :disabled="!pdfOutput" @click="downloadPdf">
            {{ t('features.pdfOperations.converter.downloadButton') }}
          </el-button>
          <el-button @click="clearFiles">
            {{ t('features.pdfOperations.converter.clearButton') }}
          </el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="t('features.pdfOperations.converter.pdfToImage')" name="pdfToImage">
        <div class="upload-area" @click="triggerPdfInput" @dragover.prevent @drop="handlePdfDrop">
          <input
            ref="pdfInput"
            type="file"
            accept="application/pdf"
            style="display: none"
            @change="handlePdfSelect"
          />
          <el-icon :size="48" class="upload-icon"><Document /></el-icon>
          <p>{{ t('features.pdfOperations.converter.dragDropHint') }}</p>
          <p v-if="selectedPdf" class="selected-files">
            {{ selectedPdf.name }}
          </p>
        </div>

        <div v-if="selectedPdf" class="options-panel">
          <el-form label-position="top" :model="pdfToImageOptions">
            <el-form-item :label="t('features.pdfOperations.converter.imageFormat')">
              <el-select v-model="pdfToImageOptions.format">
                <el-option label="PNG" value="png" />
                <el-option label="JPEG" value="jpeg" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('features.pdfOperations.converter.pageRange')">
              <el-radio-group v-model="pdfToImageOptions.pageRangeType">
                <el-radio label="all">{{
                  t('features.pdfOperations.converter.allPages')
                }}</el-radio>
                <el-radio label="custom">{{
                  t('features.pdfOperations.converter.pageRangeHint')
                }}</el-radio>
              </el-radio-group>
              <el-input
                v-if="pdfToImageOptions.pageRangeType === 'custom'"
                v-model="pdfToImageOptions.pageRange"
                placeholder="1,3,5-7"
                style="margin-top: 10px"
              />
            </el-form-item>
          </el-form>
        </div>

        <div class="action-buttons">
          <el-button type="primary" :disabled="!selectedPdf" @click="convertPdfToImages">
            {{ t('features.pdfOperations.converter.convertButton') }}
          </el-button>
          <el-button
            type="success"
            :disabled="!imageOutputs || imageOutputs.length === 0"
            @click="downloadImages"
          >
            {{ t('features.pdfOperations.converter.downloadButton') }}
          </el-button>
          <el-button @click="clearPdf">
            {{ t('features.pdfOperations.converter.clearButton') }}
          </el-button>
        </div>

        <div v-if="imageOutputs && imageOutputs.length > 0" class="image-outputs">
          <div v-for="(image, index) in imageOutputs" :key="index" class="image-output-item">
            <el-image
              :src="image"
              fit="contain"
              class="image-preview"
              :preview-src-list="imageOutputs"
            />
            <div class="image-info">Page {{ index + 1 }}</div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </FeatureDemo>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { Document, Upload, Delete } from '@element-plus/icons-vue';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { FeatureDemo } from '@/components/common';

const { t } = useI18n();

// Tab control
const activeTab = ref('imageToPdf');

// File inputs
const fileInput = ref<HTMLInputElement | null>(null);
const pdfInput = ref<HTMLInputElement | null>(null);

// Selected files
const selectedFiles = ref<File[]>([]);
const selectedPdf = ref<File | null>(null);

// Output files
const pdfOutput = ref<string | null>(null);
const imageOutputs = ref<string[]>([]);

// Conversion options
const imageToPdfOptions = reactive({
  quality: 7,
});

const pdfToImageOptions = reactive({
  format: 'png',
  pageRangeType: 'all',
  pageRange: '',
});

// File handling functions
const triggerFileInput = () => {
  fileInput.value?.click();
};

const triggerPdfInput = () => {
  pdfInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    const files = Array.from(input.files);
    // Filter for image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    selectedFiles.value = [...selectedFiles.value, ...imageFiles];
    input.value = ''; // Reset input
  }
};

const handlePdfSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    selectedPdf.value = input.files[0];
    input.value = ''; // Reset input
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer?.files) {
    const files = Array.from(event.dataTransfer.files);
    // Filter for image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    selectedFiles.value = [...selectedFiles.value, ...imageFiles];
  }
};

const handlePdfDrop = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0];
    if (file.type === 'application/pdf') {
      selectedPdf.value = file;
    } else {
      ElMessage.error('Please select a PDF file');
    }
  }
};

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
};

const clearFiles = () => {
  selectedFiles.value = [];
  pdfOutput.value = null;
};

const clearPdf = () => {
  selectedPdf.value = null;
  imageOutputs.value = [];
};

// Utility functions
const getImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Conversion functions
const convertImagesToPdf = async () => {
  if (selectedFiles.value.length === 0) {
    ElMessage.warning(t('features.pdfOperations.converter.noFilesSelected'));
    return;
  }

  try {
    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
    });

    // Process each image
    for (let i = 0; i < selectedFiles.value.length; i++) {
      const file = selectedFiles.value[i];
      const imageUrl = await readFileAsDataURL(file);

      // Add a new page for each image after the first one
      if (i > 0) {
        pdf.addPage();
      }

      // Create an image element to get dimensions
      const img = new Image();
      img.src = imageUrl;
      await new Promise(resolve => {
        img.onload = resolve;
      });

      // Calculate dimensions to fit the page
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = img.height / img.width;

      let imgWidth = pageWidth;
      let imgHeight = imgWidth * imgRatio;

      // If image height exceeds page height, scale down
      if (imgHeight > pageHeight) {
        imgHeight = pageHeight;
        imgWidth = imgHeight / imgRatio;
      }

      // Center the image on the page
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      // Add the image to the PDF
      pdf.addImage(imageUrl, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST');
    }

    // Save the PDF
    pdfOutput.value = pdf.output('datauristring');
    ElMessage.success(t('features.pdfOperations.converter.conversionSuccess'));
  } catch (error) {
    console.error('Error converting images to PDF:', error);
    ElMessage.error(t('features.pdfOperations.converter.conversionFailed'));
  }
};

const convertPdfToImages = async () => {
  if (!selectedPdf.value) {
    ElMessage.warning(t('features.pdfOperations.converter.noFilesSelected'));
    return;
  }

  ElMessage.info('PDF to Image conversion is not fully implemented in this demo.');
  // In a real implementation, you would use a library like pdf.js to render PDF pages as images
  // For demonstration purposes, we'll just show a placeholder
  imageOutputs.value = [
    'https://via.placeholder.com/600x800?text=PDF+Page+1',
    'https://via.placeholder.com/600x800?text=PDF+Page+2',
  ];
  ElMessage.success(t('features.pdfOperations.converter.conversionSuccess'));
};

const downloadPdf = () => {
  if (!pdfOutput.value) return;

  const link = document.createElement('a');
  link.href = pdfOutput.value;
  link.download = 'converted.pdf';
  link.click();
};

const downloadImages = async () => {
  if (imageOutputs.value.length === 0) return;

  // For multiple images, create a zip file
  if (imageOutputs.value.length > 1) {
    const zip = new JSZip();
    const format = pdfToImageOptions.format;

    // Add each image to the zip
    for (let i = 0; i < imageOutputs.value.length; i++) {
      const imageUrl = imageOutputs.value[i];
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      zip.file(`page_${i + 1}.${format}`, blob);
    }

    // Generate and download the zip
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'converted_images.zip';
    link.click();
  } else {
    // For a single image, download directly
    const link = document.createElement('a');
    link.href = imageOutputs.value[0];
    link.download = `converted.${pdfToImageOptions.format}`;
    link.click();
  }
};

// Helper function to read a file as data URL
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
</script>

<style scoped lang="scss">
.upload-area {
  border: 2px dashed #a0cfff;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  margin: 20px 0;
  background-color: #f0f7ff;

  &:hover {
    border-color: var(--el-color-primary);
    background-color: #e6f1fc;
  }

  .upload-icon {
    color: var(--el-color-primary);
    margin-bottom: 10px;
    font-size: 48px;
  }

  p {
    color: var(--el-text-color-secondary);
    margin: 10px 0;
    font-size: 16px;
  }

  .selected-files {
    font-weight: bold;
    color: var(--el-color-success);
  }
}

.file-list {
  margin: 20px 0;
  max-height: 300px;
  overflow-y: auto;

  .file-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 10px;
    background-color: var(--el-fill-color-light);

    .file-preview {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      margin-right: 15px;
    }

    .file-info {
      flex: 1;

      .file-name {
        font-weight: bold;
        margin-bottom: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 300px;
      }

      .file-size {
        color: var(--el-text-color-secondary);
        font-size: 12px;
      }
    }
  }
}

.options-panel {
  margin: 20px 0;
  padding: 20px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.image-outputs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;

  .image-output-item {
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    overflow: hidden;

    .image-preview {
      width: 100%;
      height: 200px;
      object-fit: contain;
    }

    .image-info {
      padding: 10px;
      text-align: center;
      background-color: var(--el-fill-color-light);
    }
  }
}

.converter-tabs {
  margin-top: 20px;
}

.description {
  color: var(--el-text-color-secondary);
  margin-bottom: 20px;
}
</style>
