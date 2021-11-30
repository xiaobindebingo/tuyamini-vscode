
interface IApi {
	name: string; // api名称
	desc: string; // api描述
	params?: any;
	tip?: string;
	docLink: string;
	updateTime: string;
}
interface Iparams {
	name?: string;
	type: {
		name: Function | number | boolean | string | { [property: string]: any };
		params?: Iparams[];
		returns: any;
	};
	defaultValue?: any;
	required?: boolean,
	body: String[];
	kind: number;
}

const tyAPIdata = {
	type: "object",
	"properties": {
		"getSystemInfo": {
			name: "ty.getSystemInfo",
			describe: "获取系统信息",
			docLink: 'https://developer.tuya.com/cn/docs/Tuya%20Mini-App/ty.getSystemInfo.md?id=Kaw3xpzurhd7k.bai',
			type: 'function',
			params: {
				type: "object",
				"properties": {
					"success": {
						type: "function",
						params: {
							type: 'object',
							properties: {
								system: {
									type: 'string',
									describe: '操作系统及版本',
								},
								brand: {
									type: 'string',
									describe: '设备品牌',
								},
								"model": {
									type: 'string',
									describe: "设备型号",
								},
								"platform": {
									type: "string",
									describe: '客户端平台',
								},
								"safeArea": {
									type: 'object',
									properties: {
										"left": {
											type: 'number',
											describe: '安全区域左上角横坐标',
										}
									}
								}
							}
						},
						returns: {

						}
					},
					"fail": {
						type: "function",
						params: {
						}
					}
				}
			},
			returns: {
				type: 'object',
			},
			code: {
				describe: "示例代码",
				type: 'array',
				items: [
					"ty.getSystemInfo({",
					"\tsuccess: (res) => {",
					"\t	},",
					"\tfail: () => {",
					"\t},",
					"\t});"
				]
				// type: 'string',
				// title:
				// 	`
				// ty.getSystemInfo({
				// 	success: (res) => {
				// 	},
				// 	fail: () => {
						
				// 	},
				// });
				// `
			},
		},

	}

};
// const doc: Idoc[] = [
// 	{
// 		label: 'getSystemInfo',
// 		kind: CompletionItemKind.Method,
// 		body: [
// 			`getSystemInfo({
// 				success(\${1: val}: {name: string, age: }) {}
// 		})
// 		`,
// 		],
// 		detail: {
// 			describe: '获取系统信息',
// 			docLink: 'https://developer.tuya.com/cn/docs/Tuya%20Mini-App/ty.getSystemInfo.md?id=Kaw3xpzurhd7k.bai'
// 		},
// 	},
// 	{
// 		label: 'setSystemInfo',
// 		kind: CompletionItemKind.Method,
// 		body: [
// 			`setSystemInfo({
// 			})
// 		`
// 		],
// 		detail: {
// 			describe: '设置系统信息',
// 			docLink: 'https://developer.tuya.com/cn/docs/Tuya%20Mini-App/ty.getSystemInfo.md?id=Kaw3xpzurhd7k.bai'
// 		},
// 	},
// ];

// export default doc;
