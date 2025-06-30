// Export all feature components
import HeatMap from './heat-map/index.vue';
import JsonVisualizer from './json-visualizer/index.vue';
import JsonEditor from './json-editor/index.vue';
import DigitCaptcha from './digit-captcha/index.vue';
import SliderCaptcha from './slider-captcha/index.vue';
import PdfViewer from './pdf-viewer/index.vue';
import DebouncedSearchSelect from './debounced-search-select/index.vue';
import ThrottledSearchSelect from './throttled-search-select/index.vue';
import RichTextEditor from './rich-text-editor/index.vue';
import CodeEditor from './code-editor/index.vue';

// Export with Pomelo prefix
export {
  HeatMap as PomeloHeatMap,
  JsonVisualizer as PomeloJsonVisualizer,
  JsonEditor as PomeloJsonEditor,
  DigitCaptcha as PomeloDigitCaptcha,
  SliderCaptcha as PomeloSliderCaptcha,
  PdfViewer as PomeloPdfViewer,
  DebouncedSearchSelect as PomeloDebouncedSearchSelect,
  ThrottledSearchSelect as PomeloThrottledSearchSelect,
  RichTextEditor as PomeloRichTextEditor,
  CodeEditor as PomeloCodeEditor,
};

// Default export for convenience when importing all components
export default {
  PomeloHeatMap: HeatMap,
  PomeloJsonVisualizer: JsonVisualizer,
  PomeloJsonEditor: JsonEditor,
  PomeloDigitCaptcha: DigitCaptcha,
  PomeloSliderCaptcha: SliderCaptcha,
  PomeloPdfViewer: PdfViewer,
  PomeloDebouncedSearchSelect: DebouncedSearchSelect,
  PomeloThrottledSearchSelect: ThrottledSearchSelect,
  PomeloRichTextEditor: RichTextEditor,
  PomeloCodeEditor: CodeEditor,
};
