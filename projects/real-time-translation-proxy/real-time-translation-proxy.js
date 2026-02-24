// Real-Time Translation Proxy - JavaScript

class TranslationProxy {
    constructor() {
        this.isRunning = false;
        this.cache = new Map();
        this.history = [];
        this.settings = {
            realTimeAnalytics: true,
            autoSaveSettings: true,
            maxCacheSize: 100,
            logRetention: 7,
            apiKeys: {
                google: '',
                microsoft: '',
                deepl: ''
            }
        };
        this.charts = {};
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.initializeCharts();
        this.updateDashboard();
        this.loadHistory();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(e.target.getAttribute('href').substring(1));
            });
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Proxy controls
        document.getElementById('start-proxy').addEventListener('click', () => {
            this.startProxy();
        });

        document.getElementById('stop-proxy').addEventListener('click', () => {
            this.stopProxy();
        });

        // Translation test
        document.getElementById('test-translate').addEventListener('click', () => {
            this.testTranslation();
        });

        // Settings
        document.getElementById('real-time-analytics').addEventListener('change', (e) => {
            this.settings.realTimeAnalytics = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('auto-save-settings').addEventListener('change', (e) => {
            this.settings.autoSaveSettings = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('max-cache-size').addEventListener('change', (e) => {
            this.settings.maxCacheSize = parseInt(e.target.value);
            this.saveSettings();
        });

        document.getElementById('log-retention').addEventListener('change', (e) => {
            this.settings.logRetention = parseInt(e.target.value);
            this.saveSettings();
        });

        // API Keys
        document.getElementById('google-api-key').addEventListener('change', (e) => {
            this.settings.apiKeys.google = e.target.value;
            this.saveSettings();
        });

        document.getElementById('microsoft-api-key').addEventListener('change', (e) => {
            this.settings.apiKeys.microsoft = e.target.value;
            this.saveSettings();
        });

        document.getElementById('deepl-api-key').addEventListener('change', (e) => {
            this.settings.apiKeys.deepl = e.target.value;
            this.saveSettings();
        });

        // Data management
        document.getElementById('clear-cache').addEventListener('click', () => {
            this.clearCache();
        });

        document.getElementById('clear-history').addEventListener('click', () => {
            this.clearHistory();
        });

        document.getElementById('export-settings').addEventListener('click', () => {
            this.exportSettings();
        });

        document.getElementById('import-settings').addEventListener('click', () => {
            this.importSettings();
        });

        document.getElementById('import-file').addEventListener('change', (e) => {
            this.handleImport(e.target.files[0]);
        });
    }

    switchSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
        });

        document.getElementById(sectionId).classList.add('active');
        document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
    }

    toggleTheme() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('translationProxySettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
        }

        // Apply settings to UI
        document.getElementById('real-time-analytics').checked = this.settings.realTimeAnalytics;
        document.getElementById('auto-save-settings').checked = this.settings.autoSaveSettings;
        document.getElementById('max-cache-size').value = this.settings.maxCacheSize;
        document.getElementById('log-retention').value = this.settings.logRetention;
        document.getElementById('google-api-key').value = this.settings.apiKeys.google;
        document.getElementById('microsoft-api-key').value = this.settings.apiKeys.microsoft;
        document.getElementById('deepl-api-key').value = this.settings.apiKeys.deepl;
    }

    saveSettings() {
        localStorage.setItem('translationProxySettings', JSON.stringify(this.settings));
    }

    async startProxy() {
        if (this.isRunning) return;

        const port = document.getElementById('proxy-port').value;
        const targetUrl = document.getElementById('target-url').value;

        if (!targetUrl) {
            alert('Please enter a target URL');
            return;
        }

        this.isRunning = true;
        document.getElementById('start-proxy').disabled = true;
        document.getElementById('stop-proxy').disabled = false;
        document.getElementById('proxy-status').textContent = 'Running';
        document.getElementById('proxy-status').className = 'status-active';

        this.logMessage(`Proxy started on port ${port}, targeting ${targetUrl}`);

        // In a real implementation, this would start a proxy server
        // For demo purposes, we'll simulate proxy activity
        this.startProxySimulation();
    }

    stopProxy() {
        if (!this.isRunning) return;

        this.isRunning = false;
        document.getElementById('start-proxy').disabled = false;
        document.getElementById('stop-proxy').disabled = true;
        document.getElementById('proxy-status').textContent = 'Stopped';
        document.getElementById('proxy-status').className = 'status-inactive';

        this.logMessage('Proxy stopped');
        this.stopProxySimulation();
    }

    startProxySimulation() {
        this.proxyInterval = setInterval(() => {
            if (!this.isRunning) return;

            // Simulate incoming requests
            this.simulateRequest();
        }, 2000 + Math.random() * 3000);
    }

    stopProxySimulation() {
        if (this.proxyInterval) {
            clearInterval(this.proxyInterval);
            this.proxyInterval = null;
        }
    }

    simulateRequest() {
        const urls = [
            'https://example.com/page1',
            'https://example.com/page2',
            'https://api.example.com/data',
            'https://news.example.com/article',
            'https://blog.example.com/post'
        ];

        const url = urls[Math.floor(Math.random() * urls.length)];
        const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'];
        const sourceLang = languages[Math.floor(Math.random() * languages.length)];
        const targetLang = document.getElementById('target-lang').value;

        this.processRequest(url, sourceLang, targetLang);
    }

    async processRequest(url, sourceLang, targetLang) {
        const startTime = Date.now();
        const cacheKey = `${url}:${sourceLang}:${targetLang}`;
        let cached = false;
        let translated = false;

        // Check cache
        if (this.cache.has(cacheKey)) {
            cached = true;
            this.logMessage(`Cache hit for ${url}`);
        } else {
            // Simulate translation
            const mockText = this.generateMockText();
            const translation = await this.translateText(mockText, sourceLang, targetLang);
            this.cache.set(cacheKey, translation);
            translated = true;
            this.logMessage(`Translated ${url} from ${sourceLang} to ${targetLang}`);
        }

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        // Record in history
        this.addToHistory({
            timestamp: new Date().toISOString(),
            url,
            sourceLang,
            targetLang,
            responseTime,
            cached,
            translated
        });

        // Update dashboard
        this.updateDashboard();
    }

    generateMockText() {
        const texts = [
            'Hello world',
            'Welcome to our website',
            'This is a sample text for translation',
            'The quick brown fox jumps over the lazy dog',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            'Thank you for visiting',
            'Please contact us for more information'
        ];
        return texts[Math.floor(Math.random() * texts.length)];
    }

    async translateText(text, sourceLang, targetLang) {
        const engine = document.getElementById('translation-engine').value;

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 500));

        if (engine === 'mock') {
            // Mock translation
            return `[${targetLang}] ${text}`;
        }

        // In a real implementation, this would call actual translation APIs
        // For demo purposes, we'll return mock translations
        const translations = {
            'Hello world': {
                es: 'Hola mundo',
                fr: 'Bonjour le monde',
                de: 'Hallo Welt',
                it: 'Ciao mondo',
                pt: 'Olá mundo',
                ru: 'Привет мир',
                ja: 'こんにちは世界',
                ko: '안녕하세요 세계',
                zh: '你好世界'
            },
            'Welcome to our website': {
                es: 'Bienvenido a nuestro sitio web',
                fr: 'Bienvenue sur notre site web',
                de: 'Willkommen auf unserer Website',
                it: 'Benvenuto nel nostro sito web',
                pt: 'Bem-vindo ao nosso site',
                ru: 'Добро пожаловать на наш сайт',
                ja: '私たちのウェブサイトへようこそ',
                ko: '우리 웹사이트에 오신 것을 환영합니다',
                zh: '欢迎来到我们的网站'
            }
        };

        return translations[text]?.[targetLang] || `[${targetLang}] ${text}`;
    }

    async testTranslation() {
        const input = document.getElementById('test-input').value;
        if (!input.trim()) {
            alert('Please enter text to translate');
            return;
        }

        const sourceLang = document.getElementById('source-lang').value;
        const targetLang = document.getElementById('target-lang').value;

        document.getElementById('test-translate').innerHTML = '<div class="loading"></div> Translating...';
        document.getElementById('test-translate').disabled = true;

        try {
            const translation = await this.translateText(input, sourceLang, targetLang);
            document.getElementById('test-output').value = translation;

            // Record in history
            this.addToHistory({
                timestamp: new Date().toISOString(),
                url: 'test',
                sourceLang,
                targetLang,
                responseTime: 0,
                cached: false,
                translated: true
            });

            this.updateDashboard();
        } catch (error) {
            console.error('Translation error:', error);
            document.getElementById('test-output').value = 'Translation failed';
        } finally {
            document.getElementById('test-translate').innerHTML = '🗣️ Translate';
            document.getElementById('test-translate').disabled = false;
        }
    }

    logMessage(message) {
        const logElement = document.getElementById('request-log');
        const timestamp = new Date().toLocaleTimeString();
        logElement.textContent += `[${timestamp}] ${message}\n`;
        logElement.scrollTop = logElement.scrollHeight;
    }

    addToHistory(entry) {
        this.history.unshift(entry);
        if (this.history.length > 1000) {
            this.history = this.history.slice(0, 1000);
        }
        this.saveHistory();
        this.updateHistoryTable();
        this.updateCharts();
    }

    saveHistory() {
        localStorage.setItem('translationProxyHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('translationProxyHistory');
        if (saved) {
            this.history = JSON.parse(saved);
            this.updateHistoryTable();
        }
    }

    updateHistoryTable() {
        const tbody = document.querySelector('#translation-history tbody');
        tbody.innerHTML = '';

        this.history.slice(0, 20).forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(entry.timestamp).toLocaleString()}</td>
                <td>${entry.sourceLang}</td>
                <td>${entry.targetLang}</td>
                <td>${entry.url === 'test' ? 'Test' : 'API'}</td>
                <td>${entry.responseTime}ms</td>
                <td>${entry.cached ? 'Yes' : 'No'}</td>
            `;
            tbody.appendChild(row);
        });
    }

    updateDashboard() {
        const totalRequests = this.history.length;
        const totalTranslations = this.history.filter(h => h.translated).length;
        const cacheHits = this.history.filter(h => h.cached).length;
        const cacheHitRate = totalRequests > 0 ? ((cacheHits / totalRequests) * 100).toFixed(1) : 0;
        const avgResponseTime = totalRequests > 0 ?
            (this.history.reduce((sum, h) => sum + h.responseTime, 0) / totalRequests).toFixed(0) : 0;

        document.getElementById('total-requests').textContent = totalRequests;
        document.getElementById('total-translations').textContent = totalTranslations;
        document.getElementById('cache-hit-rate').textContent = `${cacheHitRate}%`;
        document.getElementById('avg-response-time').textContent = `${avgResponseTime} ms`;
    }

    initializeCharts() {
        const ctx1 = document.getElementById('translation-chart').getContext('2d');
        this.charts.translation = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Translations per Minute',
                    data: [],
                    borderColor: '#4fd1ff',
                    backgroundColor: 'rgba(79, 209, 255, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        const ctx2 = document.getElementById('performance-chart').getContext('2d');
        this.charts.performance = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Response Time', 'Cache Hit Rate', 'Translation Success'],
                datasets: [{
                    label: 'Performance Metrics',
                    data: [0, 0, 0],
                    backgroundColor: ['#4fd1ff', '#38a169', '#d69e2e']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        const ctx3 = document.getElementById('language-chart').getContext('2d');
        this.charts.language = new Chart(ctx3, {
            type: 'doughnut',
            data: {
                labels: ['English', 'Spanish', 'French', 'German', 'Other'],
                datasets: [{
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: ['#4fd1ff', '#38a169', '#d69e2e', '#e53e3e', '#805ad5']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        const ctx4 = document.getElementById('cache-chart').getContext('2d');
        this.charts.cache = new Chart(ctx4, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Cache Size (MB)',
                    data: [],
                    borderColor: '#38a169',
                    backgroundColor: 'rgba(56, 161, 105, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        const ctx5 = document.getElementById('response-chart').getContext('2d');
        this.charts.response = new Chart(ctx5, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Response Time (ms)',
                    data: [],
                    borderColor: '#e53e3e',
                    backgroundColor: 'rgba(229, 62, 62, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    updateCharts() {
        if (this.history.length === 0) return;

        // Update translation chart
        const recent = this.history.slice(0, 20).reverse();
        this.charts.translation.data.labels = recent.map((_, i) => `${i + 1}m ago`);
        this.charts.translation.data.datasets[0].data = recent.map(() => Math.floor(Math.random() * 10));
        this.charts.translation.update();

        // Update performance chart
        const avgResponseTime = this.history.reduce((sum, h) => sum + h.responseTime, 0) / this.history.length;
        const cacheHitRate = (this.history.filter(h => h.cached).length / this.history.length) * 100;
        const translationSuccess = (this.history.filter(h => h.translated).length / this.history.length) * 100;

        this.charts.performance.data.datasets[0].data = [avgResponseTime, cacheHitRate, translationSuccess];
        this.charts.performance.update();

        // Update language chart
        const langCounts = {};
        this.history.forEach(h => {
            langCounts[h.targetLang] = (langCounts[h.targetLang] || 0) + 1;
        });
        const topLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);
        const otherCount = Object.values(langCounts).reduce((sum, count) => sum + count, 0) - topLangs.reduce((sum, [, count]) => sum + count, 0);

        this.charts.language.data.labels = [...topLangs.map(([lang]) => lang), 'Other'];
        this.charts.language.data.datasets[0].data = [...topLangs.map(([, count]) => count), otherCount];
        this.charts.language.update();

        // Update cache chart
        this.charts.cache.data.labels = recent.map((_, i) => `${i + 1}m ago`);
        this.charts.cache.data.datasets[0].data = recent.map(() => Math.random() * this.settings.maxCacheSize);
        this.charts.cache.update();

        // Update response chart
        this.charts.response.data.labels = recent.map((_, i) => `${i + 1}m ago`);
        this.charts.response.data.datasets[0].data = recent.map(h => h.responseTime);
        this.charts.response.update();
    }

    clearCache() {
        this.cache.clear();
        this.logMessage('Cache cleared');
    }

    clearHistory() {
        this.history = [];
        localStorage.removeItem('translationProxyHistory');
        this.updateHistoryTable();
        this.updateDashboard();
        this.updateCharts();
        this.logMessage('History cleared');
    }

    exportSettings() {
        const data = {
            settings: this.settings,
            history: this.history,
            cache: Array.from(this.cache.entries())
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'translation-proxy-settings.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    importSettings() {
        document.getElementById('import-file').click();
    }

    handleImport(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.settings) {
                    this.settings = { ...this.settings, ...data.settings };
                    this.saveSettings();
                    this.loadSettings();
                }
                if (data.history) {
                    this.history = data.history;
                    this.saveHistory();
                    this.updateHistoryTable();
                }
                if (data.cache) {
                    this.cache = new Map(data.cache);
                }
                this.updateDashboard();
                this.updateCharts();
                alert('Settings imported successfully');
            } catch (error) {
                alert('Invalid file format');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new TranslationProxy();
});