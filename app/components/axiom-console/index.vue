<template>
  <v-layout column>
    <v-flex xs12>
      <v-text-field name="editor" v-model="outputs.list[2].text" label="" textarea>

      </v-text-field>
    </v-flex>
    <v-flex xs12>
      <v-tabs centered dark v-model="outputs.active">
        <v-tabs-bar >
          <v-tabs-item
            v-for="tab in outputs.list"
            :key="tab.id"
            :href="'#' + tab.id"
            ripple
          >
            {{ tab.name }}
          </v-tabs-item>
          <v-tabs-slider color="accent"></v-tabs-slider>
        </v-tabs-bar>
        <v-tabs-items>
          <v-tabs-content
            v-for="tab in outputs.list"
            :key="tab.id"
            :id="tab.id"
          >
            <v-card flat>
              <v-card-text class="output-text">{{ tab.text }}</v-card-text>
            </v-card>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </v-flex>
  </v-layout>
</template>

<script type="text/babel">
  import io from 'socket.io-client'

  export default {
    components: {},
    methods: {
      openConnection: () => {
        this.connection = io('http://localhost:3001')
        this.connection.on('connection', (socket) => {
          console.log('Connected')
        })

        this.connection.on('disconnect', (socket) => {
          console.log('Disconnected')
        })
      },
      closeConnection: () => {
        if (this.connection) {
          this.connection.disconnect()
        }
        this.connection = undefined
      }
    },
    name: 'axiom-console',
    data () {
      return {
        content: '',
        outputs: {
          active: 'output-raw',
          list: [
            {
              name: 'Raw',
              id: 'output-raw',
              text: ''
            },
            {
              name: 'LaTeX',
              id: 'output-latex',
              text: ''
            },
            {
              name: 'Content',
              id: 'output-content',
              text: ''
            }
          ]
        }
      }
    },
    mounted () {
      this.openConnection()
    },
    beforeDestroyed () {
      this.closeConnection()
    }
  }
</script>

<style lang="stylus" scoped>
  .output-text
    word-wrap break-word
</style>