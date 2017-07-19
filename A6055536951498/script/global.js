
var website = "http://shop.tikyy.com";
//var website = "http://192.168.1.117:2080";

var glo = {
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
    $api.setStorage('is_distribut', res.s_distribut);
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
    $api.rmStorage('user_id');
    $api.rmStorage('is_distribut');
    $api.rmStorage('uname');
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
   var self = this;
   this.get('/mobile/user/app_logout', function(res) {
      self.open_frame({url: './login.html'});
   });
  },
  reload: function() {
    var self = this;
    api.setCustomRefreshHeaderInfo({
      bgColor: '#fff',
    }, function() {
        api.refreshHeaderLoadDone();
        self.reload();
        location.reload();
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
