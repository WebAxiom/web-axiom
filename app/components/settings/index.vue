<template>
    <v-dialog
            v-model="open"
            fullscreen
            transition="dialog-bottom-transition"
            :overlay=false
            scrollable
    >
        <v-card>
            <v-toolbar style="flex: 0 0 auto;" dark class="primary pr-3 pl-3">
                <v-toolbar-title>Settings</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click.native.stop="closeWindow()" dark>
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <!--<v-list three-line subheader>-->
                    <!--<v-subheader>User Controls</v-subheader>-->
                    <!--<v-list-tile avatar>-->
                        <!--<v-list-tile-content>-->
                            <!--<v-list-tile-title>Password</v-list-tile-title>-->
                            <!--<v-list-tile-sub-title>Change user password</v-list-tile-sub-title>-->
                        <!--</v-list-tile-content>-->
                    <!--</v-list-tile>-->
                <!--</v-list>-->
                <!--<v-divider></v-divider>-->
                <v-list three-line subheader>
                    <v-subheader>Console preferences</v-subheader>
                    <v-list-tile avatar>
                        <v-list-tile-action>
                            <v-checkbox v-model="displayPlainText" true-value></v-checkbox>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Raw Output</v-list-tile-title>
                            <v-list-tile-sub-title>Choose whether to display raw output</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-card-text>
            <div style="flex: 1 1 auto;"></div>
        </v-card>
    </v-dialog>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'settings',
    methods: {
      setOpen: function (value) {
        this.$store.commit('settings/setOpen', value)
      },
      closeWindow: function () {
        this.setOpen(false)
      },
      onKeyUp: function (event) {
        if (event.keyCode === 27) {
          event.preventDefault()
          event.stopPropagation()
          this.closeWindow()
        }
      }
    },
    watch: {
      // whenever question changes, this function will run
      open: function (newOpen) {
        if (newOpen && process.browser) {
          window.addEventListener('keyup', this.onKeyUp, true)
        } else if (process.browser) {
          window.removeEventListener('keyup', this.onKeyUp, true)
        }
      }
    },
    computed: {
      ...mapState('settings', ['console']),
      open: {
        get () {
          return this.$store.state.settings.open
        },
        set (value) {
          this.setOpen(value)
        }
      },
      displayPlainText: {
        get () {
          return this.console.displayPlainText
        },
        set (value) {
          this.$store.commit('settings/setDisplayPlainText', { value })
        }
      }
    }
  }
</script>

<style scoped>

</style>