# electron-signature 

``` 
npm install electron-signature
```

## 使用
``` javascript
import Signature from 'electron-signature';

<div id="signature-container"></div>

let signature = new Signature({
  id: 'signature-container',
  lineWidth: 2,
});

```

## 初始化参数

参数 | 类型 | 说明 | 是否必填
-| -| -| -|
id  | String | 容器ID | Y
height | Number | 画布高度 | N
background | String | 画布背景 | N
resetBtn | Boolean | 是否显示重签按钮 | N
lineWidth | Number | 线条粗细 | N
lineColor | String | 线条颜色 | N


## 实例 事件/参数

事件/参数 | 类型 | 说明 
-| -| -
getImage | function | 获取签名图片
cleanStroke | function | 清空笔画
strokeRecord | field | 笔画点记录
