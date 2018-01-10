<template>
  <v-layout>
    <v-flex column>
      <v-layout column>
        <v-flex row>
          <v-card flat v-for="(item, index) in outputs" :key="index">
            <v-card-text class="pa-0 elevation-3">
              <v-layout>
                <v-flex class="command-gutter pa-3" text-xs-center xs2>
                  <pre>[{{(item.lineno === undefined ? '' : `${item.lineno}`)}}]</pre>
                </v-flex>
                <v-flex class="pa-4">
                  <v-flex v-if="item.input" class="cell-content pa-2">{{item.input}}</v-flex>
                  <v-divider></v-divider>
                  <v-flex v-if="preferences.showRaw && item.raw && item.raw.length > 0"
                          class="cell-content pa-2">
                    <pre>{{item.raw}}</pre>
                  </v-flex>
                  <v-flex v-if="item.latex && item.latex.length > 0"
                          class="cell-content pa-2">
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
              <v-layout class="command-line">
                <v-flex class="command-gutter primary pa-3" text-xs-center>
                  <v-spacer></v-spacer>
                  <v-icon>mdi-chevron-double-right</v-icon>
                </v-flex>
                <v-flex class="pa-4" xs12>
                  <v-text-field @keypress.shift.enter="onKeyPress" v-model="axiomCmd"></v-text-field>
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
      onKeyPress: function (event) {
        if (event.shiftKey) {
          event.preventDefault()
          this.submitCmd()
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
  .command-line
    min-height: 10rem

  .command-gutter
    max-width: 5rem
    width: 5rem

  .cell-content
    overflow-x auto
    > pre
      overflow-x auto

</style>
