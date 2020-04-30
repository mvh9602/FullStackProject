// makes a POST for logging in when login button is pressed
const handleLogin = (e) => {
    e.preventDefault();

    $("#appMessage").animate({width:'hide'}, 350);

    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
}

// makes a POST for signing up when signup button is pressed
const handleSignup = (e) => {
    e.preventDefault();

    $("#appMessage").animate({width:'hide'}, 350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("Username or password is empty");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
    console.log($("#signupForm").serialize());

    return false;
}

// React component for the pop-up login window
const LoginWindow = (props) => {
    return (
        <form id="loginForm" name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username"/>
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Sign in" />

        </form>
    );
};

// React component for the pop-up signup window
const SignupWindow = (props) => {
    return (
        <form id="signupForm" name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username"/>
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password"/>
        <label htmlFor="pass2">Password: </label>
        <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Sign Up" />

        </form>
    );
};

// Renders the login and appropriate nav React
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <Header csrf={csrf} currentPage={"login"} />, document.querySelector("#nav")
    );

    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

// Renders the signup and appropriate nav React
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <Header csrf={csrf} currentPage={"signup"} />, document.querySelector("#nav")
    );

    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

// Renders the page and determines if a user is signed in or not
const setup = (csrf) => {
    const currentPage = (getUserInfo() ? "loggedIn" : "loggedOut");
    
    ReactDOM.render(
        <Header csrf={csrf} currentPage={currentPage} />, document.querySelector("#nav")
    );
    
    ReactDOM.render(
        <PostFeed csrf={csrf} posts={[]} />, document.querySelector("#posts")
    );

    loadPostsFromServer(csrf);
};

// GET request for the csrf token
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

// Runs when the document is loaded
$(document).ready(function() {
    console.log("Login do be ready");
    getToken();
});

// Helper function for checking locally stored logged in user id
const getUserInfo = () => {
    return localStorage.getItem('userInfo');
}

// React component for list of posts, maps post nodes to itself
const PostFeed = function(props) {
    const{csrf = false} = props;
    if(props.posts.length === 0) {
        return (
            <div className="postFeed">
                <h3 className="emptyPost">No posts found...</h3>
            </div>
        );
    }

    const user = getUserInfo();
    const postNodes = props.posts.map(function(post) {
        return <PostNode post={post} user={user} csrf={csrf}></PostNode>
    });

    return (
        <div className="postFeed">
            {postNodes}
        </div>
    );
};

// React class for posts, displays relevent info, dynamically creates like and delete buttons
class PostNode extends React.Component {
    constructor(props){
        super(props);
        // setting class state to likedBy for access/re-rendering
        this.state = {likedBy: props.post.likedBy};
        this.handleLike = this.handleLike.bind(this);
    }

    // Deletes a post when the user clicks the delete button, only the user who made the post can delete it
    handleDelete(id, csrf, e) {
        e.preventDefault();
        sendAjax('POST', '/deletePost', `id=${id}&_csrf=${csrf}`, () => {
            console.log("Delete received");
            loadPostsFromServer(csrf);
        });
    }

    // Likes a post if the user clicks the like button, unlikes if user already clicked like before
    handleLike(id, csrf, e) {
        e.preventDefault();
        
        sendAjax('POST', '/likePost', `id=${id}&_csrf=${csrf}`, (data) => {
            this.setState({likedBy: data.likedBy});
        });
    };

    render() {
        const {post, user, csrf} = this.props;
        let likedText = "Like Post";
        let userLiked = false;
        const {likedBy} = this.state;
        console.log(user);
        // Changes like button text based off whether the current user has liked this post or not
        if(user){
            for(let i = 0; i < likedBy.length; i++){
                if(user === likedBy[i]) userLiked = true;
            }
            likedText = (userLiked ? "Unlike Post" : "Like Post");
        }
        return (
            <div key={post._id} className="post">
                <img src="/assets/img/speech.png" alt="profile icon" className="profilePic" />
                <h3 className="postOwner"> Name: {post.ownerName} </h3>
                {user && post.owner === user && <button className="deleteButton" onClick={
                    (e) => this.handleDelete(post._id, csrf, e)}>x
                </button>}
                <h3 className="postBody"> {post.body} </h3>
                <h3 className="postLikes"> Likes: {likedBy.length} </h3>
                {user && <button className="likeButton" onClick={
                    (e) => this.handleLike(post._id, csrf, e)}>{likedText}
                </button>
                }
            </div>
        );

    }
}

// Requests posts from the server, then renders them in the post feed
const loadPostsFromServer = (csrf) => {
    sendAjax('GET', '/getPosts', null, (data) => {
        ReactDOM.render(
            <PostFeed csrf={csrf} posts={data.posts} />, document.querySelector("#posts")
        );
    });
};