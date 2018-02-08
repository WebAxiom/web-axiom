import Vue from 'vue'
import Vuetify from 'vuetify'

if (process.browser) {
  window.MathJax.Hub.Config({
    jax: ['input/TeX', 'output/HTML-CSS'],
    tex2jax: {
      inlineMath: [['$', '$']],
      displayMath: [['$$', '$$']],
      processEscapes: true
    },
    MathMenu: {
      showFontMenu: false,
      showLocale: false,
      showContext: false
    },
    'HTML-CSS': {
      availableFonts: ['TeX'],
      linebreaks: { automatic: false, width: 'container' }
    }
  })
}

Vue.use(Vuetify)
