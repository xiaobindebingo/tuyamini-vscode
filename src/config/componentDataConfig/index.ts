const baseLink = 'https://developer.tuya.com/cn/docs/Tuya%20Mini-App/';
interface Ienum {
  value: any;
  desc: any
}
export interface IAttrs {
  name: any;
  required?: boolean;
  type?: {
    enum?: Ienum[];
    name: any;
    returns?: {
      name: any;
    };
  };
  desc?: any[],
  defaultValue?: any,
  since?: string;
  notices?: string;
}
export interface IComponent {
  desc: any[],
  attrs?: IAttrs[];
  tips?: any[];
  name: any;
  since?: string;
  docLink?: string;
  authorize?: {
    name: string;
    link: string;
  },
  bugs?: string[];
  notices?: string[];
  relateApis?: {
    name: string;
    link: string;
  }[]
}
const formComponentDataConfig: IComponent[] = [
  {
    name: 'button',
    desc: [
      "按钮"
    ],
  },
  {
    name: "checkbox-group",
    desc: [
      "多项选择器，内部由多个 checkbox 组成"
    ]
  },
  {
    "desc": [
      "多选项目。"
    ],
    "attrs": [
      {
        "name": "value",
        "type": {
          "name": "string"
        },
        "desc": [
          "`<checkbox/>`标识，选中时触发`<checkbox-group/>`的 change 事件，并携带 `<checkbox/>` 的 value"
        ]
      },
      {
        "name": "disabled",
        "type": {
          "name": "boolean"
        },
        "desc": [
          "是否禁用"
        ],
        "defaultValue": "false"
      },
      {
        "name": "checked",
        "type": {
          "name": "boolean"
        },
        "desc": [
          "当前是否选中，可用来设置默认选中"
        ],
        "defaultValue": "false"
      },
      {
        "name": "color",
        "type": {
          "name": "string"
        },
        "desc": [
          "checkbox的颜色，同css的color"
        ]
      }
    ],
    "name": "checkbox",
    "docLink": `${baseLink}checkbox?id=Kaw4rc9nn0c27`
  },
  {
    name: 'form',
    desc: ['表单']
  },
  {
    name: "input",
    desc: ['输入框'],
  },
  {
    name: "label",
    desc: ['用来改进表单组件的可用性']
  },
  {
    name: "picker",
    desc: ['从底部弹起的滚动选择器']
  },
  {
    name: 'picker-view',
    desc: ['嵌入页面的滚动选择器'],
  },
  {
    name: 'picker-view-column',
    desc: ['滚动选择器子项']
  },
  {
    name: 'radio',
    desc: ['单选项目']
  },
  {
    name: 'radio-group',
    desc: ['单项选择器，内部由多个 radio 组成']
  },
  {
    name: 'slider',
    desc: ['滑动选择器']
  },
  {
    name: 'switch',
    desc: ['开关选择器']
  },
  {
    name: 'textarea',
    desc: ['多行输入框']
  },
];

const navigatorComponentConfig: IComponent[] = [
  {
    name: 'navigator',
    desc: ['页面链接'],
  },
  {
    name: 'navigation-bar',
    desc: ['页面导航条配置节点，用于指定导航栏的一些属性'],
  },
];

const mediaComponentConfig: IComponent[] = [
  {
    name: 'image',
    desc: ['图片']
  },
  {
    name: 'svg',
    desc: ['svg图片']
  }
];

const canvasComponentConfig: IComponent[] = [
  {
    name: 'canvas',
    desc: ['画布']
  }
];



const componentDataConfig: IComponent[] = [
  {
    name: 'sjs',
    desc: ['模板中的 sjs 模块'],
    docLink: `${baseLink}SJS-introduce?id=Kb22rzxmyb096`,
    attrs: [{ name: 'src', required: true }, { name: 'module', required: true }],
  },
  {
    name: 'page-meta',
    desc: ['页面属性配置节点，用于指定页面的一些属性、监听页面事件'],
  },
  {
    "desc": [
      "视图容器。"
    ],
    "attrs": [
      {
        "name": "hover-class",
        "type": {
          "name": "string"
        },
        required: true,
        "desc": [
          "指定按下去的样式类。当 `hover-class=\"none\"` 时，没有点击态效果"
        ],
        "defaultValue": "none"
      },
      {
        "name": "hover-stop-propagation",
        "type": {
          "name": "boolean"
        },
        "desc": [
          "指定是否阻止本节点的祖先节点出现点击态"
        ],
        "since": "1.5.0",
        "defaultValue": "false"
      },
      {
        "name": "hover-start-time",
        "type": {
          "name": "number"
        },
        "desc": [
          "按住后多久出现点击态，单位毫秒"
        ],
        "defaultValue": "50"
      },
      {
        "name": "hover-stay-time",
        "type": {
          "name": "number"
        },
        "desc": [
          "手指松开后点击态保留时间，单位毫秒"
        ],
        "defaultValue": "400"
      }
    ],
    "tips": [
      `如果需要使用滚动视图，请使用 [scroll-view](${baseLink}scroll-view?id=Kaw4rbv7gnjvm)`
    ],
    "name": "view",
    "docLink": `${baseLink}view?id=Kaw4rbxd2zymt`
  },
  {
    "desc": [
      "滑块视图容器。"
    ],
    attrs: [
      {
        "name": "indicator-dots",
        "type": {
          "name": "boolean"
        },
        "desc": [
          "是否显示面板指示点"
        ],
        "defaultValue": "false"
      },
      {
        "name": "indicator-color",
        "type": {
          "name": "string"
        },
        "desc": [
          "指示点颜色"
        ],
        "defaultValue": "rgba(0, 0, 0, .3)"
      },
      {
        "name": "indicator-active-color",
        "type": {
          "name": "string"
        },
        "desc": [
          "当前选中的指示点颜色"
        ],
        "defaultValue": "#000000"
      },
      {
        "name": "autoplay",
        "type": {
          "name": "boolean"
        },
        "desc": [
          "是否自动切换"
        ],
        "defaultValue": "false"
      },
      {
        "name": "current",
        "type": {
          "name": "number"
        },
        "desc": [
          "当前所在滑块的 index"
        ],
        "defaultValue": "0"
      },
      {
        "name": "current-item-id",
        "type": {
          "name": "string"
        },
        "desc": [
          "当前所在滑块的 item-id ，不能与 current 被同时指定"
        ],
      },
      {
        "name": "interval",
        "type": {
          "name": "number"
        },
        "desc": [
          "自动切换时间间隔"
        ],
        "defaultValue": "5000"
      },
      {
        "name": "duration",
        "type": {
          "name": "number"
        },
        "desc": [
          "滑动动画时长"
        ],
        "defaultValue": "500"
      },
      {
        "name": "circular",
        "type": {
          "name": "boolean"
        },
        "desc": [
          "是否采用衔接滑动"
        ],
        "defaultValue": "false"
      },
      {
        "name": "vertical",
        "type": {
          "name": "boolean"
        },
        "desc": [
          "滑动方向是否为纵向"
        ],
        "defaultValue": "false"
      },
      {
        "name": "previous-margin",
        "type": {
          "name": "string"
        },
        "desc": [
          "前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值"
        ],
        "defaultValue": "0px"
      },
      {
        "name": "next-margin",
        "type": {
          "name": "string"
        },
        "desc": [
          "后边距，可用于露出后一项的一小部分"
        ],
        "since": "1.9.0",
        "defaultValue": "0px"
      },
      {
        "name": "display-multiple-items",
        "type": {
          "name": "number"
        },
        "desc": [
          "同时显示的滑块数量"
        ],
        "defaultValue": "1"
      },
      {
        "name": "skip-hidden-item-layout",
        "type": {
          "name": "boolean"
        },
        "desc": [
          "是否跳过未显示的滑块布局，设为 true 可优化复杂情况下的滑动性能，但会丢失隐藏状态滑块的布局信息"
        ],
        "defaultValue": "false"
      },
      {
        "name": "bindchange",
        "type": {
          "name": "function",
          "returns": {
            "name": "any"
          }
        },
        "desc": [
          "current 改变时会触发 change 事件，event.detail = {current: current, source: source}"
        ]
      },
      {
        "name": "bindanimationfinish",
        "type": {
          "name": "function",
          "returns": {
            "name": "any"
          }
        },
        "desc": [
          "动画结束时会触发 animationfinish 事件，event.detail 同上"
        ],
      }
    ],
    name: "swiper",
  },
  {
    "desc": [
      "可滚动视图区域"
    ],
    name: 'scroll-view'
  },
  {
    "desc": [
      "仅可放置在 swiper 组件中，宽高自动设置为 100%"
    ],
    name: 'swiper-item'
  },
  {
    "desc": [
      "movable-view 的可移动区域"
    ],
    name: 'movable-area'
  },
  {
    "desc": [
      "可移动的视图容器，在页面中可以拖拽滑动"
    ],
    name: 'movable-view'
  },
  {
    "desc": [
      "页面容器"
    ],
    name: "page-container"
  },
  {
    "desc": [
      "文本"
    ],
    name: 'text'
  },
  {
    "desc": [
      "图标"
    ],
    name: 'icon'
  },
  {
    "desc": [
      "进度条"
    ],
    name: "progress"
  },
  {
    desc: [
      "富文本"
    ],
    name: 'rich-text',
  }
  
];

const allDataConfig = [
   ...componentDataConfig, 
   ...formComponentDataConfig,
   ...navigatorComponentConfig, 
   ...mediaComponentConfig,
   ...canvasComponentConfig].map( item => {
    if (!item.docLink){
      item.docLink = `${baseLink}index?id=Kaw4rc1ew2l9c`;
    }

    return item;
   });

export default allDataConfig;
