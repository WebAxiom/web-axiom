<template>
  <v-flex xs12 v-html="_expr"></v-flex>
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
          return katex.renderToString(this.latex, {throwOnError: false})
        } catch (err) {
          console.log(err)
          // TODO: LOG WHEN
          return ''
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>