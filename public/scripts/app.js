$(function () {

    function createTweetElement(tweetData) {
        //moment.js used in order to create the "now" or "recently" responses to timestamps. 
        //For some reason, the UNIX timestamp gives an extra seven minutes for some PCs. Tried to debug by subtracting directly from the timestamp, but for some reason, it fluctuates. 
        //For my laptop, it provides an accurate number. Not sure how to debug.
        const newTimeRead = moment(tweetData.created_at)
        const html = `
            <article class="tweet">
                <header class="tweet-header">
                <img class="profile-pic" src=${tweetData.user.avatars.small}>
                <h2 class="tweet-name">${tweetData.user.name}</h2>
                <p class="tweet-handle">${tweetData.user.handle}</p>
                </header>
                <main class="tweet-content">
                <p class="tweet-body">${escape(tweetData.content.text)}</p>
                </main>
                <footer class="tweet-footer">
                <p class="tweet-timestamp">${newTimeRead.fromNow()}</p>
                <div class="icons">
                <i class="fa fa-flag" aria-hidden="true"></i>
                <i class="fa fa-retweet" aria-hidden="true"></i>
                <i class="fa fa-heart" aria-hidden="true"></i>
                </div>
                </footer>
            </article>`;
        return html;
    }

    function escape(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function renderData(tweets) {
        //added line below to prevent reloading of the whole tweet history with each new tweet
        $('#tweets-container').empty();
        tweets.forEach((tweet) => {
            $('#tweets-container').prepend(createTweetElement(tweet))
        })
    };

    const $textBox = $('.form-layout');

    //function used to prevent tweets with no strings or strings passing 140 characters
    function charIsInvalid(characterCheck) {
        const tweetCharNumber = $(characterCheck).children().find(".text-box").context["0"].value.length
        return (tweetCharNumber > 140 || tweetCharNumber === 0) 
    }

    function generateTweet(event) {
        const $form = $(this);
        event.preventDefault()
        const inputInvalid = charIsInvalid($form)
        if (inputInvalid) {
            alert("Error! Text entered is either too long or nothng at all!")
        } else {
            $.ajax({
                type: 'POST',
                url: "/tweets",
                data: $form.serialize()
            })
            .done(() => {
                loadtweets(event)
                $form.find("textarea").val("")
                $form.find(".counter").text("140")
            })
        }
    }

    function loadtweets() {
        $.getJSON('/tweets')
            .done((tweets) => {
            })
            .done((tweets) => {
                renderData(tweets)
            })
    }
    
    loadtweets()
    //added jquery events to perform simple animations such as sliding up to hide the text-box and sliding down to show it when the compose button is clicked
    $textBox.on('submit', generateTweet)
    $(".compose-action").click(function () {
        $(".new-tweet").slideToggle(function () {
            if ($(".new-tweet").is(":visible")) {
                $(".new-tweet > form > textarea").focus();
            }
        })
    });
});