const DirectiveFocus = {
  beforeMount (el, binding, vnode, prevVnode) {
    console.log('custom directive => beforeMount', el, binding, vnode, prevVnode)
  },
  mounted (el) {
    el.focus()
    console.log('custom directive => mounted', el)
  },
  beforeUpdate () {
    console.log('custom directive => beforeUpdate')
  },
  updated () {
    console.log('custom directive => updated')
  },
  beforeUnmount () {
    console.log('custom directive => beforeUnmount')
  }, // new
  unmounted () {
    console.log('custom directive => unmounted')
  }
}

export default DirectiveFocus
