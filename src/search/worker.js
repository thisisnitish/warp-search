/*eslint-disable*/

export default () => {
  self.addEventListener('message', e => {
    if (!e) return

    const { record, searchText } = e.data
    const filteredData = performSearch(record, searchText)

    postMessage(filteredData)
  })

  const performSearch = (data, value) => {
    value = value.trim()

    if (value == '') return data

    const filteredData = data.filter(record => {
      return Object.keys(record).some(key =>
        String(record[key])
          .toLowerCase()
          .includes(value.toLowerCase()),
      )
    })

    console.log('filteredWorker: ', filteredData, data, value)
    return filteredData
  }
}

/** Using Libraries in web worker */

/**


 // Add in index.js

 import WebWorker from 'worker-loader!./<file-name>.worker.js'
 const workerThread = new WebWorker()


// Add in worker.js

import Fuse from 'fuse.js'

self.addEventListener('message', e => {
  if (!e) return

  const { record, searchText } = e.data
  const filteredData = performSearch(record, searchText)

  postMessage(filteredData)
})

const performSearch = (data, value) => {
  value=value.trim()
  const fuse = new Fuse(data, {
    threshold: 0,
    keys: Object.keys(data[0]),
    // includeMatches: true,
    // ignoreLocation: true,
  })
  console.log('fuse', fuse)
  if (value == '') {
    return data
  }
  const filteredData = fuse.search(value)

  console.log('filteredWorker: ', filteredData,data,value)
  return filteredData.map(res => res.item)
}


 */
