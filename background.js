function copy_to_clipboard(string) {
    var text_area = document.createElement('textarea');
    document.body.appendChild(text_area);
    text_area.value = string;
    text_area.select();
    document.execCommand('copy');
    document.body.removeChild(text_area);
}

function escape_shell(input) {
    return '"'+input.replace(/(["\s'$`\\])/g,'\\$1')+'"';
}

function cookie_callback(url, callback) {
    chrome.cookies.getAll({ url: url }, function(cookies) {
        var cookie_text = '';
        cookies.forEach(function(item) {
            cookie_text += item.name + '=' + item.value + '; ';
        });
        callback(cookie_text);
    });
}

function wget_handler(info, tab) {
    var url = info.linkUrl || info.pageUrl;
    cookie_callback(url, function(cookie_str) {
        var command = 'wget --cookies=off --header "Cookie: ' + cookie_str + '" ' + escape_shell(url);
        // command += ' --content-disposition';
        copy_to_clipboard(command);
    });
}

function curl_handler(info, tab) {
    var url = info.linkUrl || info.pageUrl;
    cookie_callback(url, function(cookie_str) {
        var command = 'curl -L --cookie "' + cookie_str + '" ' + escape_shell(url) + ' -O';
        copy_to_clipboard(command);
    });
}

chrome.contextMenus.create({
    "title" : "Copy as wget(this link)",
    "type" : "normal",
    "contexts" : ["link"],
    "onclick" : wget_handler
});

chrome.contextMenus.create({
    "title" : "Copy as wget(this site)",
    "type" : "normal",
    "contexts" : ["page"],
    "onclick" : wget_handler
});

chrome.contextMenus.create({
    "title" : "Copy as cURL(this link)",
    "type" : "normal",
    "contexts" : ["link"],
    "onclick" : curl_handler
});

chrome.contextMenus.create({
    "title" : "Copy as cURL(this site)",
    "type" : "normal",
    "contexts" : ["page"],
    "onclick" : curl_handler
});
