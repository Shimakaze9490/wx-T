/**
 * 注册拦截器.拦截器最核心代码
 */
class InterceptorManager {
    //构造函数:调用__init进行初始化
    constructor() {
        this.__init();
    }

    //清空handlers
    __init() {
        this.handlers = [];
    }

    /**
     * 添加一个拦截器:四个参数
     */
    use(obj) {
        this.handlers.push({
            request: obj.request,
            requestError: obj.requestError,
            response: obj.response,
            responseError: obj.responseError
        });
        return this.handlers.length - 1;  //返回下标index
    }

    /**
     * 移除一个拦截器
     */
    eject(id) {
        if(this.handlers[id]) {
            this.handlers[id] = null;
        }
    }

    /**
     * 遍历全部注册的拦截器,参数是需要遍历执行的函数
     */
    forEach(fn) {
        this.handlers.forEach(h => {
            if(h !== null) {
                fn(h);
            }
        });
    }
}

export default InterceptorManager;