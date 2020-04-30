// Sends a POST when a post is created (I got confused many times)
const handlePost = (e, csrf) => {
    e.preventDefault();

    $("#postMessage").animate({width:'hide'},350);

    if($("#postBody").val() == '') {
        handleError("Post text is required");
        return false;
    }

    sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), redirect);

    return false;
};

// React component for the post text entry
const PostForm = (props) => {
    return (
        <form id="postForm"
        onSubmit={(e) => handlePost(e, props.csrf)}
        name="postForm"
        action="/maker"
        method="POST"
        className="postForm"
        >

            <label htmlFor="body">Post: </label>
            <textarea className="form-control" id="postBody" name="body" placeholder="Type your post out here" rows="3"></textarea>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makePostSubmit" type="submit" value="Make Post" />

        </form>
    );
};

// Renders the nav and post form
const setup = (csrf) => {
    ReactDOM.render(
        <Header csrf={csrf} currentPage={"maker"} />, document.querySelector("#nav")
    );

    ReactDOM.render(
        <PostForm csrf={csrf} />, document.querySelector("#makePost")
    );
};

// GET request for the csrf token
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

// Runs when the document is loaded
$(document).ready(function() {
    getToken();
});