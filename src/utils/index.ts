import * as filters from './filters';


var MyFilters = {
  install: function(Vue) {
    for (let key in filters) {
      Vue.filter(key, filters[key])
    }
  }
}

export default MyFilters;