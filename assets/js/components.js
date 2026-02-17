class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="site-header">
        <div class="container header-content">
          <a href="/" class="logo">
            <span class="logo-icon">💰</span>
            <span class="logo-text">머니칼크 (MoneyCalc)</span>
          </a>
          <nav>
            <ul class="nav-links">
              <li><a href="/">홈</a></li>
              <li><a href="/calculators/compound-interest-calculator.html">복리 계산기</a></li>
              <li><a href="/calculators/fire-calculator.html">파이어족 계산기</a></li>
            </ul>
          </nav>
        </div>
      </header>
    `;
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    const currentYear = new Date().getFullYear();
    this.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-content">
          <div class="footer-links">
            <a href="#">개인정보처리방침</a>
            <a href="#">면책 조항</a>
            <a href="#">문의하기</a>
            <a href="#">사이트맵</a>
          </div>
          <p class="copyright">&copy; ${currentYear} 머니칼크 (MoneyCalc). All rights reserved.</p>
          <p class="disclaimer">
            면책 조항: 본 계산기는 참고용이며 실제 투자 결과를 보장하지 않습니다. 
            정확한 투자 결정은 전문가와 상담하시기 바랍니다.
          </p>
        </div>
      </footer>
    `;
  }
}

customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);