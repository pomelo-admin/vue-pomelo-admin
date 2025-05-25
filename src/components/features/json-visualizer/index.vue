<template>
  <div class="json-visualizer-container">
    <el-card class="json-visualizer-card">
      <template #header>
        <div class="card-header">
          <span>{{ t('features.jsonVisualizer.title') }}</span>
        </div>
      </template>
      <div class="visualizer-wrapper">
        <div v-if="!jsonData || Object.keys(jsonData).length === 0" class="empty-state">
          {{ t('features.jsonVisualizer.emptyState') }}
        </div>
        <div v-else>
          <div id="test" ref="graphContainer" class="graph-container"></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Graph } from '@antv/g6';

// 国际化
const { t } = useI18n();

// 定义属性
const props = defineProps({
  modelValue: {
    type: [Object, Array, String],
    default: () => ({}),
  },
});

// 图容器引用
const graphContainer = ref<HTMLElement | null>(null);
let graph: any = null;

// 计算处理后的JSON数据
const jsonData = computed(() => {
  if (typeof props.modelValue === 'string') {
    try {
      return JSON.parse(props.modelValue);
    } catch (e) {
      return {};
    }
  }
  return props.modelValue;
});

// 将JSON数据转换为G6可用的树形结构
const transformJsonToTree = (data: any, key = 'ROOT'): any => {
  const node: any = {
    id: key,
    label: key,
    children: [],
  };

  if (data === null) {
    node.label = `${key}: null`;
    return node;
  }

  if (data === undefined) {
    node.label = `${key}: undefined`;
    return node;
  }

  if (typeof data !== 'object') {
    // 处理基本类型
    node.label = `${key}: ${typeof data === 'string' ? `"${data}"` : data}`;
    return node;
  }

  // 处理数组或对象
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      node.children.push(transformJsonToTree(item, `${index}`));
    });
  } else {
    Object.entries(data).forEach(([childKey, value]) => {
      node.children.push(transformJsonToTree(value, childKey));
    });
  }

  return node;
};

// 初始化图
const initGraph = () => {
  if (!graphContainer.value) return;

  // 销毁现有图实例
  if (graph) {
    graph.destroy();
  }

  const treeData = transformJsonToTree(jsonData.value);

  // 创建图实例
  graph = new Graph({
    container: document.getElementById('test') as HTMLElement,
    width: graphContainer.value.clientWidth,
    height: 400,
    data: treeData,
    node: {
      type: 'rect',
      style: {
        radius: 4,
        fill: '#fff',
        stroke: '#409eff',
        lineWidth: 1,
        fontSize: 12,
        cursor: 'pointer',
      },
      // 根据节点数据设置不同颜色
      state: {
        hover: {
          stroke: '#f56c6c',
          lineWidth: 2,
        },
      },
    },
    edge: {
      type: 'cubic-horizontal',
      style: {
        stroke: '#A3B1BF',
        lineWidth: 1,
      },
    },
    behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
    layout: {
      type: 'dendrogram',
      direction: 'LR',
      nodeSep: 30,
      rankSep: 100,
    },
    autoFit: 'center',
  });

  // 自定义节点样式
  graph.on('node:mouseenter', (evt: any) => {
    const { itemId } = evt;
    graph.setItemState(itemId, 'hover', true);
  });

  graph.on('node:mouseleave', (evt: any) => {
    const { itemId } = evt;
    graph.setItemState(itemId, 'hover', false);
  });

  // 渲染图
  graph.render();
};

// 监听窗口大小变化
const handleResize = () => {
  if (graph && graphContainer.value) {
    graph.resize(graphContainer.value.clientWidth, 400);
    graph.fitCenter();
  }
};

// 监听数据变化
watch(
  () => props.modelValue,
  () => {
    if (graph) {
      // 重新计算树形数据
      const treeData = transformJsonToTree(jsonData.value);
      graph.changeData(treeData);
      graph.fitCenter();
    }
  },
  { deep: true }
);

// 组件挂载时初始化图
onMounted(() => {
  if (graphContainer.value) {
    console.log('挂载');
    initGraph();
    window.addEventListener('resize', handleResize);
  }
});

// 组件卸载时销毁图
onBeforeUnmount(() => {
  if (graph) {
    graph.destroy();
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.json-visualizer-container {
  height: 100%;
}

.json-visualizer-card {
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.visualizer-wrapper {
  height: 400px;
  overflow: hidden;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-style: italic;
  color: #909399;
}

.graph-container {
  width: 100%;
  height: 400px;
  background-color: #fafafa;
  border-radius: 4px;
}
</style>
