<template>
  <div class="audio-player">
    <audio
      ref="audioRef"
      :src="src"
      :loop="loop"
      :preload="preload"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    />

    <div class="audio-main">
      <div class="audio-info">
        <div class="audio-title" v-if="title">{{ title }}</div>
        <div class="audio-sub-title" v-if="artist || album">
          <span v-if="artist">{{ artist }}</span>
          <span v-if="artist && album" class="dot">·</span>
          <span v-if="album">{{ album }}</span>
        </div>
      </div>

      <div class="audio-controls">
        <el-button circle type="primary" size="small" @click="togglePlay" :disabled="!src">
          <el-icon>
            <VideoPause v-if="isPlaying" />
            <VideoPlay v-else />
          </el-icon>
        </el-button>

        <div class="audio-progress">
          <span class="time-text">{{ formatTime(currentTime) }}</span>
          <el-slider v-model="progress" :step="0.1" :show-tooltip="false" @change="onSeek" />
          <span class="time-text">{{ formatTime(duration) }}</span>
        </div>

        <div class="audio-volume">
          <el-icon class="volume-icon" @click="toggleMute">
            <Mute v-if="muted || volume === 0" />
            <Microphone v-else />
          </el-icon>
          <el-slider
            v-model="volume"
            :min="0"
            :max="1"
            :step="0.01"
            :show-tooltip="false"
            class="volume-slider"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { VideoPlay, VideoPause, Mute, Microphone } from '@element-plus/icons-vue';

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  artist: {
    type: String,
    default: '',
  },
  album: {
    type: String,
    default: '',
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
  loop: {
    type: Boolean,
    default: false,
  },
  preload: {
    type: String as () => 'auto' | 'metadata' | 'none',
    default: 'metadata',
  },
});

const audioRef = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const progress = ref(0);
const volume = ref(0.8);
const muted = ref(false);

const initAudio = () => {
  const audio = audioRef.value;
  if (!audio) return;

  audio.volume = volume.value;

  if (props.autoplay) {
    play();
  }
};

const play = async () => {
  const audio = audioRef.value;
  if (!audio) return;
  try {
    await audio.play();
    isPlaying.value = true;
  } catch (error) {
    // 自动播放可能被浏览器阻止
    console.warn(error);
    ElMessage.warning('自动播放被浏览器阻止，请手动点击播放');
    isPlaying.value = false;
  }
};

const pause = () => {
  const audio = audioRef.value;
  if (!audio) return;
  audio.pause();
  isPlaying.value = false;
};

const togglePlay = () => {
  if (isPlaying.value) {
    pause();
  } else {
    play();
  }
};

const onTimeUpdate = () => {
  const audio = audioRef.value;
  if (!audio) return;
  currentTime.value = audio.currentTime;
  duration.value = audio.duration || 0;
  if (duration.value > 0) {
    progress.value = (currentTime.value / duration.value) * 100;
  }
};

const onLoadedMetadata = () => {
  const audio = audioRef.value;
  if (!audio) return;
  duration.value = audio.duration || 0;
};

const onEnded = () => {
  isPlaying.value = false;
  currentTime.value = 0;
  progress.value = 0;
};

const onSeek = (value: number) => {
  const audio = audioRef.value;
  if (!audio || !duration.value) return;
  const targetTime = (value / 100) * duration.value;
  audio.currentTime = targetTime;
  currentTime.value = targetTime;
};

const toggleMute = () => {
  const audio = audioRef.value;
  if (!audio) return;
  muted.value = !muted.value;
  audio.muted = muted.value;
};

watch(volume, newVal => {
  const audio = audioRef.value;
  if (!audio) return;
  audio.volume = newVal;
  if (newVal === 0) {
    muted.value = true;
  } else if (muted.value) {
    muted.value = false;
    audio.muted = false;
  }
});

watch(
  () => props.src,
  () => {
    // 切换音频源时重置状态
    pause();
    currentTime.value = 0;
    duration.value = 0;
    progress.value = 0;
    if (props.autoplay) {
      play();
    }
  }
);

const formatTime = (time: number) => {
  if (!time || Number.isNaN(time)) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${mm}:${ss}`;
};

onMounted(() => {
  initAudio();
});

onBeforeUnmount(() => {
  const audio = audioRef.value;
  if (!audio) return;
  audio.pause();
});
</script>

<style scoped lang="scss">
.audio-player {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  audio {
    display: none;
  }

  .audio-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .audio-info {
    .audio-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }

    .audio-sub-title {
      margin-top: 2px;
      font-size: 12px;
      color: #909399;

      .dot {
        margin: 0 4px;
      }
    }
  }

  .audio-controls {
    display: flex;
    align-items: center;
    gap: 12px;

    .audio-progress {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;

      .time-text {
        width: 44px;
        text-align: center;
        font-size: 12px;
        color: #909399;
      }
    }

    .audio-volume {
      display: flex;
      align-items: center;
      gap: 4px;
      width: 120px;

      .volume-icon {
        cursor: pointer;
        color: #606266;

        &:hover {
          color: #409eff;
        }
      }

      .volume-slider {
        flex: 1;
      }
    }
  }
}
</style>

<template>
  <div class="audio-player">
    <audio ref="audioRef" :src="src" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMeta" />

    <div class="audio-main">
      <div class="audio-info">
        <div class="audio-title">{{ title }}</div>
        <div class="audio-subtitle" v-if="artist || album">
          <span v-if="artist">{{ artist }}</span>
          <span v-if="artist && album"> · </span>
          <span v-if="album">{{ album }}</span>
        </div>
      </div>

      <div class="audio-controls">
        <el-button circle size="large" @click="togglePlay">
          <el-icon v-if="!playing"><video-play /></el-icon>
          <el-icon v-else><video-pause /></el-icon>
        </el-button>

        <div class="progress-wrapper">
          <span class="time-text">{{ formatTime(currentTime) }}</span>
          <el-slider
            v-model="progress"
            :min="0"
            :max="100"
            :show-tooltip="false"
            @change="onSeek"
          />
          <span class="time-text">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <div class="audio-extra">
        <div class="volume-wrapper">
          <el-icon class="volume-icon"><volume-up /></el-icon>
          <el-slider
            v-model="volume"
            :min="0"
            :max="100"
            :show-tooltip="false"
            @input="onVolumeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { VideoPlay, VideoPause, VolumeUp } from '@element-plus/icons-vue';

const props = defineProps<{
  src: string;
  title?: string;
  artist?: string;
  album?: string;
  autoplay?: boolean;
}>();

const audioRef = ref<HTMLAudioElement | null>(null);
const playing = ref(false);
const duration = ref(0);
const currentTime = ref(0);
const progress = ref(0);
const volume = ref(80);

const togglePlay = () => {
  const audio = audioRef.value;
  if (!audio) return;
  if (playing.value) {
    audio.pause();
  } else {
    audio.play();
  }
};

const onTimeUpdate = () => {
  const audio = audioRef.value;
  if (!audio) return;
  currentTime.value = audio.currentTime;
  duration.value = audio.duration || 0;
  progress.value = duration.value ? (audio.currentTime / duration.value) * 100 : 0;
};

const onLoadedMeta = () => {
  const audio = audioRef.value;
  if (!audio) return;
  duration.value = audio.duration || 0;
  if (props.autoplay) {
    audio.play();
  }
};

const onSeek = (val: number) => {
  const audio = audioRef.value;
  if (!audio || !duration.value) return;
  const target = (val / 100) * duration.value;
  audio.currentTime = target;
};

const onVolumeChange = (val: number) => {
  const audio = audioRef.value;
  if (!audio) return;
  audio.volume = val / 100;
};

const formatTime = (time: number) => {
  if (!time || isNaN(time)) return '00:00';
  const m = Math.floor(time / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(time % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
};

watch(playing, val => {
  const audio = audioRef.value;
  if (!audio) return;
  if (val && audio.paused) {
    audio.play();
  } else if (!val && !audio.paused) {
    audio.pause();
  }
});

onMounted(() => {
  const audio = audioRef.value;
  if (!audio) return;
  audio.volume = volume.value / 100;
  audio.addEventListener('play', () => (playing.value = true));
  audio.addEventListener('pause', () => (playing.value = false));
});

onBeforeUnmount(() => {
  const audio = audioRef.value;
  if (!audio) return;
  audio.pause();
});
</script>

<style scoped lang="scss">
.audio-player {
  width: 100%;
  padding: 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1f2933, #111827);
  color: #f9fafb;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.4);

  .audio-main {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .audio-info {
    .audio-title {
      font-size: 18px;
      font-weight: 600;
    }

    .audio-subtitle {
      margin-top: 4px;
      font-size: 13px;
      color: #9ca3af;
    }
  }

  .audio-controls {
    display: flex;
    align-items: center;
    gap: 16px;

    .progress-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;

      .time-text {
        font-size: 12px;
        color: #d1d5db;
        width: 42px;
        text-align: center;
      }
    }
  }

  .audio-extra {
    display: flex;
    justify-content: flex-end;

    .volume-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 200px;

      .volume-icon {
        font-size: 18px;
        color: #e5e7eb;
      }
    }
  }
}
</style>
