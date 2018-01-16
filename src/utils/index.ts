import * as filters from './filters';


var MyFilters = {
  install: function(Vue) {
    for (let [key, value] of Object.keys(filters)) {
      Vue.filter(key, value)
    }
  }
}

export default MyFilters;