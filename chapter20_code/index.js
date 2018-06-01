function setLocalstorage () {
    var name = localStorage.username;
    name = localStorage["username"];
    localStorage.setItem("x", 1);
    localStorage.getItem("x");
}
/**
 * 
 * 
 * @param {any} name 
 * @param {any} value 
 * @param {any} daysToLive 
 * 如果要设置 cookie 的path, domain, secure属性，只需要在存储cookie值前，以如下字符串形式追加在cookie值的后面
 * ; path=path
 * ; domain=domain
 * ; secure
 * 
 * 要删除一个cookie，需要使用相同的名字，路径和域，然后指定一个任意的值，并将max-age属性指定为0.
 */
function setcookie(name, value, daysToLive) {
    var cookie = name + "=" + encodeURIComponent(value);
    if (typeof daysToLive === "number") {
        cookie += "; max-age=" + (daysToLive*60*60*24);
    }
    document.cookie = cookie;    
}

function getcookie() {
    var cookie = {};                    // 初始化最后要返回的对象
    var all = document.cookie;          // 在一个大写字符串中获取所有的cookie值
    if (all === "") {                   // 如果该cookie属性值为空字符串
        return cookie;                  // 返回一个空对象
    }
    var list = all.split("; ");         // 分离出名/值对
    for (var i = 0; i < list.length; i++) {         // 遍历每个cookie
        var cookie = list[i];
        var p = cookie.indexOf("=");                // 查找第一个"="符号
        var name = cookie.substring(0,p);           // 获得cookie名字
        var value = cookie.substring(p+1);          // 获取cookie对应的值
        value = decodeURIComponent(value);          // 对其值进行解码
        cookie[name] = value;
    }
    return cookie;
}

function cookieStorage(maxage, path) {              // 分别代表存储有效期和作用域

    // 获取一个存储全部cookie信息的对象
    var cookie = (function() {                      // 类似之前介绍的getcookie()函数
        var cookie = {};                            // 该对象最终返回
        var all = document.cookie;
        if (all === "") {
            return cookie;
        }
        var list = all.split("; ");
        for (var i = 0; i < list.length; i++) {
            var cookie = list[i];
            var p = cookie.indexOf("=");
            var name = cookie.substring(0, p);
            var value = cookie.substring(p + 1);
            value = decodeURIComponent(value);
            cookie[name] = value;
        }
        return cookie;
    }());

    var keys = [];
    for (var key in cookie) keys.push(key);

    // 现在定义存储API公共的属性和方法
    // 春初的cookie的个数
    this.length = keys.length;

    // 返回第n个cookie的名字，如果N越界则返回null
    this.key = function(n) {
        if (n < 0 || n >= keys.length) {
            return null;
        }
        return keys[n];
    };

    // 返回制定名字的cookie值，如果不存在则返回null.
    this.getItem = function(name) {
        return cookie[name] || null;
    };

    // 存储cookie值
    this.setItem = function(key, value) {
        if (! (key in cookie)) {
            keys.push(key);
            this.length++;
        }

        cookie[key] = value;

        var cookie = key + "=" + encodeURIComponent(value);

        // 将cookie的属性也加入到该字符串中
        if (maxage) cookie += "; max-age=" + maxage;
        if (path) cookie += "; path=" + path;

        // 通过document.cookie属性来设置cookie
        document.cookie = cookie;
    };

    // 删除指定的cookie
    this.removeItem = function(key) {
        if (! (key in cookie)) return;

        delete cookie[key];

        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === key) {
                keys.splice(i, 1);
                break;
            }
        }
        this.length --;

        document.cookie = key + "=; max-age=0";
    };

    // 删除所有的cookie
    this.clear = function() {
        for (var i = 0; i < keys.length; i++) {
            document.cookie = keys[i] + "=; max-age=0";
        }

        cookie = {};
        keys = [];
        this.length = 0;
    };




}
