data.forEach(function (data, i) {
    const template = `
    <div class="secondary">
    <div id="content">
        <div id="video">
            <div id="thumnail">
                <div id="thumnail-images">
                </div>
            </div>
            <div id="video-text">
                <ul>
                    <li id="video-name">${data[i].video_title}</li>
                    <div id = "channel-desc">
                        <li id="chnnel-name">${data[i].video_channel}</li>
                        <li id="channel-views">${data[i].views}</li>
                    </div> 
                </ul>
            </div> 
        </div>
    </div>
</div>
      `;
    $(".row").append(template);
});