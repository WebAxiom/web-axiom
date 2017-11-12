<template>
  <v-flex xs12 text-xs-center v-html="_expr"></v-flex>
</template>

<script type="text/babel">
  import katex from 'katex'

  export default {
    name: 'latex-display',
    props: {
      'latex': {
        type: String,
        required: true
      }
    },
    computed: {
      _expr: function () {
        try {
          console.log(this.latex)
          return katex.renderToString(this.latex, {throwOnError: false})
        } catch (err) {
          console.log(err)
          return 'ERROR'
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>