<template>
  <div class="editor">
    <no-ssr class="no-ssr">
      <codemirror ref="cm" class="codemirror axiom-text" :value="value" @input="updateCommand" :options="options"></codemirror>
    </no-ssr>
  </div>
</template>

<script>
  export default {
    name: 'axiom-editor',
    props: ['value'],
    computed: {
      output () {
        return this.value
      }
    },
    methods: {
      updateCommand (val) {
        this.$emit('input', val)
      },
      submit (event) {
        if (event.keyCode === 13 && event.shiftKey) {
          event.stopPropagation()
          event.preventDefault()
          this.$emit('submit')
        }
      }
    },
    data () {
      return {
        options: {
          tabSize: 2,
          mode: 'axiom',
          autofocus: true,
          lineWrapping: true,
          lineNumbers: true,
          matchBrackets: true,
          line: true,
          scrollbarStyle: 'null'
        }
      }
    },
    mounted () {
      setTimeout(function () { console.log(this.$refs.cm.$el.addEventListener('keypress', this.submit.bind(this))) }.bind(this), 0)
    }
  }
</script>

<style lang="stylus" scoped>
.editor
  width 100%
.no-ssr
  height 100%
  width 100%
</style>