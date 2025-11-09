<template>
  <footer class="layout-footer">
    <div class="footer-content">
      <div class="footer-sections">
        <!-- 客户服务 -->
        <div class="footer-section">
          <h3 class="section-title">
            <Icon icon="material-symbols:headset-mic" class="title-icon" />
            客户服务
          </h3>
          <ul class="section-list">
            <li>
              <a href="#" class="section-link">
                <Icon icon="material-symbols:help-outline" class="link-icon" />
                帮助中心
              </a>
            </li>
            <li>
              <a href="#" class="section-link">
                <Icon icon="material-symbols:contact-support" class="link-icon" />
                在线客服
              </a>
            </li>
            <li>
              <a href="#" class="section-link">
                <Icon icon="material-symbols:feedback" class="link-icon" />
                意见反馈
              </a>
            </li>
            <li>
              <a href="#" class="section-link">
                <Icon icon="material-symbols:phone" class="link-icon" />
                400-888-8888
              </a>
            </li>
          </ul>
        </div>

        <!-- 关注我们 -->
        <div class="footer-section">
          <h3 class="section-title">
            <Icon icon="material-symbols:share" class="title-icon" />
            关注我们
          </h3>
          <div class="social-links">
            <a href="#" class="social-link" title="微信">
              <Icon icon="mdi:wechat" class="icon" />
            </a>
            <a href="#" class="social-link" title="微博">
              <Icon icon="mdi:sina-weibo" class="icon" />
            </a>
            <a href="#" class="social-link" title="GitHub">
              <Icon icon="mdi:github" class="icon" />
            </a>
            <a href="#" class="social-link" title="Twitter">
              <Icon icon="mdi:twitter" class="icon" />
            </a>
          </div>
          <p class="social-desc">关注我们获取最新资讯</p>
        </div>

        <!-- 下载APP -->
        <div class="footer-section">
          <h3 class="section-title">
            <Icon icon="material-symbols:download" class="title-icon" />
            下载APP
          </h3>
          <div class="app-download">
            <img src="@/assets/images/qrcode.jpg" alt="APP下载二维码" class="qrcode-img" />
            <p class="app-desc">扫码下载手机APP</p>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-info">
          <p>&copy; 2024 Vue Rabbits. All rights reserved.</p>
          <p class="footer-links">
            <a href="#" class="footer-link">隐私政策</a>
            <span class="separator">|</span>
            <a href="#" class="footer-link">使用条款</a>
            <span class="separator">|</span>
            <a href="#" class="footer-link">联系我们</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Icon } from '@iconify/vue'
</script>

<style scoped>
.layout-footer {
  background-color: #2d3748;
  color: #e2e8f0;
  padding: 3rem 2rem 1.5rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1240px;
  margin: 0 auto;
}

.footer-sections {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #4a5568;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

.title-icon {
  font-size: 1.5rem;
  color: #2563eb;
}

.section-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0aec0;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.section-link:hover {
  color: #fff;
}

.link-icon {
  font-size: 1.2rem;
  color: #4a5568;
}

.section-link:hover .link-icon {
  color: #2563eb;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4a5568;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.2s;
}

.social-link:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
}

.social-link .icon {
  font-size: 1.4rem;
  color: #e2e8f0;
}

.social-desc {
  margin: 0;
  font-size: 0.85rem;
  color: #a0aec0;
}

.app-download {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.qrcode-img {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  background-color: #fff;
  padding: 8px;
  object-fit: contain;
}

.app-desc {
  margin: 0;
  font-size: 0.85rem;
  color: #a0aec0;
  text-align: center;
}

.footer-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.footer-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #a0aec0;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-link {
  color: #a0aec0;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #fff;
}

.separator {
  color: #4a5568;
}

@media (max-width: 768px) {
  .footer-sections {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>

