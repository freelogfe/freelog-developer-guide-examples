<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'
import { open } from '@tauri-apps/api/shell'

// 响应式数据
const activeTab = ref('permissions')
const currentPath = ref('')
const files = ref<any[]>([])
const filePath = ref('')
const fileContent = ref('')
const apiUrl = ref('')
const apiResponse = ref<any>(null)
const shortcutKey = ref('')
const registeredShortcuts = ref<string[]>([])
const showSystemInfo = ref(false)
const systemInfo = ref({
  platform: '',
  version: '',
  arch: '',
  memory: 0
})

// 方法
const greet = async () => {
  const response = await invoke('greet', { name: 'Tauri 2' })
  console.log(response)
}

const showNotification = async () => {
  try {
    await invoke('show_notification', {
      title: 'Tauri 2 通知',
      body: '这是一个来自 Tauri 2 的通知！'
    })
  } catch (error) {
    console.error('显示通知失败:', error)
  }
}

const getSystemInfo = async () => {
  try {
    systemInfo.value = await invoke('get_system_info')
    showSystemInfo.value = true
  } catch (error) {
    console.error('获取系统信息失败:', error)
  }
}

const testFilePermission = async () => {
  try {
    const result = await invoke('read_directory', { path: '.' })
    console.log('文件权限测试成功:', result)
    alert('文件权限测试成功！')
  } catch (error) {
    console.error('文件权限测试失败:', error)
    alert('文件权限测试失败！')
  }
}

const testNetworkPermission = async () => {
  try {
    const result = await invoke('make_http_request', { 
      url: 'https://jsonplaceholder.typicode.com/posts/1' 
    })
    console.log('网络权限测试成功:', result)
    alert('网络权限测试成功！')
  } catch (error) {
    console.error('网络权限测试失败:', error)
    alert('网络权限测试失败！')
  }
}

const testSystemPermission = async () => {
  try {
    await invoke('show_notification', {
      title: '系统权限测试',
      body: '系统权限测试成功！'
    })
    alert('系统权限测试成功！')
  } catch (error) {
    console.error('系统权限测试失败:', error)
    alert('系统权限测试失败！')
  }
}

const browseDirectory = async () => {
  try {
    const path = currentPath.value || '.'
    files.value = await invoke('read_directory', { path })
  } catch (error) {
    console.error('浏览目录失败:', error)
    alert('浏览目录失败！')
  }
}

const readFileContent = async () => {
  try {
    if (!filePath.value) {
      alert('请输入文件路径')
      return
    }
    fileContent.value = await invoke('read_file', { path: filePath.value })
  } catch (error) {
    console.error('读取文件失败:', error)
    alert('读取文件失败！')
  }
}

const writeFileContent = async () => {
  try {
    if (!filePath.value || !fileContent.value) {
      alert('请输入文件路径和内容')
      return
    }
    await invoke('write_file', { 
      path: filePath.value, 
      content: fileContent.value 
    })
    alert('文件写入成功！')
  } catch (error) {
    console.error('写入文件失败:', error)
    alert('写入文件失败！')
  }
}

const makeRequest = async () => {
  try {
    if (!apiUrl.value) {
      alert('请输入API URL')
      return
    }
    apiResponse.value = await invoke('make_http_request', { url: apiUrl.value })
  } catch (error) {
    console.error('请求失败:', error)
    alert('请求失败！')
  }
}

const registerShortcut = async () => {
  try {
    if (!shortcutKey.value) {
      alert('请输入快捷键')
      return
    }
    await invoke('register_global_shortcut', { shortcut: shortcutKey.value })
    registeredShortcuts.value.push(shortcutKey.value)
    shortcutKey.value = ''
    alert('快捷键注册成功！')
  } catch (error) {
    console.error('注册快捷键失败:', error)
    alert('注册快捷键失败！')
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 生命周期
onMounted(() => {
  greet()
})
</script>

<template>
  <div id="app">
    <header class="header">
      <h1>🚀 Tauri 2 学习演示</h1>
      <div class="header-actions">
        <button @click="showNotification" class="btn btn-primary">
          显示通知
        </button>
        <button @click="getSystemInfo" class="btn btn-secondary">
          系统信息
        </button>
      </div>
    </header>

    <main class="main">
      <div class="sidebar">
        <nav class="nav">
          <h3>功能模块</h3>
          <ul>
            <li>
              <button @click="activeTab = 'permissions'" 
                      :class="{ active: activeTab === 'permissions' }">
                🔐 权限管理
              </button>
            </li>
            <li>
              <button @click="activeTab = 'plugins'" 
                      :class="{ active: activeTab === 'plugins' }">
                🔌 插件开发
              </button>
            </li>
            <li>
              <button @click="activeTab = 'filesystem'" 
                      :class="{ active: activeTab === 'filesystem' }">
                📁 文件系统
              </button>
            </li>
            <li>
              <button @click="activeTab = 'network'" 
                      :class="{ active: activeTab === 'network' }">
                🌐 网络请求
              </button>
            </li>
            <li>
              <button @click="activeTab = 'shortcuts'" 
                      :class="{ active: activeTab === 'shortcuts' }">
                ⌨️ 全局快捷键
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div class="content">
        <!-- 权限管理模块 -->
        <div v-if="activeTab === 'permissions'" class="tab-content">
          <h2>🔐 权限管理演示</h2>
          <div class="permission-grid">
            <div class="permission-card">
              <h3>文件系统权限</h3>
              <p>允许访问文档、桌面、下载等目录</p>
              <button @click="testFilePermission" class="btn btn-primary">
                测试文件权限
              </button>
            </div>
            <div class="permission-card">
              <h3>网络权限</h3>
              <p>允许访问指定的API端点</p>
              <button @click="testNetworkPermission" class="btn btn-primary">
                测试网络权限
              </button>
            </div>
            <div class="permission-card">
              <h3>系统权限</h3>
              <p>允许系统级操作如通知、快捷键等</p>
              <button @click="testSystemPermission" class="btn btn-primary">
                测试系统权限
              </button>
            </div>
          </div>
        </div>

        <!-- 插件开发模块 -->
        <div v-if="activeTab === 'plugins'" class="tab-content">
          <h2>🔌 插件开发演示</h2>
          <div class="plugin-demo">
            <h3>自定义插件示例</h3>
            <p>演示如何创建和使用自定义插件</p>
            <div class="plugin-features">
              <div class="feature">
                <h4>插件初始化</h4>
                <p>插件在应用启动时自动初始化</p>
                <code>CustomPlugin::initialize()</code>
              </div>
              <div class="feature">
                <h4>插件注册</h4>
                <p>通过 Builder 注册插件</p>
                <code>.plugin(CustomPlugin)</code>
              </div>
              <div class="feature">
                <h4>插件生命周期</h4>
                <p>管理插件的加载和卸载</p>
                <code>impl Plugin for CustomPlugin</code>
              </div>
            </div>
          </div>
        </div>

        <!-- 文件系统模块 -->
        <div v-if="activeTab === 'filesystem'" class="tab-content">
          <h2>📁 文件系统操作</h2>
          <div class="file-operations">
            <div class="operation-section">
              <h3>目录浏览</h3>
              <div class="input-group">
                <input v-model="currentPath" placeholder="输入路径" class="input" />
                <button @click="browseDirectory" class="btn btn-primary">浏览</button>
              </div>
              <div class="file-list" v-if="files.length > 0">
                <div v-for="file in files" :key="file.path" class="file-item">
                  <span :class="file.is_dir ? 'folder' : 'file'">
                    {{ file.is_dir ? '📁' : '📄' }} {{ file.name }}
                  </span>
                  <span class="file-size">{{ formatFileSize(file.size) }}</span>
                </div>
              </div>
            </div>
            
            <div class="operation-section">
              <h3>文件操作</h3>
              <div class="input-group">
                <input v-model="filePath" placeholder="文件路径" class="input" />
                <button @click="readFileContent" class="btn btn-secondary">读取</button>
                <button @click="writeFileContent" class="btn btn-primary">写入</button>
              </div>
              <textarea v-model="fileContent" placeholder="文件内容" class="textarea"></textarea>
            </div>
          </div>
        </div>

        <!-- 网络请求模块 -->
        <div v-if="activeTab === 'network'" class="tab-content">
          <h2>🌐 网络请求演示</h2>
          <div class="network-demo">
            <div class="api-tester">
              <h3>API 测试器</h3>
              <div class="input-group">
                <input v-model="apiUrl" placeholder="输入API URL" class="input" />
                <button @click="makeRequest" class="btn btn-primary">发送请求</button>
              </div>
              
              <div class="preset-apis">
                <h4>预设API</h4>
                <div class="api-buttons">
                  <button @click="apiUrl = 'https://jsonplaceholder.typicode.com/posts/1'" class="btn btn-small">
                    JSONPlaceholder
                  </button>
                  <button @click="apiUrl = 'https://httpbin.org/json'" class="btn btn-small">
                    HTTPBin
                  </button>
                  <button @click="apiUrl = 'https://api.github.com/users/tauri'" class="btn btn-small">
                    GitHub API
                  </button>
                </div>
              </div>
              
              <div class="response-area" v-if="apiResponse">
                <h4>响应结果</h4>
                <pre class="response-json">{{ JSON.stringify(apiResponse, null, 2) }}</pre>
              </div>
            </div>
          </div>
        </div>

        <!-- 全局快捷键模块 -->
        <div v-if="activeTab === 'shortcuts'" class="tab-content">
          <h2>⌨️ 全局快捷键</h2>
          <div class="shortcut-demo">
            <h3>快捷键注册</h3>
            <div class="input-group">
              <input v-model="shortcutKey" placeholder="快捷键 (如: Ctrl+Shift+A)" class="input" />
              <button @click="registerShortcut" class="btn btn-primary">注册</button>
            </div>
            
            <div class="shortcut-info">
              <h4>常用快捷键格式</h4>
              <ul>
                <li><code>Ctrl+Shift+A</code> - 组合键</li>
                <li><code>F1</code> - 功能键</li>
                <li><code>Ctrl+Alt+Delete</code> - 系统键</li>
              </ul>
            </div>
            
            <div class="registered-shortcuts">
              <h4>已注册的快捷键</h4>
              <ul>
                <li v-for="shortcut in registeredShortcuts" :key="shortcut">
                  {{ shortcut }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 系统信息弹窗 -->
    <div v-if="showSystemInfo" class="modal">
      <div class="modal-content">
        <h3>系统信息</h3>
        <div class="system-info">
          <p><strong>平台:</strong> {{ systemInfo.platform }}</p>
          <p><strong>版本:</strong> {{ systemInfo.version }}</p>
          <p><strong>架构:</strong> {{ systemInfo.arch }}</p>
          <p><strong>内存:</strong> {{ systemInfo.memory }} MB</p>
        </div>
        <button @click="showSystemInfo = false" class="btn btn-primary">关闭</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  background: white;
  border-right: 1px solid #e0e0e0;
  padding: 1rem;
}

.nav h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
}

.nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav li {
  margin-bottom: 0.5rem;
}

.nav button {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav button:hover {
  background: #f0f0f0;
}

.nav button.active {
  background: #667eea;
  color: white;
}

.content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.tab-content h2 {
  margin: 0 0 2rem 0;
  color: #333;
  font-size: 1.8rem;
}

.permission-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.permission-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
}

.permission-card h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.permission-card p {
  margin: 0 0 1.5rem 0;
  color: #666;
  line-height: 1.5;
}

.plugin-demo {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.plugin-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.feature {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

.feature h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.feature p {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.feature code {
  background: #e0e0e0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: 'Courier New', monospace;
}

.file-operations {
  display: grid;
  gap: 2rem;
}

.operation-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.operation-section h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}

.textarea {
  width: 100%;
  height: 150px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  resize: vertical;
}

.file-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #f9f9f9;
}

.file-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.file-item:last-child {
  border-bottom: none;
}

.folder {
  color: #667eea;
  font-weight: 500;
}

.file {
  color: #333;
}

.file-size {
  color: #666;
  font-size: 0.8rem;
}

.network-demo {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.api-tester h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.preset-apis {
  margin: 1.5rem 0;
}

.preset-apis h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.api-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.response-area {
  margin-top: 1.5rem;
}

.response-area h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.response-json {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
}

.shortcut-demo {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.shortcut-demo h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.shortcut-info {
  margin: 1.5rem 0;
}

.shortcut-info h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.shortcut-info ul {
  list-style: none;
  padding: 0;
}

.shortcut-info li {
  margin-bottom: 0.25rem;
}

.shortcut-info code {
  background: #e0e0e0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.registered-shortcuts {
  margin-top: 1.5rem;
}

.registered-shortcuts h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.registered-shortcuts ul {
  list-style: none;
  padding: 0;
}

.registered-shortcuts li {
  padding: 0.5rem;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 0.25rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
}

.modal-content h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.system-info p {
  margin: 0.5rem 0;
  color: #666;
}

.system-info strong {
  color: #333;
}
</style>