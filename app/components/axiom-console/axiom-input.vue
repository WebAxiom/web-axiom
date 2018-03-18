<template>
  <v-card>
    <v-card-text class="pa-0">
      <v-layout class="cmd-line">
        <axiom-editor class="axiom-editor" :value="value" @input="updateCommand" @submit="submit"></axiom-editor>
        <v-flex class="cmd-gutter primary" text-xs-center>
         <v-btn depressed class="ma-0 pa-0 primary submit-btn" @click.native="submit()"><v-icon>mdi-chevron-double-right</v-icon></v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  import AxiomEditor from '../axiom-editor/index'

  export default {
    components: { AxiomEditor },
    name: 'axiom-input',
    props: ['value'],
    methods: {
      submit () {
        this.$emit('submit')
      },
      updateCommand (val) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .submit-btn
    min-width 100%
    min-height:100%
  .cmd-line
    min-height 10rem
  .axiom-editor /deep/ .CodeMirror-gutter
    max-width: 5rem
    width: 5rem
    min-width: 5rem

  .axiom-editor /deep/ .CodeMirror-linenumber
    text-align center

  .axiom-editor /deep/ .CodeMirror-line
    padding-left 40px


  .axiom-editor /deep/ .CodeMirror
    z-index 0
</style>