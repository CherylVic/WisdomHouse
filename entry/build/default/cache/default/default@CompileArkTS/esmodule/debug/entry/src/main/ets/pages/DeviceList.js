import display from '@ohos:display';
import router from '@ohos:router';
import UdpProcess from '@bundle:com.example.wisdomhouse_cloud/entry/ets/entryability/UdpProcess';
export class DeviceList extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.display_height = undefined;
        this.display_width = undefined;
        this.device_select = 0;
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.display_height !== undefined) {
            this.display_height = params.display_height;
        }
        if (params.display_width !== undefined) {
            this.display_width = params.display_width;
        }
        if (params.device_select !== undefined) {
            this.device_select = params.device_select;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    /***************************************************************
     * 函数名称: aboutToAppear
     * 说    明: 页面被调用时，在调用build()之前，执行aboutToAppear()
     * 参    数: 无
     * 返 回 值: 无
     ***************************************************************/
    aboutToAppear() {
        let mDisplay = display.getDefaultDisplaySync();
        let height = px2vp(mDisplay.height);
        let width = px2vp(mDisplay.width);
        this.display_height = height;
        this.display_width = width;
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Start);
            Column.padding({
                top: 10,
                left: 10,
                right: 10,
            });
            Column.backgroundColor('#ffc6c6c6');
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.padding({
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
            });
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel('返回');
            Button.fontSize(25);
            Button.onClick(() => {
                router.back(); // 返回上一页
            });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('选择智慧小屋');
            Text.fontSize(30);
            Text.fontColor('#ff00aa00');
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel('确定');
            Button.fontSize(25);
            Button.onClick(() => {
                if (UdpProcess.remote_device_status.length == 0) {
                    AlertDialog.show({
                        title: '告警',
                        message: '当前局域网内无智慧小屋',
                        autoCancel: true,
                        alignment: DialogAlignment.Bottom,
                        offset: { dx: 0, dy: -20 },
                        gridCount: 3,
                        confirm: {
                            value: '确定',
                            action: () => {
                                console.info('DeviceList: 当前局域网内无智慧小屋 and actiion');
                            }
                        },
                        cancel: () => {
                            console.info('DeviceList: 当前局域网内无智慧小屋 and cancel');
                        }
                    });
                    return;
                }
                UdpProcess.remote_device_select = this.device_select;
                router.back(); // 返回上一页
            });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            List.create();
            List.padding({
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
            });
            if (!isInitialRender) {
                List.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            ForEach.create();
            const forEachItemGenFunction = (_item, index) => {
                const item = _item;
                {
                    const isLazyCreate = true;
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ListItem.create(deepRenderFunction, isLazyCreate);
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const observedShallowRender = () => {
                        this.observeComponentCreation(itemCreation);
                        ListItem.pop();
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation(itemCreation);
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Row.create();
                            Row.width('100%');
                            Row.justifyContent(FlexAlign.SpaceAround);
                            if (!isInitialRender) {
                                Row.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Text.create("设备号：" + item.deviceId);
                            Text.fontSize(20);
                            if (!isInitialRender) {
                                Text.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        Text.pop();
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Button.createWithLabel('选择该设备');
                            Button.fontSize(20);
                            Button.onClick(() => {
                                this.device_select = index;
                            });
                            if (!isInitialRender) {
                                Button.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        Button.pop();
                        Row.pop();
                        ListItem.pop();
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.updateFuncByElmtId.set(elmtId, itemCreation);
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Row.create();
                            Row.width('100%');
                            Row.justifyContent(FlexAlign.SpaceAround);
                            if (!isInitialRender) {
                                Row.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Text.create("设备号：" + item.deviceId);
                            Text.fontSize(20);
                            if (!isInitialRender) {
                                Text.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        Text.pop();
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Button.createWithLabel('选择该设备');
                            Button.fontSize(20);
                            Button.onClick(() => {
                                this.device_select = index;
                            });
                            if (!isInitialRender) {
                                Button.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        Button.pop();
                        Row.pop();
                        ListItem.pop();
                    };
                    if (isLazyCreate) {
                        observedShallowRender();
                    }
                    else {
                        observedDeepRender();
                    }
                }
            };
            this.forEachUpdateFunction(elmtId, UdpProcess.remote_device_status, forEachItemGenFunction, undefined, true, false);
            if (!isInitialRender) {
                ForEach.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        ForEach.pop();
        List.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadDocument(new DeviceList(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
//# sourceMappingURL=DeviceList.js.map