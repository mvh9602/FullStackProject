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

  sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), function () {
    loadPostsFromServer(csrf);
  });
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
    }, "Post: "), /*#__PURE__*/React.createElement("input", {
      id: "postBody",
      type: "text",
      name: "body",
      placeholder: "Type your post out here"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "likes"
    }, "Likes: "), /*#__PURE__*/React.createElement("input", {
      id: "postLikes",
      type: "text",
      name: "likes",
      placeholder: "Placeholder test for like values"
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

  var postNodes = props.posts.map(function (post) {
    console.log(props);
    return (/*#__PURE__*/React.createElement("div", {
        key: post._id,
        className: "post"
      }, /*#__PURE__*/React.createElement("img", {
        src: "/assets/img/domoface.jpeg",
        alt: "profile icon",
        className: "profilePic"
      }), /*#__PURE__*/React.createElement("h3", {
        className: "postOwner"
      }, " Name: ", post.owner, " "), /*#__PURE__*/React.createElement("h3", {
        className: "postBody"
      }, " ", post.body, " "), /*#__PURE__*/React.createElement("h3", {
        className: "postLikes"
      }, " Likes: ", post.likes, " "), /*#__PURE__*/React.createElement("button", {
        className: "likeButton",
        onClick: function onClick(e) {
          return handleLike(post._id, csrf, e);
        }
      }, "Like this Post"))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "postFeed"
    }, postNodes)
  );
};

var handleLike = function handleLike(id, csrf, e) {
  e.preventDefault();
  console.log("Handling like...");
  sendAjax('POST', '/likePost', "id=".concat(id, "&_csrf=").concat(csrf), function () {
    loadPostsFromServer(csrf);
  });
};

var loadPostsFromServer = function loadPostsFromServer(csrf) {
  sendAjax('GET', '/getPosts', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PostFeed, {
      csrf: csrf,
      posts: data.posts
    }), document.querySelector("#posts"));
  });
};

var setup = function setup(csrf) {
  if (!document.querySelector("#makePost")) return false;
  ReactDOM.render( /*#__PURE__*/React.createElement(PostForm, {
    csrf: csrf
  }), document.querySelector("#makePost"));
  console.log("Post maker: " + document.querySelector("#makePost"));
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
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
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
