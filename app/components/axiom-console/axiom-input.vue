<template>
  <v-card>
    <v-card-text class="pa-0">
      <v-layout class="cmd-line">
        <v-flex class="cmd-gutter left-gutter pa-3">
        </v-flex>
        <v-flex class="pa-0 ma-0" xs12>
          <v-text-field id="axiom-input"
                        class="pa-0"
                        @keypress.shift.enter.stop.prevent="onEnter()"
                        :value="value"
                        @input="updateCommand"
                        textarea auto-grow hide-details required></v-text-field>
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
    methods: {
      onEnter () {
        if (this.value.length > 0) {
          this.$emit('submit')
        } else {

        }
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
    min-height: 10rem
    /*border: 1px #E0E0E0 solid*/

</style>