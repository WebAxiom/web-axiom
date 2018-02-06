<template>
  <v-layout>
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
                  <v-flex v-if="displayPlainText(item)" class="axiom-text pa-3">
                    <pre>{{item.plainText}}</pre>
                  </v-flex>
                  <v-flex v-if="item.latex && item.latex.length > 0"
                          class="pa-3">
                    <latex-display :latex="item.latex.length > 0 ? item.latex[item.latex.length-1] : ''"></latex-display>
                  </v-flex>
                </v-flex>
                <v-flex class="command-gutter right-gutter pa-3" text-xs-center>
                  <v-tooltip v-if="item.cmdError" left>
                    <v-btn class="ma-0 mb-2 red--text" @click.native="openErrorView(item, index)" slot="activator" icon>
                      <v-icon>mdi-alert-circle</v-icon>
                    </v-btn>
                    <span>Errors occurred during execution</span>
                  </v-tooltip>
                  <v-tooltip v-if="!item.cmdError" left>
                    <v-icon  class="mb-2 green--text" slot="activator" medium>mdi-checkbox-marked-circle</v-icon>
                    <span>Success</span>
                  </v-tooltip>
                  <v-tooltip left>
                    <v-btn :class="`ma-0 mb-2 ${item.displayPlainText ? 'primary--text' : ''}`" @click.native="togglePlainTextDisplay(item)" slot="activator" icon>
                      <v-icon>mdi-note-text</v-icon>
                    </v-btn>
                    <span>{{ item.displayPlainText ? "Hide" : "Display"}} plain text</span>
                  </v-tooltip>
                  <v-tooltip left>
                    <v-btn class="ma-0 mb-2" @click.native="copyCommand(item)" slot="activator" icon>
                      <v-icon>mdi-content-copy</v-icon>
                    </v-btn>
                    <span>Copy command to input</span>
                  </v-tooltip>
                  <v-tooltip left>
                    <v-btn class="ma-0 mb-2" @click.native="openLatexDialog(item)" slot="activator" icon>
                      <v-icon>mdi-function</v-icon>
                    </v-btn>
                    <span>Display latex raw</span>
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
                  <v-text-field class="pa-0 command-input"
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
      <v-dialog v-model="latexDialog.open">
        <v-card>
          <v-card-text>
            <pre>{{latexDialog.item && latexDialog.item.latex.length > 0 ? '$$\n' + latexDialog.item.latex[latexDialog.item.latex.length-1] + '\n$$' : ''}}</pre>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-navigation-drawer :width="600"
                           v-model="errorView.open"
                           :temporary="this.$vuetify.breakpoint.width < 1400"
                           disable-resize-watcher
                           clipped fixed app right>
        <!-- TODO: prolly use computed values instead of these long variables -->
        <v-flex v-if="errorView.command">
          <v-toolbar class="elevation-1">
            <v-toolbar-title>{{`[${errorView.command.lineno}]`}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click.native="errorView.open = false" icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-flex v-if="errorView.command.cmdError">
            <v-subheader class="red white--text">
              {{`Errors found (${errorView.command.errors.length})`}}
            </v-subheader>
            <v-divider></v-divider>
            <v-card v-for="(item, index) in errorView.command.errors" v-bind:key="index">
              <v-card-title>
                <div>
                  <h3>{{ `${index + 1}. ${item.type} `}}</h3>
                  <div class="axiom-text">{{ item.message }}</div>
                </div>
              </v-card-title>
            </v-card>
          </v-flex>
          <v-flex v-if="errorView.command.cmdCompile">
            <v-subheader class="orange white--text">
              {{`Compilation (${errorView.command.compilation.length})`}}
            </v-subheader>
            <v-divider></v-divider>
            <v-card v-for="(item, index) in errorView.command.compilation" v-bind:key="index">
              <v-card-title>
                <div>
                  <h3>{{ `${index + 1}. ${item.type} `}}</h3>
                  <div class="axiom-text">{{ item.message }}</div>
                </div>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-flex>
      </v-navigation-drawer>
    </v-flex>
  </v-layout>
</template>

<script type="text/babel">
  import io from 'socket.io-client'
  import { mapState } from 'vuex'

  import LatexDisplay from './latex-display.vue'

  export default {
    components: {
      LatexDisplay
    },
    computed: {
      ...mapState('settings', {preferences: (state) => state.console})
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
            // console.log(res)
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
      displayPlainText: function (item) {
        return (item.displayPlainText &&
                  item.plainText.length &&
                  item.plainText.length > 0)
      },
      togglePlainTextDisplay: function (item) {
        item.displayPlainText = !item.displayPlainText
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
          command: item,
          commandId: index
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
      }
    },
    name: 'axiom-console',
    data () {
      return {
        axiomCmd: '',
        history: [],
        errorView: {
          open: false,
          command: null,
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
    max-width: 100%

  .command
    border: 1px #E0E0E0 solid

  .command-line
    min-height: 10rem
    border: 1px #E0E0E0 solid

  .command-input {
    font-family: monospace
  }

  .command-gutter
    max-width: 5rem
    min-width: 5rem

  .left-gutter
    border-right: 1px #E0E0E0 solid

  .right-gutter
    border-left: 1px #E0E0E0 solid

</style>
