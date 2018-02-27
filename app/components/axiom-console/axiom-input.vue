<template>
  <v-card>
    <v-card-text class="pa-0">
      <v-layout class="cmd-line">
        <div class="cmd-gutter left-gutter"></div>
        <div class="cmd-input-wrapper">
          <textarea :value="value" @input="updateCommand" class="pa-3 axiom-text cmd-text cmd-input"> </textarea>
          <div class="pa-3 ma-0 axiom-text cmd-text cmd-display" v-html="value"></div>
        </div>
        <div class="cmd-gutter primary">
         <v-btn depressed class="ma-0 pa-0 primary submit-btn" @click.native="onEnter()"><v-icon>mdi-chevron-double-right</v-icon></v-btn>
        </div>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'axiom-input',
    props: ['value'],

    methods: {
      onEnter () {
        this.$emit('submit')
      },
      updateCommand (event) {
        this.$emit('input', event.target.value)
        this.adjustHeight(event)
      },
      adjustHeight (event) {
        const el = event.srcElement
        const height = el.scrollHeight > el.clientHeight ? el.scrollHeight : null
        const wrapper = this.$el.getElementsByClassName('cmd-input-wrapper')[0]
        console.log(el.scrollHeight, el.clientHeight, wrapper.style.height)
        // const input = this.$el.getElementsByClassName('cmd-input')[0]
        // const display = this.$el.getElementsByClassName('cmd-display')[0]
        if (height) {
          wrapper.style.height = height - 2 + 'px'
          // input.style.height = height + 'px'
        } else {
          // input.style.height = '100%'
          wrapper.style.height = '100%'
        }
        // display.style.height = height + 'px'
      }
    },
    mounted () {
      console.log('????')
      console.log(this.$el)
    }
  }
</script>

<style lang="stylus" scoped>
  @require '~vuetify/src/stylus/settings/_colors.styl'

  .cmd-input-wrapper
    width 100%
    min-height: 100%

  .submit-btn
    min-width 100%
    min-height:100%

  .cmd-line
    min-height: 10rem
    border: 1px #E0E0E0 solid

  .cmd-text
    position absolute
    width calc(100% - 10rem)
    min-height 100%
    overflow hidden
    font-family monospace

  .cmd-input
    resize none
    z-index 1
    outline: 0;
    &:focus
      box-shadow: inset 0 0 5px $colors.indigo.base

  .cmd-display
    z-index 0
</style>