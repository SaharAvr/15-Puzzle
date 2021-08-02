class AnalyticsService {

  constructor() {
    this.instance = null;
  }

  init() {

    if (this.instance) {
      return;
    }

    if (window.dataLayer) {
      this.instance = window.dataLater;
      return;
    }
    
    const dataLayerScript = document.createElement('script');
    dataLayerScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-5RMBP9Q75D');
    `;

    const gtagScript = document.createElement('script');
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-5RMBP9Q75D';
    gtagScript.async = true;
    gtagScript.onload = () => {
      document.head.appendChild(dataLayerScript);
      this.instace = window.dataLater;
    };

    document.head.appendChild(gtagScript);

  }

}

export default new AnalyticsService();
