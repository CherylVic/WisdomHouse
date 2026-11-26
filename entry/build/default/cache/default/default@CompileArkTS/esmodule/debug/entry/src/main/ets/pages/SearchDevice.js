import display from '@ohos:display';
import router from '@ohos:router';
import UdpProcess from '@bundle:com.example.wisdomhouse_cloud/entry/ets/entryability/UdpProcess';
export class SearchDevice extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.display_height = undefined;
        this.display_width = undefined;
        this.title_height = undefined;
        this.image_height = undefined;
        this.button_height = undefined;
        this.list_height = undefined;
        this.intervalId = 0 // 定时器
        ;
        this.is_findDevice = false;
        this.__deviceListCount = new ObservedPropertySimplePU(0
        /***************************************************************
         * 函数名称: updateData
         * 说    明: 定时器响应函数，用于定时同步读取通讯层的相关数据
         * 参    数: 无
         * 返 回 值: 无
         ***************************************************************/
        , this, "deviceListCount");
        this.updateData = () => {
            let i = 0;
            if (this.is_findDevice == false) {
                return;
            }
            this.deviceListCount = UdpProcess.remote_device_status.length;
            console.log("SearchDevice: deviceList.length = ", UdpProcess.remote_device_status.length);
            for (i = 0; i < UdpProcess.remote_device_status.length; i++) {
                console.log("SearchDevice: [" + i + "]: deviceId = " + UdpProcess.remote_device_status[i].deviceId + ", address = " + UdpProcess.remote_device_status[i].remote_info.address);
            }
        };
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.display_height !== undefined) {
            this.display_height = params.display_height;
        }
        if (params.display_width !== undefined) {
            this.display_width = params.display_width;
        }
        if (params.title_height !== undefined) {
            this.title_height = params.title_height;
        }
        if (params.image_height !== undefined) {
            this.image_height = params.image_height;
        }
        if (params.button_height !== undefined) {
            this.button_height = params.button_height;
        }
        if (params.list_height !== undefined) {
            this.list_height = params.list_height;
        }
        if (params.intervalId !== undefined) {
            this.intervalId = params.intervalId;
        }
        if (params.is_findDevice !== undefined) {
            this.is_findDevice = params.is_findDevice;
        }
        if (params.deviceListCount !== undefined) {
            this.deviceListCount = params.deviceListCount;
        }
        if (params.updateData !== undefined) {
            this.updateData = params.updateData;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__deviceListCount.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__deviceListCount.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get deviceListCount() {
        return this.__deviceListCount.get();
    }
    set deviceListCount(newValue) {
        this.__deviceListCount.set(newValue);
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
        this.title_height = this.display_height * 0.1;
        this.image_height = this.display_height * 0.3;
        this.button_height = this.display_height * 0.1;
        this.list_height = this.display_height * 0.1;
        this.deviceListCount = UdpProcess.remote_device_status.length;
        this.is_findDevice = false;
        this.intervalId = setInterval(this.updateData, 1000); // 开启定时器
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.width(this.display_width);
            Column.height(this.display_height);
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
            Text.create('搜索设备');
            Text.height(this.title_height);
            Text.width(this.display_width);
            Text.fontSize(50);
            Text.fontColor('#ff00aa00');
            Text.textAlign(TextAlign.Center);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 图片
            Image.create({ "id": 16777243, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" });
            // 图片
            Image.objectFit(ImageFit.Contain);
            // 图片
            Image.width(this.display_width);
            // 图片
            Image.height(this.image_height);
            if (!isInitialRender) {
                // 图片
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 按键
            Row.create();
            // 按键
            Row.width(this.display_width);
            // 按键
            Row.height(this.button_height);
            // 按键
            Row.justifyContent(FlexAlign.SpaceAround);
            if (!isInitialRender) {
                // 按键
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel('开始搜索');
            Button.onClick(() => {
                this.is_findDevice = true;
                UdpProcess.findDevice();
            });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel('停止搜索');
            Button.onClick(() => {
                this.is_findDevice = false;
            });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        // 按键
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 智慧小屋列表
            Row.create();
            // 智慧小屋列表
            Row.width(this.display_width);
            // 智慧小屋列表
            Row.height(this.list_height);
            // 智慧小屋列表
            Row.justifyContent(FlexAlign.SpaceAround);
            if (!isInitialRender) {
                // 智慧小屋列表
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('设备数目：' + this.deviceListCount);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel('选择设备');
            Button.onClick(() => {
                router.pushUrl({
                    url: "pages/DeviceList",
                }, (err) => {
                    if (err) {
                        console.error(`SearchDevice: pushUrl failed, code is ${err.code}, message is ${err.message}`);
                        return;
                    }
                    else {
                        console.log("SearchDevice: pushUrl success");
                    }
                });
            });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        // 智慧小屋列表
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadDocument(new SearchDevice(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
//# sourceMappingURL=SearchDevice.js.map