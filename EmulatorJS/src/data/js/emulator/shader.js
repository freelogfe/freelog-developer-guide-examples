/**
 * 模拟器着色器管理模块
 */
class ShaderManager {
    constructor(options = {}) {
        this.emulator = options.emulator || null;
        this.shaders = [];
        this.activeShader = null;
        this.defaultShader = null;
        this.shaderPath = options.shaderPath || 'shaders/';
        this.shaderStorage = null;
        this.isShaderSupported = false;
        this.canvas = null;
        this.gl = null;
        this.shaderProgram = null;
        this.shaderVariables = {};
        this.texture = null;
        this.framebuffer = null;
        this.isInitialized = false;
    }

    // 初始化着色器管理器
    init() {
        console.log('Initializing shader manager...');
        this.checkShaderSupport();
        this.setupCanvas();
        this.setupShaderStorage();
        this.loadShaders();
        this.isInitialized = true;
    }

    // 检查着色器支持
    checkShaderSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            this.isShaderSupported = !!gl;
            
            if (this.isShaderSupported) {
                console.log('WebGL is supported. Shaders can be used.');
            } else {
                console.warn('WebGL is not supported. Shaders will be disabled.');
            }
        } catch (error) {
            console.error('Error checking WebGL support:', error);
            this.isShaderSupported = false;
        }
    }

    // 设置画布
    setupCanvas() {
        if (this.emulator && this.emulator.elements) {
            this.canvas = this.emulator.elements.canvas;
        }
        
        if (!this.canvas) {
            console.warn('No canvas found for shader processing');
        }
    }

    // 设置着色器存储
    setupShaderStorage() {
        if (this.emulator && this.emulator.storage) {
            this.shaderStorage = this.emulator.storage;
        } else {
            this.shaderStorage = {
                get: (key, defaultValue = null) => {
                    try {
                        const value = localStorage.getItem(`emulator.shader.${key}`);
                        return value ? JSON.parse(value) : defaultValue;
                    } catch (e) {
                        return defaultValue;
                    }
                },
                set: (key, value) => {
                    try {
                        localStorage.setItem(`emulator.shader.${key}`, JSON.stringify(value));
                        return true;
                    } catch (e) {
                        return false;
                    }
                }
            };
        }
    }

    // 加载着色器列表
    loadShaders() {
        // 预定义的着色器列表
        this.shaders = [
            {
                name: 'None',
                filename: '',
                description: 'No shader (default)',
                type: 'default'
            },
            {
                name: 'CRT',
                filename: 'crt.glsl',
                description: 'Cathode Ray Tube effect',
                type: 'filter'
            },
            {
                name: 'LCD',
                filename: 'lcd.glsl',
                description: 'Liquid Crystal Display effect',
                type: 'filter'
            },
            {
                name: 'Scanlines',
                filename: 'scanlines.glsl',
                description: 'Classic scanlines effect',
                type: 'filter'
            },
            {
                name: 'Curvature',
                filename: 'curvature.glsl',
                description: 'Screen curvature effect',
                type: 'distortion'
            },
            {
                name: 'HDR',
                filename: 'hdr.glsl',
                description: 'High Dynamic Range effect',
                type: 'enhancement'
            },
            {
                name: 'Pixel Perfect',
                filename: 'pixelperfect.glsl',
                description: 'Sharp pixel rendering',
                type: 'filter'
            },
            {
                name: 'Vignette',
                filename: 'vignette.glsl',
                description: 'Corner darkening effect',
                type: 'filter'
            },
            {
                name: 'Sharpen',
                filename: 'sharpen.glsl',
                description: 'Image sharpening',
                type: 'enhancement'
            },
            {
                name: 'Blur',
                filename: 'blur.glsl',
                description: 'Smooth blurring effect',
                type: 'filter'
            }
        ];
        
        // 设置默认着色器
        this.defaultShader = this.shaders[0];
        
        // 加载用户保存的着色器
        this.loadUserShaders();
        
        // 加载上次使用的着色器
        this.loadLastUsedShader();
        
        console.log(`Loaded ${this.shaders.length} shaders`);
    }

    // 加载用户自定义着色器
    loadUserShaders() {
        try {
            const userShaders = this.shaderStorage.get('userShaders', []);
            if (Array.isArray(userShaders)) {
                userShaders.forEach(shader => {
                    // 确保着色器有必要的属性
                    if (shader.name && shader.filename) {
                        this.shaders.push({
                            name: shader.name,
                            filename: shader.filename,
                            description: shader.description || 'User custom shader',
                            type: shader.type || 'custom',
                            isUserDefined: true
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error loading user shaders:', error);
        }
    }

    // 加载上次使用的着色器
    loadLastUsedShader() {
        try {
            const lastShaderName = this.shaderStorage.get('lastShader', 'None');
            const lastShader = this.shaders.find(shader => shader.name === lastShaderName);
            
            if (lastShader) {
                // 注意：这里只是记录上次使用的着色器，不会自动应用
                console.log(`Last used shader: ${lastShaderName}`);
            }
        } catch (error) {
            console.error('Error loading last used shader:', error);
        }
    }

    // 保存上次使用的着色器
    saveLastUsedShader(shaderName) {
        this.shaderStorage.set('lastShader', shaderName);
    }

    // 获取所有着色器
    getAllShaders() {
        return [...this.shaders];
    }

    // 获取着色器类型列表
    getShaderTypes() {
        const types = new Set();
        this.shaders.forEach(shader => {
            types.add(shader.type);
        });
        return Array.from(types);
    }

    // 根据类型获取着色器
    getShadersByType(type) {
        return this.shaders.filter(shader => shader.type === type);
    }

    // 获取当前活动着色器
    getActiveShader() {
        return this.activeShader || this.defaultShader;
    }

    // 启用着色器
    enableShader(shaderName) {
        if (!this.isShaderSupported || !this.canvas) {
            console.warn('Shader cannot be enabled: WebGL not supported or no canvas');
            return false;
        }
        
        try {
            const shader = this.shaders.find(s => s.name === shaderName);
            
            if (!shader) {
                console.error(`Shader not found: ${shaderName}`);
                return false;
            }
            
            // 如果选择的是默认着色器（无着色器），则禁用当前着色器
            if (shader.name === 'None' || shader.filename === '') {
                this.disableShader();
                return true;
            }
            
            // 保存当前选择的着色器
            this.saveLastUsedShader(shaderName);
            
            // 初始化WebGL上下文
            if (!this.initWebGL()) {
                return false;
            }
            
            // 加载并编译着色器程序
            if (!this.loadShaderProgram(shader.filename)) {
                return false;
            }
            
            this.activeShader = shader;
            console.log(`Shader enabled: ${shaderName}`);
            
            // 如果有模拟器实例，通知它着色器已更改
            if (this.emulator && typeof this.emulator.onShaderChanged === 'function') {
                this.emulator.onShaderChanged(shader);
            }
            
            return true;
        } catch (error) {
            console.error(`Error enabling shader ${shaderName}:`, error);
            return false;
        }
    }

    // 禁用着色器
    disableShader() {
        try {
            this.activeShader = null;
            
            // 清理WebGL资源
            this.cleanupWebGL();
            
            console.log('Shader disabled');
            
            // 如果有模拟器实例，通知它着色器已更改
            if (this.emulator && typeof this.emulator.onShaderChanged === 'function') {
                this.emulator.onShaderChanged(null);
            }
            
            return true;
        } catch (error) {
            console.error('Error disabling shader:', error);
            return false;
        }
    }

    // 初始化WebGL上下文
    initWebGL() {
        if (this.gl) {
            return true;
        }
        
        try {
            this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
            
            if (!this.gl) {
                console.error('Failed to initialize WebGL');
                return false;
            }
            
            // 设置WebGL上下文属性
            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.gl.enable(this.gl.TEXTURE_2D);
            
            return true;
        } catch (error) {
            console.error('Error initializing WebGL:', error);
            this.gl = null;
            return false;
        }
    }

    // 加载着色器程序
    loadShaderProgram(shaderFilename) {
        return new Promise((resolve, reject) => {
            try {
                // 构建着色器文件的完整路径
                const vertexShaderPath = this.getShaderPath('vertex.glsl');
                const fragmentShaderPath = this.getShaderPath(shaderFilename);
                
                // 并行加载顶点着色器和片段着色器
                Promise.all([
                    this.loadShaderFile(vertexShaderPath, 'vertex'),
                    this.loadShaderFile(fragmentShaderPath, 'fragment')
                ]).then(([vertexShaderSource, fragmentShaderSource]) => {
                    // 创建着色器程序
                    const program = this.createShaderProgram(vertexShaderSource, fragmentShaderSource);
                    
                    if (program) {
                        this.shaderProgram = program;
                        this.setupShaderVariables();
                        this.setupTexture();
                        this.setupFramebuffer();
                        resolve(true);
                    } else {
                        reject(new Error('Failed to create shader program'));
                    }
                }).catch(error => {
                    console.error('Error loading shader files:', error);
                    reject(error);
                });
            } catch (error) {
                console.error('Error loading shader program:', error);
                reject(error);
            }
        });
    }

    // 获取着色器文件路径
    getShaderPath(filename) {
        // 确保路径以斜杠结尾
        const basePath = this.shaderPath.endsWith('/') ? this.shaderPath : `${this.shaderPath}/`;
        return `${basePath}${filename}`;
    }

    // 加载着色器文件
    loadShaderFile(path, type) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', path, true);
            xhr.responseType = 'text';
            
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    // 如果请求失败，使用默认着色器代码
                    console.warn(`Failed to load ${type} shader from ${path}, using default`);
                    resolve(this.getDefaultShaderCode(type));
                }
            };
            
            xhr.onerror = () => {
                console.warn(`Network error loading ${type} shader from ${path}, using default`);
                resolve(this.getDefaultShaderCode(type));
            };
            
            xhr.send();
        });
    }

    // 获取默认着色器代码
    getDefaultShaderCode(type) {
        if (type === 'vertex') {
            return `
                attribute vec2 a_position;
                attribute vec2 a_texCoord;
                varying vec2 v_texCoord;
                
                void main() {
                    gl_Position = vec4(a_position, 0.0, 1.0);
                    v_texCoord = a_texCoord;
                }
            `;
        } else if (type === 'fragment') {
            return `
                precision mediump float;
                varying vec2 v_texCoord;
                uniform sampler2D u_image;
                
                void main() {
                    gl_FragColor = texture2D(u_image, v_texCoord);
                }
            `;
        }
        return '';
    }

    // 创建着色器程序
    createShaderProgram(vertexSource, fragmentSource) {
        try {
            const gl = this.gl;
            
            // 创建顶点着色器
            const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexSource);
            if (!vertexShader) {
                return null;
            }
            
            // 创建片段着色器
            const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentSource);
            if (!fragmentShader) {
                gl.deleteShader(vertexShader);
                return null;
            }
            
            // 创建着色器程序
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            
            // 检查链接是否成功
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error('Shader program linking failed:', gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
                gl.deleteShader(fragmentShader);
                gl.deleteShader(vertexShader);
                return null;
            }
            
            // 使用着色器程序
            gl.useProgram(program);
            
            // 删除不再需要的着色器
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            
            return program;
        } catch (error) {
            console.error('Error creating shader program:', error);
            return null;
        }
    }

    // 创建单个着色器
    createShader(type, source) {
        try {
            const gl = this.gl;
            const shader = gl.createShader(type);
            
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            
            // 检查编译是否成功
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(`Shader compilation failed:`, gl.getShaderInfoLog(shader));
                console.error('Shader source:', source);
                gl.deleteShader(shader);
                return null;
            }
            
            return shader;
        } catch (error) {
            console.error('Error creating shader:', error);
            return null;
        }
    }

    // 设置着色器变量
    setupShaderVariables() {
        try {
            const gl = this.gl;
            const program = this.shaderProgram;
            
            // 获取属性和uniform变量的位置
            this.shaderVariables.positionLocation = gl.getAttribLocation(program, 'a_position');
            this.shaderVariables.texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
            this.shaderVariables.imageLocation = gl.getUniformLocation(program, 'u_image');
            this.shaderVariables.resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
            this.shaderVariables.timeLocation = gl.getUniformLocation(program, 'u_time');
            
            // 设置顶点缓冲区
            this.setupBuffers();
        } catch (error) {
            console.error('Error setting up shader variables:', error);
        }
    }

    // 设置缓冲区
    setupBuffers() {
        try {
            const gl = this.gl;
            
            // 创建位置缓冲区
            this.positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            
            // 位置数据（两个三角形组成一个矩形）
            const positions = [
                -1.0, -1.0,
                 1.0, -1.0,
                -1.0,  1.0,
                -1.0,  1.0,
                 1.0, -1.0,
                 1.0,  1.0
            ];
            
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
            
            // 创建纹理坐标缓冲区
            this.texCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
            
            // 纹理坐标数据
            const texCoords = [
                0.0, 0.0,
                1.0, 0.0,
                0.0, 1.0,
                0.0, 1.0,
                1.0, 0.0,
                1.0, 1.0
            ];
            
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
        } catch (error) {
            console.error('Error setting up buffers:', error);
        }
    }

    // 设置纹理
    setupTexture() {
        try {
            const gl = this.gl;
            
            // 创建纹理
            this.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            
            // 设置纹理参数
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            
            // 设置纹理图像（初始为空）
            const width = this.canvas.width || 320;
            const height = this.canvas.height || 240;
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        } catch (error) {
            console.error('Error setting up texture:', error);
        }
    }

    // 设置帧缓冲区
    setupFramebuffer() {
        try {
            const gl = this.gl;
            
            // 创建帧缓冲区
            this.framebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
            
            // 将纹理附加到帧缓冲区
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
            
            // 检查帧缓冲区是否完整
            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
                console.error('Framebuffer is not complete');
            }
            
            // 解绑帧缓冲区
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } catch (error) {
            console.error('Error setting up framebuffer:', error);
        }
    }

    // 应用着色器到画布
    applyShader() {
        if (!this.isShaderSupported || !this.activeShader || !this.gl || !this.shaderProgram) {
            return;
        }
        
        try {
            const gl = this.gl;
            const program = this.shaderProgram;
            
            // 使用着色器程序
            gl.useProgram(program);
            
            // 绑定纹理
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(this.shaderVariables.imageLocation, 0);
            
            // 设置分辨率
            if (this.shaderVariables.resolutionLocation) {
                gl.uniform2f(this.shaderVariables.resolutionLocation, this.canvas.width, this.canvas.height);
            }
            
            // 设置时间（如果着色器需要）
            if (this.shaderVariables.timeLocation) {
                gl.uniform1f(this.shaderVariables.timeLocation, performance.now() / 1000);
            }
            
            // 启用位置属性
            gl.enableVertexAttribArray(this.shaderVariables.positionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.vertexAttribPointer(this.shaderVariables.positionLocation, 2, gl.FLOAT, false, 0, 0);
            
            // 启用纹理坐标属性
            gl.enableVertexAttribArray(this.shaderVariables.texCoordLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
            gl.vertexAttribPointer(this.shaderVariables.texCoordLocation, 2, gl.FLOAT, false, 0, 0);
            
            // 绘制
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        } catch (error) {
            console.error('Error applying shader:', error);
        }
    }

    // 更新着色器纹理
    updateTexture(imageData) {
        if (!this.isShaderSupported || !this.gl || !this.texture) {
            return;
        }
        
        try {
            const gl = this.gl;
            
            // 绑定纹理
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            
            // 更新纹理数据
            if (imageData instanceof ImageData) {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
            } else if (imageData instanceof HTMLCanvasElement || imageData instanceof HTMLImageElement) {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
            }
        } catch (error) {
            console.error('Error updating texture:', error);
        }
    }

    // 调整着色器尺寸
    resize(width, height) {
        if (!this.isShaderSupported || !this.gl) {
            return;
        }
        
        try {
            const gl = this.gl;
            
            // 更新WebGL视口
            gl.viewport(0, 0, width, height);
            
            // 如果有帧缓冲区，更新其大小
            if (this.framebuffer && this.texture) {
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            }
        } catch (error) {
            console.error('Error resizing shader:', error);
        }
    }

    // 清理WebGL资源
    cleanupWebGL() {
        try {
            const gl = this.gl;
            
            if (gl) {
                // 删除着色器程序
                if (this.shaderProgram) {
                    gl.deleteProgram(this.shaderProgram);
                    this.shaderProgram = null;
                }
                
                // 删除纹理
                if (this.texture) {
                    gl.deleteTexture(this.texture);
                    this.texture = null;
                }
                
                // 删除帧缓冲区
                if (this.framebuffer) {
                    gl.deleteFramebuffer(this.framebuffer);
                    this.framebuffer = null;
                }
                
                // 删除缓冲区
                if (this.positionBuffer) {
                    gl.deleteBuffer(this.positionBuffer);
                    this.positionBuffer = null;
                }
                
                if (this.texCoordBuffer) {
                    gl.deleteBuffer(this.texCoordBuffer);
                    this.texCoordBuffer = null;
                }
                
                // 清空变量
                this.shaderVariables = {};
            }
        } catch (error) {
            console.error('Error cleaning up WebGL resources:', error);
        }
    }

    // 添加用户自定义着色器
    addUserShader(name, filename, description = '', type = 'custom') {
        try {
            // 检查是否已存在同名着色器
            const existingShaderIndex = this.shaders.findIndex(shader => shader.name === name);
            
            if (existingShaderIndex >= 0) {
                // 更新现有着色器
                this.shaders[existingShaderIndex] = {
                    name,
                    filename,
                    description,
                    type,
                    isUserDefined: true
                };
            } else {
                // 添加新着色器
                this.shaders.push({
                    name,
                    filename,
                    description,
                    type,
                    isUserDefined: true
                });
            }
            
            // 保存用户着色器
            this.saveUserShaders();
            
            console.log(`User shader added: ${name}`);
            return true;
        } catch (error) {
            console.error('Error adding user shader:', error);
            return false;
        }
    }

    // 删除用户自定义着色器
    removeUserShader(name) {
        try {
            const index = this.shaders.findIndex(shader => 
                shader.name === name && shader.isUserDefined
            );
            
            if (index >= 0) {
                // 如果删除的是当前活动着色器，则禁用着色器
                if (this.activeShader && this.activeShader.name === name) {
                    this.disableShader();
                }
                
                // 从列表中删除
                this.shaders.splice(index, 1);
                
                // 保存用户着色器
                this.saveUserShaders();
                
                console.log(`User shader removed: ${name}`);
                return true;
            }
            
            console.warn(`Cannot remove shader: ${name} is not a user-defined shader`);
            return false;
        } catch (error) {
            console.error('Error removing user shader:', error);
            return false;
        }
    }

    // 保存用户着色器
    saveUserShaders() {
        try {
            const userShaders = this.shaders.filter(shader => shader.isUserDefined);
            this.shaderStorage.set('userShaders', userShaders);
        } catch (error) {
            console.error('Error saving user shaders:', error);
        }
    }

    // 获取着色器支持状态
    isSupported() {
        return this.isShaderSupported;
    }

    // 销毁着色器管理器
    destroy() {
        try {
            // 禁用着色器
            this.disableShader();
            
            // 清理WebGL资源
            this.cleanupWebGL();
            
            // 清空着色器列表
            this.shaders = [];
            this.activeShader = null;
            this.defaultShader = null;
            
            console.log('Shader manager destroyed');
        } catch (error) {
            console.error('Error destroying shader manager:', error);
        }
    }
}

// 导出模块
export default ShaderManager;

// 为了兼容旧的全局变量访问方式
if (typeof window !== 'undefined') {
    window.ShaderManager = ShaderManager;
}