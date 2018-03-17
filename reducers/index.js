exports.UserLikesPost = ({user, post}) => (isLiked = false, event) => {
    if (user === event.params.user &&
        post === event.params.post) {

        if (event.name === 'PostLiked') {
            return true;
        } else if (event.name === 'PostUnliked') {
            return false;
        }
    }
    return isLiked;
};

exports.PostIsLiked = ({post}) => (isLiked = false, event) => {
    if (post === event.params.post) {
        if (event.name === 'PostLiked') {
            return true;
        } else if (event.name === 'PostUnliked') {
            return false;
        }
    }
    return isLiked;
};

exports.PostExists = ({post}) => (exists = false, event) => {
    if (post === event.params.post) {
        if (event.name === 'PostCreated') {
            return true;
        }
    }
    return exists;
};