<template>
  <v-card>
    <v-card-text class="pa-0">
      <v-layout class="cmd-line">
        <v-flex class="cmd-gutter left-gutter pa-3">
        </v-flex>
        <v-flex class="pa-0 ma-0 cmd-input-wrapper" xs12>
          <v-text-field class="pa-0 cmd-input axiom-text cmd-text"
                        @keypress.shift.enter.stop.prevent="onEnter()"
                        :value="value"
                        @input="updateCommand"
                        placeholder="Type you command here"
                        multi-line auto-grow hide-details solo></v-text-field>
          <v-flex class="pa-0 axiom-text cmd-text cmd-display" v-html="output">

          </v-flex>
        </v-flex>
        <v-flex class="cmd-gutter primary" text-xs-center>
          <v-btn depressed class="ma-0 pa-0 primary submit-btn" @click.native="onEnter()"><v-icon>mdi-chevron-double-right</v-icon></v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'axiom-input',
    props: ['value'],
    computed: {
      output () {
        return this.value
      }
    },
    methods: {
      onEnter () {
        this.$emit('submit')
      },
      updateCommand (val) {
        this.adjustHeight()
        this.$emit('input', val)
      },
      adjustHeight () {
        const el = this.$el.getElementsByClassName('cmd-input')[0]
        const height = el.scrollHeight
        console.log(el.scrollHeight, el.clientHeight)
        const wrapper = this.$el.getElementsByClassName('cmd-line')[0]
        const display = this.$el.getElementsByClassName('cmd-display')[0]
        wrapper.style.height = height + 1 + 'px'
        display.style.height = height - 1 + 'px'
      }
    },
    mounted () {
      console.log(this.value)
    }
  }
</script>

<style lang="stylus" scoped>
  @require '~vuetify/src/stylus/settings/_colors.styl'

  .cmd-input-wrapper
    position:relative

  .submit-btn
    min-width 100%
    min-height:100%

  .cmd-line
    min-height: 10rem
    border: 1px #E0E0E0 solid

  .cmd-text
    position absolute
    width 100%
    min-height 100%
    overflow hidden
    font-family monospace

  .cmd-input
    z-index 0
    box-shadow: inset 0 0 5px $colors.indigo.base
    background: none

  .cmd-display
    padding 8px 16px !important
    z-index 1

</style>