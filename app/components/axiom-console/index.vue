<template>
  <v-layout column>
    <v-flex xs12>
      <v-text-field name="editor" v-model="axiomCmd" label="" textarea>

      </v-text-field>
    </v-flex>
    <v-flex xs12>
      <v-tabs centered dark v-model="outputs.active">
        <v-tabs-bar >
          <v-tabs-item
            :key="'raw-output'"
            :href="'#raw'"
            ripple
          >
            Raw
          </v-tabs-item>
          <v-tabs-item
            :key="'latex-output'"
            :href="'#latex'"
            ripple
          >
            Latex
          </v-tabs-item>
          <v-tabs-slider color="accent"></v-tabs-slider>
        </v-tabs-bar>
        <v-tabs-items>
          <v-tabs-content
            :key="'raw-output'"
            :id="'raw'"
          >
            <v-card flat>
              <v-card-text class="output-text"><v-flex text-xs-center><pre>{{ outputs.raw }}</pre></v-flex></v-card-text>
            </v-card>
          </v-tabs-content>
          <v-tabs-content
            :key="'latex-output'"
            :id="'latex'"
          >
            <v-card flat>
              <v-card-text class="output-text">
                <latex-display v-bind:latex="outputs.latex"></latex-display>
              </v-card-text>
            </v-card>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </v-flex>
    <v-flex xs12>
      <v-btn v-on:click.native="submitCmd()">Submit</v-btn>
    </v-flex>
  </v-layout>
</template>

<script type="text/babel">
  import io from 'socket.io-client'
  import LatexDisplay from './latex-display.vue'

  export default {
    components: {LatexDisplay},
    methods: {
      openConnection: function () {
        this.connection = io('http://0.0.0.0:3001')
        this.connection.on('connected', this.logMessage)
        this.connection.on('evaluatedCmd', this.handleEvaluatedCmd)
        this.connection.on('disconnected', this.logMessage)
      },
      closeConnection: function () {
        if (this.connection) {
          this.connection.disconnect()
        }
        this.connection = undefined
      },
      handleEvaluatedCmd: function (response) {
        let res = JSON.parse(response)
        if (!res.error) {
          this.updateOutput(res)
        }
      },
      submitCmd: function () {
        this.connection.emit('evalCmd', {cmd: this.axiomCmd})
      },
      logMessage: function ({message}) {
        console.log(message)
      },
      updateOutput: function (result) {
        this.outputs.raw = result.raw
        this.outputs.latex = result.latex
      }
    },
    name: 'axiom-console',
    data () {
      return {
        axiomCmd: '',
        outputs: {
          latex: '',
          raw: ''
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
  .output-text
    word-wrap break-word
</style>