
//var website = "http://share.tikyy.com";
var website = "http://192.168.1.113:7002";
var website_zmz = "http://192.168.1.112:8010";

var glo = {
  init: function(data) {
    if(!data)
      data = {}
    this.fix_header(data.header? data.header: '#header');
  },
  fix_header: function(name) {
    var header = $api.dom(name);
    $api.fixIos7Bar(header);
  },
  open_frame: function(pageList){
    if(!$.isArray(pageList))
      pageList = [pageList];

    for(index in pageList) {
      var url = pageList[index].url;
      if(!url) {
        continue;
      }

      var arr = url.split('/');
      var name = arr[arr.length - 1].split('.')[0];
      if(!arr[arr.length - 2]) {
        alert('url不规范');
        return;
      } else if(arr[arr.length - 2] && arr[arr.length - 2] == '.') {
        var href = location.href.split('/');
        name = href[href.length - 2] + '_' + name;
      } else {
        name = arr[arr.length - 2] + '_' + name;
      }

      pageList[index].name = name;
      api.openFrame(pageList[index]);
    }
  },
  open_win: function(pageList){
    if(!$.isArray(pageList))
      pageList = [pageList];
    for(index in pageList) {
      var url = pageList[index].url;
      if(!url) {
        continue;
      }

      var arr = url.split('/');
      var name = arr[arr.length - 1].split('.')[0];
      if(!arr[arr.length - 2]) {
        alert('url不规范');
        return;
      } else if(arr[arr.length - 2] && arr[arr.length - 2] == '.') {
        var href = location.href.split('/');
        name = href[href.length - 2] + '_' + name;
      } else {
        name = arr[arr.length - 2] + '_' + name;
      }
      pageList[index].name = name;
      api.openWin(pageList[index]);
    }
  },
  get: function(url, callback) {
    var url_split = url.split(website);
    if(!url_split[1]) {
      url = website + url;
    }
    if($api.getStorage('token')) {
      var token = $api.getStorage('token');
      url = addParama(url, 'token', token);
    }

    url = addParama(url, 'device_code', '1');
    $api.get(url, callback);
  },
  post: function(url, data, callback) {
    var url_split = url.split(website);
    if(!url_split[1]) {
      url = website + url;
    }

    if($api.getStorage('token')) {
      var token = $api.getStorage('token');
      url = addParama(url, 'token', token);
    }

    url = addParama(url, 'device_code', '1');
    $api.post(url, {values: data}, callback);
  },

  check_login: function(redirect) {
    var self = this;
    if($api.getStorage('token')) {
        return true;
    } else {
      self.open_win({url:'html/login/login.html', pageParam: {'from': redirect}});
      return false;
    }

  },
  set_loginInfo: function(res) {
    $api.setStorage('user_id', res.user_id);
    $api.setStorage('head_pic', res.head_pic);
    $api.setStorage('uname', res.uname);
    $api.setStorage('mobile', res.mobile);
    $api.setStorage('token', res.token);
  },
  echo: function(object) {
    if(typeof(object) == "string") {
      alert(object)
    } else {
      alert(JSON.stringify(object));
      //jsonToStr
    }
  },
  alert: function(msg, duration) {
    if(!duration)
      duration = 3000;
    api.toast({
        msg : msg,
        duration : duration,
        location : 'bottom'
    });
  },
  clear: function() {
    api.execScript({
        name: 'root',
        script: 'closeSideNav()'
    });
    $api.rmStorage('user_id');
    $api.rmStorage('uname');
    $api.rmStorage('head_pic');
    $api.rmStorage('mobile');
    $api.rmStorage('token');
    api.toast({
        msg : '清除成功',
        duration : 2000,
        location : 'bottom'
    });
  },
  logout: function() {
   this.clear();
   api.closeWin();
  },
  reload: function(callback) {
    var self = this;
    api.setCustomRefreshHeaderInfo({
      bgColor: '#fff',
    }, function() {
      api.refreshHeaderLoadDone();
      callback();
    });
  },
  scrolltobottom: function(callback){
    var callback2 = function() {
      api.toast({
          msg : '加载更多...',
          duration : 2000,
          location : 'bottom'
      });
      callback();
    }
    api.addEventListener({
      name:'scrolltobottom',
      extra:{
         threshold:0     //设置距离底部多少距离时触发，默认值为0，数字类型
       }
     }, callback2
   );
  },
  show_progress: function() {
    api.showProgress({
     style: 'default',
     animationType: 'zoom',
     title: '',
     text: '拼命的在加载...',
     modal: true
   });
   setTimeout("glo.hide_progress()",3000);
 },
 hide_progress: function(){
     api.hideProgress();
 },


}
function addParama(url, key, val) {
  if (url.indexOf('?') != -1) {
    url += '&' + key + '=' + val;
  } else {
    url += '?' + key + '=' + val;
  }
  return url;
}
