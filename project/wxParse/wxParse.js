/**
 * author: Di (微信小程序开发工程师)
 * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
 *               垂直微信小程序开发交流社区
 * 
 * github地址: https://github.com/icindy/wxParse
 * 
 * for: 微信小程序富文本解析
 * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
 */

/**
 * utils函数引入
 **/
import HtmlToJson from './html2json.js';
var util = require('../utils/util.js');
/**
 * 配置及公有属性
 **/
var realWindowWidth = 0;
var realWindowHeight = 0;
wx.getSystemInfo({
  success: function (res) {
    realWindowWidth = res.windowWidth
    realWindowHeight = res.windowHeight
  }
})
/**
 * 主函数入口区
 **/
function wxParse(bindName = 'wxParseData', type='html', data='<div class="color:red;">数据不能为空</div>', target,imagePadding) {
  var that = target;
  var transData = HtmlToJson.html2json(data, bindName);
  transData.view = {};
  transData.view.imagePadding = 0;
  if(typeof(imagePadding) !== 'undefined'){
    transData.view.imagePadding = imagePadding
  }
  var bindData = {};
  bindData[bindName] = transData;
  bindData.title = that.data.title;
  util.chunkRender(bindData, bindName, target);
  wx.setStorage({
      key: that.id,
      data: bindData
  });
}

/**
 * 动态设置需要渲染的数据
 * @param bindName
 * @param transData
 * @param target
 */
function chunkRender(bindName, transData, target) {
  const chunk = 30;
  const duration = 300;
  let nodes = transData.nodes;
  let index = 1;
  let nodeStore = [];


  while (nodes.length > index * chunk) {
    let start = index * chunk;
    let end = (index + 1) * chunk;
    nodeStore.push(nodes.slice(start, end));
    index++;
  }
  let normal = {};
  normal[bindName] = transData;
  wx.setData(normal);

  nodeStore.forEach((item, index) => {
    setTimeout((function(node) {
      let preNodes = target.data[bindName];
      preNodes.nodes = preNodes.nodes.concat(node);
      let data = {};
      data[bindName] = preNodes;
      wx.setData({

      })
    }).bind(item), index * duration)
  })
}

function wxParseTemArray(temArrayName,bindNameReg,total,that){
  var array = [];
  var temData = that.data;
  var obj = null;
  for(var i = 0; i < total; i++){
    var simArr = temData[bindNameReg+i].nodes;
    array.push(simArr);
  }

  temArrayName = temArrayName || 'wxParseTemArray';
  obj = JSON.parse('{"'+ temArrayName +'":""}');
  obj[temArrayName] = array;
  that.setData(obj);
}

/**
 * 配置emojis
 * 
 */

function emojisInit(reg='',baseSrc="/wxParse/emojis/",emojis){
   HtmlToJson.emojisInit(reg,baseSrc,emojis);
}

module.exports = {
  wxParse: wxParse,
  wxParseTemArray:wxParseTemArray,
  emojisInit:emojisInit
}


