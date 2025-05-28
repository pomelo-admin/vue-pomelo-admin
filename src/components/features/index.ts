// Export all feature components
import HeatMap from './heat-map/index.vue';
import JsonVisualizer from './json-visualizer/index.vue';
import JsonEditor from './json-editor/index.vue';
import DigitCaptcha from './digit-captcha/index.vue';
import SliderCaptcha from './slider-captcha/index.vue';
import PdfViewer from './pdf-viewer/index.vue';

export { HeatMap, JsonVisualizer, JsonEditor, DigitCaptcha, SliderCaptcha, PdfViewer };

// Default export for convenience when importing all components
export default {
  HeatMap,
  JsonVisualizer,
  JsonEditor,
  DigitCaptcha,
  SliderCaptcha,
  PdfViewer,
};
