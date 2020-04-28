const handlePost = (e, csrf) => {
    e.preventDefault();

    $("#postMessage").animate({width:'hide'},350);

    if($("#postBody").val() == '') {
        handleError("Post text is required");
        return false;
    }

    sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), function() {
        loadPostsFromServer(csrf);
    });

    return false;
};

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
            <input id="postBody" type="text" name="body" placeholder="Type your post out here"/>
            <label htmlFor="likes">Likes: </label>
            <input id="postLikes" type="text" name="likes" placeholder="Placeholder test for like values"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makePostSubmit" type="submit" value="Make Post" />

        </form>
    );
};

const PostFeed = function(props) {
    const{csrf = false} = props;
    if(props.posts.length === 0) {
        return (
            <div className="postFeed">
                <h3 className="emptyPost">No posts found...</h3>
            </div>
        );
    }

    const postNodes = props.posts.map(function(post) {
        console.log(props);
        return (
            <div key={post._id} className="post">
                <img src="/assets/img/domoface.jpeg" alt="profile icon" className="profilePic" />
                <h3 className="postOwner"> Name: {post.owner} </h3>
                <h3 className="postBody"> {post.body} </h3>
                <h3 className="postLikes"> Likes: {post.likes} </h3>
                <button className="likeButton" onClick={
                    (e) => handleLike(post._id, csrf, e)}>Like this Post
                </button>
            </div>
        );
    });

    return (
        <div className="postFeed">
            {postNodes}
        </div>
    );
};

const handleLike = (id, csrf, e) => {
    e.preventDefault();
    console.log("Handling like...");

    sendAjax('POST', '/likePost', `id=${id}&_csrf=${csrf}`, function() {
        loadPostsFromServer(csrf);
    });
};

const loadPostsFromServer = (csrf) => {
    sendAjax('GET', '/getPosts', null, (data) => {
        ReactDOM.render(
            <PostFeed csrf={csrf} posts={data.posts} />, document.querySelector("#posts")
        );
    });
};

const setup = (csrf) => {
    if(!document.querySelector("#makePost")) return false;
    ReactDOM.render(
        <PostForm csrf={csrf} />, document.querySelector("#makePost")
    );
    
    console.log("Post maker: " + document.querySelector("#makePost"));

    ReactDOM.render(
        <PostFeed csrf={csrf} posts={[]} />, document.querySelector("#posts")
    );

    loadPostsFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});