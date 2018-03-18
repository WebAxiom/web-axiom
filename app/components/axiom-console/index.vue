<template>
  <v-layout>
    <v-flex column>
      <v-layout column>
        <v-flex row>
          <v-card class="command" flat v-for="(item, index) in history" :key="index">
            <v-card-text class="pa-0">
              <v-layout>
                <v-flex class="cmd-gutter left-gutter pa-3" text-xs-center>
                  <pre>{{`[${item.lineno}]`}}</pre>
                </v-flex>
                <v-flex class="pa-4">
                  <v-flex v-if="item.input" class="axiom-text pl-3 pt-3 pr-3">{{item.input}}</v-flex>
                  <v-divider class="mt-3 mb-3"></v-divider>
                  <v-flex class="pl-3 pr-3 pb-2">
                    <v-flex :key="index" v-for="(token, index) in item.tokens">
                      <!-- TODO: Just proof of concept, definitely needs rethinking-->
                      <pre v-if="token.plainText && item.displayPlainText">{{token.text}}</pre>
                      <latex-display :style="'max-width:' + latexWidth + 'px;}' + 'width:' + latexWidth + 'px;}'" v-if="token.latex" :latex="token.text"></latex-display>
                      <error-element v-if="token.error || token.compilation" :data="token"></error-element>
                    </v-flex>
                  </v-flex>
                </v-flex>
                <v-flex class="cmd-gutter right-gutter pa-3" text-xs-center>
                  <v-tooltip :disabled="!item.containsErrors" left>
                    <v-btn :disabled="!item.containsErrors" :class="`ma-0 mb-2 ${!isErrorCollapsed(item) ? 'red--text' : ''}`" @click.native="toggleErrorDisplay(item)" slot="activator" icon>
                      <v-icon>mdi-alert-circle</v-icon>
                    </v-btn>
                    <span>{{!isErrorCollapsed(item) ? "Hide" : "Show"}} all errors</span>
                  </v-tooltip>
                  <v-tooltip :disabled="!item.containsText" left>
                    <v-btn :disabled="!item.containsText" :class="`ma-0 mb-2 ${item.displayPlainText ? 'primary--text' : ''}`" @click.native="togglePlainTextDisplay(item)" slot="activator" icon>
                      <v-icon>mdi-note-text</v-icon>
                    </v-btn>
                    <span>{{item.displayPlainText ? "Hide" : "Show"}} plain text</span>
                  </v-tooltip>
                  <v-tooltip left>
                    <v-btn class="ma-0 mb-2" @click.native="updateCommand(item.input)" slot="activator" icon>
                      <v-icon>mdi-content-copy</v-icon>
                    </v-btn>
                    <span>Copy command to input</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex row>
          <axiom-input class="axiom-input" v-model="axiomCmd" @submit="submitCmd"></axiom-input>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script type="text/babel">
  import io from 'socket.io-client'
  import { mapState } from 'vuex'

  import LatexDisplay from './latex-display'
  import ErrorElement from './error-element'
  import AxiomInput from './axiom-input'

  export default {
    components: {
      ErrorElement,
      LatexDisplay,
      AxiomInput
    },
    computed: {
      ...mapState('settings', {preferences: (state) => state.console}),
      latexWidth () {
        if (process.browser) {
          return (this.$vuetify.breakpoint.width || window.innerWidth || 250) - 250
        }
        return 0
      }
    },
    methods: {
      openConnection: function () {
        // TODO: make an .env variable
        this.connection = io(`http://${this.$store.state.env.HOST}${this.$store.state.env.API_PORT ? ':' + this.$store.state.env.API_PORT : ''}`)
        this.connection.on('log', ({message}) => console.log(message))
        this.connection.on('evaluatedCmd', this.handleEvaluatedCmd)
      },
      closeConnection: function () {
        if (this.connection) {
          this.connection.disconnect()
        } else {
          console.log('--- closeConnection ---  Connection is undefined')
        }
        this.connection = undefined
      },
      handleEvaluatedCmd: function (response) {
        if (response) {
          try {
            let res = response
            if (!res.sysError) {
              console.log(res)
              this.updateOutput(res)
              this.clearInput()
            } else {
              console.log('--- handleEvaluatedCmd ---  response has error')
              console.log(res.sysError)
            }
          } catch (err) {
            console.log('--- handleEvaluatedCmd ---  ', err)
            console.log(response)
          }
        } else {
          console.log('--- handleEvaluatedCmd ---  response is undefined')
        }
      },
      togglePlainTextDisplay: function (item) {
        item.displayPlainText = !item.displayPlainText
      },
      toggleErrorDisplay: function (item) {
        item.tokens.map(token => (token.display = token.error ? this.isErrorCollapsed(item) : token.display))
      },
      isErrorCollapsed: function (item) {
        const errors = item.tokens.filter(t => t.error)
        return errors.map(t => t.display).indexOf(false) !== -1
      },
      clearInput: function () {
        this.axiomCmd = ''
      },
      updateCommand: function (val) {
        this.axiomCmd = val
      },
      submitCmd: function () {
        // TODO: Maybe  do not allow empty
        if (this.connection) {
          this.connection.emit('evalCmd', {cmd: this.axiomCmd})
        } else {
          console.log('--- submitCmd ---  Connection is undefined')
        }
      },
      updateOutput: function (result) {
        result.displayPlainText = this.preferences.displayPlainText
        this.history.push(result)
        if (this.axiomInput) {
          setTimeout(_ => this.axiomInput.scrollIntoView(), 0)
        }
      }
    },
    name: 'axiom-console',
    data () {
      return {
        axiomCmd: '',
        history: [],
        errorView: {
          open: false,
          errors: [],
          compilation: [],
          lineno: null,
          commandId: null
        },
        latexDialog: {
          open: false,
          item: null
        }
      }
    },
    mounted () {
      this.openConnection()
      if (process.browser) {
        this.axiomInput = document.getElementById('axiom-input')
      }
    },
    destroyed () {
      this.closeConnection()
    }
  }
</script>

<style lang="stylus" scoped>
  .command
    border: 1px #E0E0E0 solid
  .codemirror
      font-size 3rem !important
</style>
