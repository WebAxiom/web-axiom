<template>
  <v-layout class="command-line-wrapper">
    <v-flex column>
      <v-layout column>
        <v-flex row>
          <v-card class="command" flat v-for="(item, index) in history" :key="index">
            <v-card-text class="pa-0">
              <v-layout>
                <v-flex class="command-gutter left-gutter pa-3" text-xs-center>
                  <pre>{{`[${item.lineno}]`}}</pre>
                </v-flex>
                <v-flex class="pa-4">
                  <v-flex v-if="item.input" class="axiom-text pa-3">{{item.input}}</v-flex>
                  <v-divider></v-divider>
                  <v-flex class="pl-3 pr-3 pt-4 pb-2">
                    <v-flex :key="index" v-for="(token, index) in item.tokens">
                      <!-- TODO: Just proof of concept, definitely need rethinking-->
                      <pre v-if="token.plainText && item.displayPlainText">{{token.text}}</pre>
                      <latex-display :style="'max-width:' + latexWidth + 'px;}' + 'width:' + latexWidth + 'px;}'" v-if="token.latex" :latex="token.text"></latex-display>
                      <error-element v-if="token.error || token.compilation" :data="token"></error-element>
                    </v-flex>
                  </v-flex>
                </v-flex>
                <v-flex class="command-gutter right-gutter pa-3" text-xs-center>
                  <v-tooltip left>
                    <v-btn v-if="isErrorCollapsed(item) !== null" :class="`ma-0 mb-2 ${!isErrorCollapsed(item) ? 'red--text' : ''}`" @click.native="toggleErrorDisplay(item)" slot="activator" icon>
                      <v-icon>mdi-alert-circle</v-icon>
                    </v-btn>
                    <span>{{!isErrorCollapsed(item) ? "Hide" : "Show"}}  all errors</span>
                  </v-tooltip>
                  <v-tooltip left>
                    <v-btn :class="`ma-0 mb-2 ${item.displayPlainText ? 'primary--text' : ''}`" @click.native="togglePlainTextDisplay(item)" slot="activator" icon>
                      <v-icon>mdi-note-text</v-icon>
                    </v-btn>
                    <span>{{ item.displayPlainText ? "Hide" : "Show"}} plain text</span>
                  </v-tooltip>
                  <v-tooltip left>
                    <v-btn class="ma-0 mb-2" @click.native="copyCommand(item)" slot="activator" icon>
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
          <v-card>
            <v-card-text class="pa-0">
              <v-layout class="command-line">
                <v-flex class="command-gutter primary pa-3" text-xs-center>
                  <v-spacer></v-spacer>
                  <v-icon>mdi-chevron-double-right</v-icon>
                </v-flex>
                <v-flex class="pa-0 ma-0" xs12>
                  <v-text-field id="axiom-input"
                                class="pa-0"
                                @keypress.shift.enter.stop.prevent="onKeyPress"
                                v-model="axiomCmd"
                                textarea auto-grow hide-details ></v-text-field>
                </v-flex>
                <v-flex class="command-gutter right-gutter pa-3">
                </v-flex>
              </v-layout>
              <!--<v-text-field @keypress.13="onKeyPress" name="editor" prefix='->' v-model="axiomCmd" label="" textarea></v-text-field>-->
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script type="text/babel">
  import io from 'socket.io-client'
  import { mapState } from 'vuex'

  import LatexDisplay from './latex-display.vue'
  import ErrorElement from './error-element'

  export default {
    components: {
      ErrorElement,
      LatexDisplay
    },
    computed: {
      ...mapState('settings', {preferences: (state) => state.console}),
      latexWidth () {
        if (process.browser) {
          let width = (this.$vuetify.breakpoint.width || window.innerWidth || 250) - 250
          console.log(width)
          return width
        }
        return 0
      }
    },
    methods: {
      openConnection: function () {
        // TODO: make an env variable
        this.connection = io(`http://${process.env.HOST}${process.env.API_PORT ? ':' + process.env.API_PORT : ''}`)
        this.connection.on('connected', ({message}) => console.log(message))
        this.connection.on('evaluatedCmd', this.handleEvaluatedCmd)
        this.connection.on('disconnected', ({message}) => console.log(message))
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
      onKeyPress: function (event) {
        if (event.shiftKey) {
          this.submitCmd()
        }
      },
      togglePlainTextDisplay: function (item) {
        item.displayPlainText = !item.displayPlainText
      },
      toggleErrorDisplay: function (item) {
        item.tokens.map(token => (token.display = token.error ? this.isErrorCollapsed(item) : token.display))
      },
      isErrorCollapsed: function (item) {
        let errors = item.tokens.filter(t => t.error)
        if (errors.length === 0) {
          return null
        } else {
          return errors.map(t => t.display).indexOf(false) !== -1
        }
      },
      clearInput: function () {
        this.axiomCmd = ''
      },
      copyCommand: function (cmd) {
        this.axiomCmd = cmd.input
      },
      openErrorView: function (item, index) {
        this.errorView = {
          open: true,
          commandId: index,
          errors: item.errors,
          compilation: item.compilation,
          lineno: item.lineno
        }
      },
      openLatexDialog: function (item) {
        this.latexDialog = {
          open: true,
          item: item
        }
      },
      submitCmd: function () {
        // TODO: Maybe (?) do not allow empty
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

  .axiom-text
    font-family: monospace;
    white-space: pre-wrap;       /* css-3 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */

  .command
    border: 1px #E0E0E0 solid

  .command-line
    min-height: 10rem
    border: 1px #E0E0E0 solid

  .command-gutter
    max-width: 5rem
    min-width: 5rem

  .left-gutter
    border-right: 1px #E0E0E0 solid

  .right-gutter
    border-left: 1px #E0E0E0 solid

</style>
