### 技术栈
 - react
 - antd
 - react-router
 - mobx
 - canvas
 - ES6
 - cookie

### 项目目录结构

assets----存储静态图片资源和共用icon图标<br/>
components----存储共用组件<br/>
  |- GridList 列表组件 封装很强大  支持 子列表、改变列宽、行数据是否可选择等
routes----业务页面入口和常用模板<br/> 
store----状态管理<br/>
utils----工具函数<br/>
mock---- 模拟数据<br/>
<br/>

## 项目启动流程
```
1、安装node插件
   cnpm install

2、启动项目
   npm run start

3、发布项目
   npm run build

4、package.json 内配置proxy  可直连接口服务器进行数据联调

5、utils/tools.js 可配置
   const ISDEBUG = false; //调试模式  开启mock静态数据
	
```
