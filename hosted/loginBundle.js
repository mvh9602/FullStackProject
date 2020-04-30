"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var handleLogin = function handleLogin(e) {
  e.preventDefault();
  $("#appMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty");
    return false;
  }

  console.log($("input[name=_csrf]").val());
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();
  $("#appMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("Username or password is empty");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  console.log($("#signupForm").serialize());
  return false;
};

var LoginWindow = function LoginWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "loginForm",
      name: "loginForm",
      onSubmit: handleLogin,
      action: "/login",
      method: "POST",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Username: "), /*#__PURE__*/React.createElement("input", {
      id: "user",
      type: "text",
      name: "username",
      placeholder: "username"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass"
    }, "Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass",
      type: "password",
      name: "pass",
      placeholder: "password"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Sign in"
    }))
  );
};

var SignupWindow = function SignupWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "signupForm",
      name: "signupForm",
      onSubmit: handleSignup,
      action: "/signup",
      method: "POST",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Username: "), /*#__PURE__*/React.createElement("input", {
      id: "user",
      type: "text",
      name: "username",
      placeholder: "username"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass"
    }, "Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass",
      type: "password",
      name: "pass",
      placeholder: "password"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass2"
    }, "Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass2",
      type: "password",
      name: "pass2",
      placeholder: "retype password"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Sign Up"
    }))
  );
};

var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(Header, {
    csrf: csrf,
    currentPage: "login"
  }), document.querySelector("#nav"));
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(Header, {
    csrf: csrf,
    currentPage: "signup"
  }), document.querySelector("#nav"));
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  var currentPage = getUserInfo() ? "loggedIn" : "loggedOut";
  ReactDOM.render( /*#__PURE__*/React.createElement(Header, {
    csrf: csrf,
    currentPage: currentPage
  }), document.querySelector("#nav")); //createLoginWindow(csrf);

  ReactDOM.render( /*#__PURE__*/React.createElement(PostFeed, {
    csrf: csrf,
    posts: []
  }), document.querySelector("#posts"));
  loadPostsFromServer(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  console.log("Login do be ready");
  getToken();
});

var getUserInfo = function getUserInfo() {
  return localStorage.getItem('userInfo');
};

var PostFeed = function PostFeed(props) {
  var _props$csrf = props.csrf,
      csrf = _props$csrf === void 0 ? false : _props$csrf;

  if (props.posts.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "postFeed"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyPost"
      }, "No posts found..."))
    );
  }

  var user = getUserInfo();
  var postNodes = props.posts.map(function (post) {
    return (/*#__PURE__*/React.createElement(PostNode, {
        post: post,
        user: user,
        csrf: csrf
      })
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "postFeed"
    }, postNodes)
  );
};

var PostNode = /*#__PURE__*/function (_React$Component) {
  _inherits(PostNode, _React$Component);

  function PostNode(props) {
    var _this;

    _classCallCheck(this, PostNode);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PostNode).call(this, props));
    _this.state = {
      likedBy: props.post.likedBy
    };
    _this.handleLike = _this.handleLike.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PostNode, [{
    key: "handleDelete",
    value: function handleDelete(id, csrf, e) {
      e.preventDefault();
      sendAjax('POST', '/deletePost', "id=".concat(id, "&_csrf=").concat(csrf), function () {
        console.log("Delete received");
        loadPostsFromServer(csrf);
      });
    }
  }, {
    key: "handleLike",
    value: function handleLike(id, csrf, e) {
      var _this2 = this;

      e.preventDefault(); //console.log(this);

      sendAjax('POST', '/likePost', "id=".concat(id, "&_csrf=").concat(csrf), function (data) {
        _this2.setState({
          likedBy: data.likedBy
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          post = _this$props.post,
          user = _this$props.user,
          csrf = _this$props.csrf;
      var likedText = "Like Post";
      var userLiked = false;
      var likedBy = this.state.likedBy;
      console.log(user);

      if (user) {
        for (var i = 0; i < likedBy.length; i++) {
          if (user === likedBy[i]) userLiked = true;
        }

        likedText = userLiked ? "Unlike Post" : "Like Post";
      }

      return (/*#__PURE__*/React.createElement("div", {
          key: post._id,
          className: "post"
        }, /*#__PURE__*/React.createElement("img", {
          src: "/assets/img/speech.png",
          alt: "profile icon",
          className: "profilePic"
        }), /*#__PURE__*/React.createElement("h3", {
          className: "postOwner"
        }, " Name: ", post.ownerName, " "), user && post.owner === user && /*#__PURE__*/React.createElement("button", {
          className: "deleteButton",
          onClick: function onClick(e) {
            return _this3.handleDelete(post._id, csrf, e);
          }
        }, "x"), /*#__PURE__*/React.createElement("h3", {
          className: "postBody"
        }, " ", post.body, " "), /*#__PURE__*/React.createElement("h3", {
          className: "postLikes"
        }, " Likes: ", likedBy.length, " "), user && /*#__PURE__*/React.createElement("button", {
          className: "likeButton",
          onClick: function onClick(e) {
            return _this3.handleLike(post._id, csrf, e);
          }
        }, likedText))
      );
    }
  }]);

  return PostNode;
}(React.Component);

var loadPostsFromServer = function loadPostsFromServer(csrf) {
  sendAjax('GET', '/getPosts', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PostFeed, {
      csrf: csrf,
      posts: data.posts
    }), document.querySelector("#posts"));
  });
};
"use strict";

var Header = function Header(props) {
  // knows if logged in, logging in, signing up, making post
  var currentPage = props.currentPage,
      csrf = props.csrf;

  var handleLogin = function handleLogin(e) {
    e.preventDefault();
    createLoginWindow(csrf);
  };

  var handleSignup = function handleSignup(e) {
    e.preventDefault();
    createSignupWindow(csrf);
  };

  var handleLogout = function handleLogout(e) {
    e.preventDefault();
    sendAjax('GET', '/logout', null, redirect);
  };

  var loginButton = /*#__PURE__*/React.createElement("div", {
    className: "navlink"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: handleLogin,
    id: "loginButton",
    href: "/login"
  }, "Log in"));
  var signupButton = /*#__PURE__*/React.createElement("div", {
    className: "navlink"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: handleSignup,
    id: "signupButton",
    href: "/signup"
  }, "Sign up"));
  var backButton = /*#__PURE__*/React.createElement("div", {
    className: "navlink"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/"
  }, "Back"));
  var makerButton = /*#__PURE__*/React.createElement("div", {
    className: "navlink"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/maker"
  }, "Make a Post"));
  var logoutButton = /*#__PURE__*/React.createElement("div", {
    className: "navlink"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: handleLogout,
    href: "/logout"
  }, "Log out"));
  return (/*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement("a", {
      href: "/"
    }, /*#__PURE__*/React.createElement("img", {
      id: "logo",
      src: "/assets/img/doc.png",
      alt: "doc logo"
    })), currentPage === "loggedOut" && [loginButton, signupButton], currentPage === "login" && [backButton, signupButton], currentPage === "signup" && [backButton, loginButton], currentPage === "loggedIn" && [makerButton, logoutButton], currentPage === "maker" && [backButton, logoutButton])
  );
};
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#appMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#appMessage").animate({
    width: 'hide'
  }, 350);
  localStorage.setItem('userInfo', response.userId);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
