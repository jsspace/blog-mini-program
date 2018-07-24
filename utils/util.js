const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
};

const chunkRender = (data, bindName, target) => {
  const chunk = 30;
  const duration = 200;
  let index = 1;
  let nodes = data[bindName].nodes;
  data[bindName].nodes = data[bindName].nodes.slice(0, chunk);
  target.setData(data);

  let nodeStore = [];

  while (nodes.length > index * chunk) {
    let start = index * chunk;
    let end = (index + 1) * chunk;
    nodeStore.push(nodes.slice(start, end));
    index++;
  }

  nodeStore.forEach((node, index) => {
    setTimeout(function(node) {
      return function () {
        let preNodes = target.data[bindName];
        preNodes.nodes = preNodes.nodes.concat(node);
        let data = {};
        data[bindName] = preNodes;
        target.setData(data);
      }
    }(node), index * duration)
  });
};


module.exports = {
  formatTime: formatTime,
  chunkRender: chunkRender
}
