/**
 * Created by wxji on 2017-09-05.
 */
export default{
  install (Vue, options) {
    let callback = null
    const ws = new window.WebSocket(options.url)
    ws.onmessage = (e) => {
      if (callback) {
        callback(JSON.parse(e.data))
        callback = null
      }
    }
    Vue.prototype.$ws = (action, data, fn) => {
      callback = fn
      if (ws.readyState > 0) {
        ws.send(JSON.stringify({action: action, data: data}))
      } else {
        ws.onopen = () => {
          ws.send(JSON.stringify({action: action, data: data}))
        }
      }
    }
  }
}
