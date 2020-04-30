"use strict";

var handlePost = function handlePost(e, csrf) {
  e.preventDefault();
  $("#postMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#postBody").val() == '') {
    handleError("Post text is required");
    return false;
  }

  sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), redirect);
  return false;
};

var PostForm = function PostForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "postForm",
      onSubmit: function onSubmit(e) {
        return handlePost(e, props.csrf);
      },
      name: "postForm",
      action: "/maker",
      method: "POST",
      className: "postForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "body"
    }, "Post: "), /*#__PURE__*/React.createElement("textarea", {
      className: "form-control",
      id: "postBody",
      name: "body",
      placeholder: "Type your post out here",
      rows: "3"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makePostSubmit",
      type: "submit",
      value: "Make Post"
    }))
  );
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(Header, {
    csrf: csrf,
    currentPage: "maker"
  }), document.querySelector("#nav"));
  ReactDOM.render( /*#__PURE__*/React.createElement(PostForm, {
    csrf: csrf
  }), document.querySelector("#makePost"));
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
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
