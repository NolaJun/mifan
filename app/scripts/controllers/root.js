// Generated by CoffeeScript 1.7.1
"use strict";
Mifan.controller("rootCtrl", function($scope, $cookieStore, $http, $timeout, $storage, $emoji, $cacheFactory) {
  var API, Ask, Cache, MBill, MDesign, MMenu, Page, User, elMwrap, store;
  API = $scope.API;
  $storage.put = $storage.set;
  store = IsWebapp ? $storage : $cookieStore;
  $scope.supportNum = "1万";

  /*
  用户信息，用户操作的方法
   */
  User = {
    init: function() {
      $scope.user = {};
      $scope.accessToken = $scope.UID = void 0;
      $scope.isLogin = false;
      $scope.$on("onLogined", User.onLoginCb);
      $scope.User = User;
      return User.getLocal();
    },
    set: function(user) {
      $scope.user.username = user["username"] || "";
      $scope.user.email = user["email"] || "";
      $scope.user.face = user["face"] || "";
      $scope.user.face_60 = user["face_60"] || "";
      $scope.user.face_120 = user["face_120"] || "";
      $scope.user.sex = user["sex"] || "1";
      $scope.user.blog = user["blog"] || "";
      return $scope.user.uid = user["userid"] || "";
    },
    getRemote: function() {
      var uid, url;
      uid = $scope.user.uid;
      url = ("" + API.userInfo) + (IsDebug ? "" : "/" + uid) + ("" + $scope.privacyParam);
      return $http.get(url).success(User.getRemoteCb).error(User.getRemoteErrorCb);
    },
    getRemoteCb: function(data) {
      var ret, user;
      ret = data["ret"];
      if (String(ret) === "100000") {
        user = data["result"];
        User.set(user);
        $scope.isLogin = true;
        return $scope.$broadcast("getHomeNews");
      } else {
        return User.onOutOfDate();
      }
    },
    getRemoteErrorCb: function(data) {},
    isLocalLogin: false,
    getLocal: function() {
      var accessToken, uid;
      uid = store.get("mUID");
      accessToken = store.get("mAccessToken");
      if (uid && accessToken) {
        return User.getLocalCb(uid, accessToken);
      }
    },
    getLocalCb: function(uid, accessToken) {
      var username;
      User.isLocalLogin = true;
      username = store.get("mUsername");
      $scope.user.uid = $scope.UID = uid;
      $scope.user.face_60 = $scope.user.face_120 = $scope.DEFAULT_FACE;
      $scope.user.username = username;
      $scope.accessToken = accessToken;
      User.setPrivacy();
      return User.getRemote();
    },
    setPrivacy: function() {
      var accessToken, uid;
      accessToken = $scope.accessToken;
      uid = $scope.UID;
      $scope.privacyParam = "?access_token=" + accessToken + "&userid=" + uid;
      return $scope.privacyParamDir = "/access_token/" + accessToken + "/userid/" + uid;
    },
    store: function(user) {
      store.put("mUID", user["userid"]);
      store.put("mUsername", user["username"]);
      return store.put("mAccessToken", $scope.accessToken);
    },
    remove: function() {
      store.remove("mUID");
      store.remove("mUsername");
      return store.remove("mAccessToken");
    },
    onLoginCb: function(event, result) {
      var accessToken, user;
      $scope.isLogin = true;
      accessToken = $scope.accessToken = result["accesstoken"];
      user = result["user"];
      $scope.UID = user["userid"];
      $scope.user.accessToken = accessToken;
      User.set(user);
      return User.store(user);
    },
    onOutOfDate: function() {
      User.remove();
      $scope.isLogin = false;
      return User.login();
    },
    logout: function() {
      $scope.user = {};
      $cookieStore.remove("mUID");
      $cookieStore.remove("mAccessToken");
      return $scope.isLogin = false;
    },
    login: function() {
      return LOC["href"] = "#!/login";
    }
  };
  User.init();

  /*
  页面切换，页面操作
   */
  elMwrap = DOC["getElementById"]("m-wrap");
  Page = {
    init: function() {
      $scope.page = "home";
      $scope.scrollBody1Px = Page.scrollBody1Px;
      $scope.backToTop = Page.onBackToTop;
      $scope.$on("pageChange", Page.onPageChangeCb);
      $scope.logout = User.logout;
      return $scope.Page = Page;
    },
    onPageChangeCb: function(event, msg) {
      $scope.page = msg;
      return elMwrap["scrollTop"] = 1;
    },
    onBackToTop: function(isM) {
      return (isM ? elMwrap : BODY)["scrollTop"] = 0;
    },
    scrollBody1Px: function() {
      if (elMwrap["scrollTop"] === 0) {
        return elMwrap["scrollTop"] = 1;
      }
    }
  };
  Page.init();

  /*
  移动用户侧边栏菜单
   */
  MMenu = {
    init: function() {
      $scope.isMMenuOpen = false;
      $scope.toggleMMenu = MMenu.toggle;
      return $scope.MMenu = MMenu;
    },
    toggle: function() {
      return $scope.isMMenuOpen = !$scope.isMMenuOpen;
    }
  };
  MMenu.init();

  /*
  移动全屏输入框
   */
  MDesign = {
    init: function() {
      $scope.isMDesignOpen = false;
      $scope.isMDesignOpenMask = false;
      $scope.toggleMDesign = MDesign.toggle;
      return $scope.$on("onMDesignSend", MDesign.onSend);
    },
    toggle: function(type) {
      if ($scope.isMDesignOpen) {
        $scope.isMDesignOpenMask = !$scope.isMDesignOpenMask;
        $timeout(function() {
          return $scope.isMDesignOpen = !$scope.isMDesignOpen;
        }, 200);
      } else {
        $scope.isMDesignOpen = !$scope.isMDesignOpen;
        $timeout(function() {
          return $scope.isMDesignOpenMask = !$scope.isMDesignOpenMask;
        }, 200);
      }
      if ($scope.isMBillOpen) {
        MBill.toggle();
      }
      if (type && $scope.isMDesignOpen) {
        $scope.$broadcast("setMDesignType", type);
      }
      if (!$scope.isMDesignOpen) {
        return $scope.$broadcast("cancelMDesingSending");
      }
    },
    onSend: function(event, msg) {
      var content, type;
      type = msg.type;
      content = msg.content;
      switch (type) {
        case "ask":
          return Ask.ask(content);
      }
    },
    onOpen: function() {},
    onClose: function() {}
  };
  MDesign.init();

  /*
  移动底部弹出交互菜单
   */
  MBill = {
    init: function() {
      $scope.isMBillOpen = false;
      $scope.isMBillOpenMask = false;
      return $scope.toggleMBill = MBill.toggle;
    },
    toggle: function(billList) {
      if ($scope.isMBillOpen) {
        $scope.isMBillOpenMask = !$scope.isMBillOpenMask;
        return $timeout(function() {
          return $scope.isMBillOpen = !$scope.isMBillOpen;
        }, 200);
      } else {
        $scope.$broadcast("setBillList", billList);
        $scope.isMBillOpen = !$scope.isMBillOpen;
        return $timeout(function() {
          return $scope.isMBillOpenMask = !$scope.isMBillOpenMask;
        }, 100);
      }
    }
  };
  MBill.init();

  /*
  提问
   */
  Ask = {
    init: function() {
      return $scope.askQues = Ask.ask;
    },
    ask: function(content) {
      var url;
      url = "" + API.ask + $scope.privacyParamDir;
      if (IsDebug) {
        url = API.ask;
      }
      return (IsDebug ? $http.get : $http.post)(url, {
        content: content
      }).success(Ask.askCb);
    },
    askCb: function(data) {
      var ret;
      ret = data["ret"];
      if (String(ret) === "100000") {
        $scope.$broadcast("onAskQuesSuccess", {
          queId: data["result"]
        });
        return $scope.$broadcast("onMDesignSendSuccess");
      }
    }
  };
  Ask.init();

  /*
  缓存的配置
   */
  Cache = {
    init: function() {
      var $httpDefaultCache, lruCache;
      $httpDefaultCache = $cacheFactory.get($http);
      return lruCache = $cacheFactory("lruCache", {
        capacity: 8
      });
    }
  };
  return Cache.init();
});
