/**
 * 公用方法封装处
 */
/*eslint-disable*/
import axios from "axios";
import qs from "qs";
import {message} from 'antd';
import {MockData} from '../mock/data.js'

const ISDEBUG = true; //调试模式  开启mock静态数据

/* global layer */
const tools = {
    $ajax(_obj, cb){		
		//调试模式
		if(ISDEBUG){
			var _json = MockData[_obj.url];
			if(!_json){
				cb({
					code:0,
					message:`${_obj.url} 路由未配置mock数据`
				});
			}
			cb(_json); 			
			return;
		}		
        axios.defaults.headers.common['token'] = localStorage.getItem('token');
        var that = this;
        if (typeof _obj == 'object' && _obj.url) {
            var _type = _obj.type ? _obj.type : "get",                //是否是get 请求  默认是get
                _loading = _obj.loading ? _obj.loading : 1,
                _login = _obj.login ? _obj.login : 1,              //是否需要登录   默认是需要登录否则跳转到登录页面
                _showError = _obj.mistake ? _obj.mistake : '1',       //是否有报错信息  默认是有
                _errCb = _obj.errCb ? _obj.errCb : '1',
                _data = _obj.data ? _obj.data : {};

            let _loadingIndex = 0;
            if (_loading * 1 === 1) {
                _loadingIndex = message.loading('请稍等...', 10);
            }
            if (_type === "get" || _type === "GET") {
                axios({
                    method: _type,
                    url: _obj.url,
                    params: _data
                }).then(_res => {
                    message.destroy();					
                    var res = _res.data;                    
                    if (_errCb == 2) {
                        if (cb && typeof cb === 'function') {
                            cb(_res);
                        }
                        return false;
                    }
                    if (res.r * 1 === 1) {
                        if (cb && typeof cb === 'function') {
                            cb(res);
                        }
                    } else {
                        if (res.r * 1 === 100001 && _login * 1 === 1) {
                            if (_showError == 1) {
                                message.warning("未登录")
                            }
                            setTimeout(() => {
                                location.href = '/login';
                            },2000);

                        } else {
                            if (_showError == 1) {
                                message.error(res.msg || '系统出错啦');
                            }
                        }
                    }
                }).catch((res)=> {
                    message.destroy();      
                    message.error("出错啦!");
                });
            } else {				
                axios({
                    method: _type,
                    url: _obj.url,
                    headers:_obj.headers?_obj.headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    },
                    data: _obj.headers?_data:qs.stringify(_data)
                }).then(_res => {
                    var res = _res.data;
                    message.destroy();					
                    if (_errCb == 2) {
                        if (cb && typeof cb === 'function') {
                            cb(_res);
                        }
                        return false;
                    }
                    if (res.r * 1 === 1 || res.r === 3) {
                        if (cb && typeof cb === 'function') {
                            cb(res);
                        }
                    } else {
                        if (res.r * 1 === 100001 && _login * 1 === 1) {
                            if (_showError == 1) {
                                message.warning("未登录")
                                setTimeout(() => {
                                    location.href = '/login';
                                },2000);
                            }
                        } else {
                            if (_showError == 1) {
                                message.error(res.msg || '系统出错啦');
                            }
                        }
                    }
                }).catch((res)=> {
                    message.destroy();
                    message.error("出错啦!");
                });
            }
        }
    },
    isMobile: function (mobile) {
        if (mobile && mobile.length != 11) return false;
        var reg = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$|19[0-9]{9}$/;
        if (mobile == '' || !reg.test(mobile)) {
            return false;
        }
        return true;
    },
    /**
     * 身份证号码格式是否正确
     * @param cardNo:string 身份证号码
     * @return true/false
     */
    isIdCardNo: function (cardNo) {
        if (cardNo == '' || !/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i.test(cardNo)) {
            return false;
        }
        return true;
    },
    /**
     * 写入cookie
     * @param key
     * @param val
     * @param day
     */
    setCookies(key, val, day, _path) {
        //获取当前日期
        var expiresDate = new Date();
        //设置生存期，一天后过期
        expiresDate.setDate(expiresDate.getDate() + (day ? day : 1));
        if (_path) {
            document.cookie = key + "=" + val + ";expires= " + expiresDate.toGMTString() + ";path=" + _path;//标记已经访问了站点
        } else {
            document.cookie = key + "=" + val + ";expires= " + expiresDate.toGMTString();//标记已经访问了站点
        }
    },
    getParam(b) {
        var c = document.location.href;
        if (!b) {
            return c
        }
        var d = new RegExp("[?&]" + b + "=([^&]+)", "g");
        var g = d.exec(c);
        var a = null;
        if (null != g) {
            try {
                a = decodeURIComponent(decodeURIComponent(g[1]))
            } catch (f) {
                try {
                    a = decodeURIComponent(g[1])
                } catch (f) {
                    a = g[1]
                }
            }
        }
        return a;
    },
    formatterDate(_time) {
        var _date = new Date(_time);
        var _n = _date.getFullYear() + '-',
            _y =  (_date.getMonth()+1 < 10 ? '0'+(_date.getMonth()+1) : _date.getMonth()+1) + '-' ,
            _r = _date.getDate() + '  ',
            _s = _date.getHours() + ':',
            _f = _date.getMinutes() == 0 ? '00' : _date.getMinutes() ;
        return _n + _y + _r + _s + _f;


    }
};


export {tools};
