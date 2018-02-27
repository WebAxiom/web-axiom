<template>
  <div class="latex pt-3 pb-4 pl-2 pr-2">
    {{latex}}
  </div>
</template>

<script type="text/babel">
  export default {
    name: 'latex-display',
    props: {
      'latex': {
        type: String,
        required: true
      }
    },
    watch: {
      'window.MathJax' (val) {
        this.renderMathJax()
      }
    },
    mounted () {
      this.renderMathJax()
    },
    methods: {
      renderMathJax () {
        if (process.browser && window.MathJax) {
          window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.$el])
        }
      }
    }
  }
</script>

<style lang="stylus">
  .latex
    overflow-x auto
</style>
