<template>
  <v-layout>
    <v-flex column>
      <v-layout column>
        <v-flex row>
          <v-card flat v-for="(item, index) in outputs" :key="index">
            <v-card-text class="pa-0">
              <v-layout>
                <v-flex class="cell-indent pa-3" text-xs-center xs2>
                  <pre>[{{(item.lineno === undefined ? '' : `${item.lineno}`)}}]</pre>
                </v-flex>
                <v-flex class="pl-4 pr-3 pt-3 pb-3">
                  <v-flex v-if="item.input" class="cell-content pb-3">{{item.input}}</v-flex>
                  <v-divider inset></v-divider>
                  <v-flex v-if="preferences.showRaw && item.raw && item.raw.length > 0"
                          class="cell-content pt-2 pb-2">
                    <pre>{{item.raw}}</pre>
                  </v-flex>
                  <v-flex v-if="item.latex && item.latex.length > 0"
                          class="cell-content pt-2">
                    <latex-display :latex="item.latex"></latex-display>
                  </v-flex>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex row>
          <v-card>
            <v-card-text class="pa-0">
              <v-layout>
                <v-flex class="primary pa-3" justify-center align-center text-align-center>
                  <v-icon>mdi-chevron-double-right</v-icon>
                </v-flex>
                <v-flex class="pa-4" xs12>
                  <v-text-field @keypress.13="enter" v-model="axiomCmd" label=""
                                multi-line></v-text-field>
                </v-flex>
              </v-layout>
              <!--<v-text-field @keypress.13="enter" name="editor" prefix='->' v-model="axiomCmd" label="" textarea></v-text-field>-->
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
  import ChevronDoubleRight from '~/components/icons/chevron-double-right'

  export default {
    components: {
      LatexDisplay,
      ChevronDoubleRight
    },
    computed: {
      ...mapState('settings', {preferences: (state) => state.console})
    },
    methods: {
      openConnection: function () {
        // TODO: make an env variable
        this.connection = io('http://0.0.0.0:3001')
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
            let res = JSON.parse(response)
            if (!res.error) {
              this.updateOutput(res)
            } else {
              console.log('--- handleEvaluatedCmd ---  response has error')
              console.log(res.output)
            }
          } catch (err) {
            console.log('--- handleEvaluatedCmd ---  ', err)
          }
        } else {
          console.log('--- handleEvaluatedCmd ---  response is undefined')
        }
      },
      enter: function (event) {
        // TODO: Maybe (?) do not allow empty
        if (event.shiftKey) {
          event.preventDefault()
          this.submitCmd()
        }
      },
      submitCmd: function () {
        if (this.connection) {
          this.connection.emit('evalCmd', {cmd: this.axiomCmd})
        } else {
          console.log('--- submitCmd ---  Connection is undefined')
        }
      },
      updateOutput: function (result) {
        this.outputs.push(result)
      }
    },
    name: 'axiom-console',
    data () {
      return {
        axiomCmd: '',
        outputs: []
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
  .cell-content
    overflow-x auto
    > pre
      overflow-x auto

  .cell-indent
    min-width: 4.5em
    max-width: 5em
</style>
