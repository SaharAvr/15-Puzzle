class HotjarService {

  constructor() {
    this.instance = null;
  }

  init() {

    if (this.instance) {
      return;
    }

    if (window.hj) {
      this.instance = window.hj;
      return;
    }

    const script = document.createElement('script');
    script.innerHTML = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:2530463,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `;

    document.head.appendChild(script);
    this.instance = window.hj;

  }

  trigger(eventName) {

    if (!this.instance) {
      return;
    }

    this.instance('trigger', eventName);

  }

}

export default new HotjarService();
