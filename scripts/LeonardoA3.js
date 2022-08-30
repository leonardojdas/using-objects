let allPosts = [];

window.onload=function() {
    // bonus
    let url = "json/blogPostsAlt.json";
    //let url = "json/blogPosts.json";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (
            xhr.readyState === XMLHttpRequest.DONE &&
            xhr.status === 200
        ) {
            createPostsObject(xhr.responseText);
        }
    };
    xhr.open("GET", url, true);
    xhr.send();

    let btnSearch = document.querySelector("#btnSearch");
    btnSearch.addEventListener("click", searchPost);

    let btnReset = document.querySelector("#btnReset");
    btnReset.addEventListener("click", resetSearch);
};

function createPostsObject(content)
{
    let temp = JSON.parse(content).blogPosts;
    let id = 1;

    temp.forEach(e => {
        allPosts.push({
            id: id++,
            title: e.blogPostTitle,
            author: e.blogPostAuthor,
            date: formatDate(e.blogPostDate),
            edit: formatDate(e.blogPostEdit),
            body: e.blogPostBody,
            likes: e.blogPostLikes,
            shares: e.blogPostShares,
            tags: e.blogPostTags, // string array
            comments: loadObjectComments(e.blogPostComments), // comment object
            likedBy: e.blogPostLikedBy // string array
        });
    });

    displayPosts(allPosts);
}

function formatDate(date)
{
    let d1 = new Date(date);
    let d2 = new Date();

    d2.setFullYear(d1.getUTCFullYear());
    d2.setMonth(d1.getUTCMonth());
    d2.setDate(d1.getUTCDate());
    d2.setHours(0);
    d2.setMinutes(0);
    d2.setSeconds(0);

    d2 = d2.toDateString().split(" ").slice(1).join(" ");
    
    return d2;
}

function loadObjectComments(objComments)
{
    let objRes = [];
    objComments.forEach(e => {
        objRes.push({
            author: e.commentAuthor,
            date: formatDate(e.commentDate),
            body: e.commentBody
        });    
    });
    return objRes;
}

function displayPosts(objPosts)
{
    let totalPosts = objPosts.length
    document.querySelector("#totalPosts").innerHTML = totalPosts;

    let htmlPosts = createPostHtml(objPosts);
    document.querySelector("#contentPosts").innerHTML = htmlPosts;
}

function createPostHtml(obj)
{
    let res = "";
    
    obj.forEach(e => {
        res += `<div id="post${e.id}" class="post">`;
        res += `<div class="postTitle">${e.title}</div>`;
        res += `<div class="postWritten">Written by ${e.author}</div>`;
        res += `<div class="postDate">Posted: ${e.date}</div>`;
        res += `<div class="postEdit">Edit: ${e.edit}</div>`;
        res += `<div class="postBody">${e.body}</div>`;
        res += `<div class="postLikesShares">Likes: ${e.likes} | Shares: ${e.shares}</div>`;
        res += `<div class="postTags">Tags:`;
        e.tags.forEach(el => {
            res += `<span class="tagPill">${el}</span>`;
        });
        res += `</div>`;
        res += `<div class="postComments">Comments`;
        e.comments.forEach(el => {
            res += `<div class="commentAuthor">${el.author} | ${el.date}</div>`;
            res += `<div class="commentBody">${el.body}</div>`;
        });
        res += `</div>`;
        res += `</div>`;
    });

    return res;
}

function searchPost()
{
    let searchObj = filterObj();
    displayPosts(searchObj);
}

function filterObj()
{
    let title = document.querySelector("#searchTitle").value
    let tags = document.querySelector("#searchTags").value
    let dateFrom = document.querySelector("#dateFrom").value;
    let dateTo = document.querySelector("#dateTo").value;
    let hasComments = document.querySelector("#hasComments").checked;
    let hasLikes = document.querySelector("#hasLikes").checked;
    let hasShares = document.querySelector("#hasShares").checked;

    let searchObj = allPosts;
    let tempObj = [];

    if(title !== "")
        searchObj = searchObj.filter(e => e.title.toLowerCase().indexOf(title) !== -1);

    if(tags !== "")
    {
        searchObj.forEach(e => {
            e.tags.forEach(el => {
                if(el.toLowerCase() === tags.toLowerCase())
                    tempObj.push(e);
            });
        });
        searchObj = tempObj;
    }

    if(dateFrom || dateTo)
    {
        if(dateFrom && dateTo)
            searchObj = searchObj.filter(e => 
                Date.parse(e.date) >= Date.parse(dateFrom) &&
                Date.parse(e.date) <= Date.parse(dateTo));
        else if(dateFrom)
            searchObj = searchObj.filter(e => Date.parse(e.date) >= Date.parse(dateFrom));
        else
            searchObj = searchObj.filter(e => Date.parse(e.date) <= Date.parse(dateTo));
    }

    if(hasComments)
        searchObj = searchObj.filter(e => e.comments.length > 0);

    if(hasLikes)
        searchObj = searchObj.filter(e => e.likes > 0);
    
    if(hasShares)
        searchObj = searchObj.filter(e => e.shares > 0);

    return searchObj;
}

function resetSearch()
{
    document.querySelector("#searchTitle").value = null;
    document.querySelector("#searchTags").value = null;
    document.querySelector("#dateFrom").value = null;
    document.querySelector("#dateTo").value = null;
    document.querySelector("#hasComments").checked = false;
    document.querySelector("#hasLikes").checked = false;
    document.querySelector("#hasShares").checked = false;

    displayPosts(allPosts);
}