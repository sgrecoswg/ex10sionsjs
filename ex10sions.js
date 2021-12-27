
export function MathExtensions() {

   
        Math.sum = function (arr, prop) {

            var sum = 0;
            for (var i = 0; i < arr.length; i++) {
                if (prop) {
                    if (!isNaN(arr[i][prop])) {
                        sum += Number(arr[i][prop]);
                    } else {
                        console.warn('argument "' + prop + '" was not a number. That item was skipped.');
                    }
                } else {
                    sum += Number(arr[i]);
                }
            }
            return sum;
        }

        Math.avg = function (a) {
            return this.sum(a) / a.length;
        }
  
}


export function DateExtensions() {


    Date.minValue = function () {
        return new Date("0001-01-01T00:00:00");
    };

    Date.maxValue = function () {
        return new Date("9999-12-31T23:59:59.9999999");
    };

    Date.prototype.addDays = function (numberOfDays) {
        return new Date(this.setDate(this.getDate() + numberOfDays));
    };

    Date.prototype.subtractDays = function (numberOfDays) {
        return new Date(this.setDate(this.getDate() - numberOfDays));
    };

    Object.defineProperties(Date, {
        MIN_VALUE: {
            value: -8640000000000000 // A number, not a date
        },
        MAX_VALUE: {
            value: 8640000000000000
        },

    });
}

export function ArrayExtensions() {
    MathExtensions();

    Array.prototype.copy = function () {
        //returns an array by reference not value
        return [...this];
    }

    Array.prototype.deepCopy = function () {
        //returns an array by value not reference
        return JSON.parse(JSON.stringify(this));
    }

    Array.prototype.sum = function (expr) {
        var sum = 0;
        if (expr) {
            this.map(expr).forEach((i) => {
                if (!isNaN(i)) {
                    sum += Number(i);
                } else {
                    console.warn('argument "' + i + '" was not a number. That item was skipped.');
                }
            });
        } else {
            sum = Math.sum(this);
        }
        return sum;
    }

    Array.prototype.avg = function (expr) {
        if (expr) {
            return this.sum(expr) / this.length;
        } else {
            return Math.sum(this) / this.length;
        }
    }

    Array.prototype.max = function (expr) {
        if (expr) {
            var _items = this.map(expr);
            return Math.max(..._items);
        } else {
            console.log(this);
            return Math.max(...this);
        }
    }

    Array.prototype.min = function (expr) {
        if (expr) {
            var _items = this.map(expr);
            return Math.min(..._items);
        } else {
            return Math.min(...this);
        }
    }
}

export function Guid(){
    return {
        New: function() {
            //http://stackoverflow.com/a/2117523
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : r & 0x3 | 0x8;
                return v.toString(16);
            });
        }
    };
}

export function Cache() {
    var cache = (function () {

        return {
            getObject: function (key, fn) {
                var _itemFromCache = sessionStorage.getItem(key);
                //console.log(key,_itemFromCache);
                if (_itemFromCache !== null && _itemFromCache !== 'undefined') {
                    console.log('item was in cache for key ' + key, _itemFromCache);
                    return JSON.parse(_itemFromCache);
                } else {
                    if (!fn) {
                        console.warn('no item in cache and no function to call for key' + key);
                        return null;
                    } else {
                        console.info('no item in cache calling delegated function for key ' + key);
                        var newObj = fn();
                        cache.setObject(key, newObj);
                        return newObj;
                    }
                }
            },         
            setObject: function (key, obj, expiry) {
                var to = false;
                if (expiry && parseInt(expiry) > 0) {
                    to = setTimeout(function () {
                        console.info('cache expiring...clearing cache key [' + key + ']');
                        cache.remove(key);
                    }, parseInt(expiry));
                }
                //console.log('setting obj to cache with key ' + key + ' expires in ' + expiry + ' milliseconds');
                sessionStorage.setItem(key, JSON.stringify(obj));

                return obj;
            },
            remove: function (key) {
                console.log('removing item by key', key);
                sessionStorage.removeItem(key);
                console.log(sessionStorage.getItem(key));
                return sessionStorage;
            },
            clear: function (key) {
                return sessionStorage.clear();
            }
        };
    })();

    return cache;
}
