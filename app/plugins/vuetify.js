import Vue from 'vue'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'

if (process.browser) {
  window.MathJax.Hub.Config({
    jax: ['input/TeX', 'output/HTML-CSS'],
    tex2jax: {
      inlineMath: [['$', '$'], ['$$', '$$']],
      displayMath: [],
      processEscapes: true
    },
    TeX: {extensions: ['AMSmath.js', 'AMSsymbols.js']},
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

Vue.use(Vuetify, {
  theme: {
    primary: colors.indigo.base
  }
})
