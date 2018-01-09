export const state = () => ({
  console: {
    displayRawOutput: true
  },
  open: false
})

export const mutations = {
  setOpen: (state, {value}) => {
    state.open = value
  },
  setDisplayRawOutput: (state, {value}) => {
    state.console.displayRawOutput = value
  }
}

export const actions = {

}
