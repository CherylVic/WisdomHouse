import display from '@ohos:display';
import UdpProcess from '@bundle:com.example.wisdomhouse_cloud/entry/ets/entryability/UdpProcess';
export class WisdomHouse extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.display_height = 1280;
        this.display_width = 750;
        this.title_height = 100;
        this.font_size = 20;
        this.color_title = 'sff00aa00';
        this.color_device = '#ffeca7a7';
        this.color_status = '#ffffffff';
        this.color_contorl = '#ff6e89ec';
        this.intervalId = 0 // 定时器，定时取智慧小屋的设备信息
        ;
        this.__wisdomHouseStatus = new ObservedPropertyObjectPU({
            deviceId: "",
            name: "",
            temperator: 0,
            humidity: 0,
            lumination: 0,
            is_rain: false,
            is_smoke: false,
            is_fire: false,
            /////////////////
            door_status: false,
            garage_status: false,
            window_status: false,
            light_status: false, // 灯开关
        }, this, "wisdomHouseStatus");
        this.__remote_address = new ObservedPropertySimplePU("", this, "remote_address");
        this.__remote_port = new ObservedPropertySimplePU(0
        /***************************************************************
         * 函数名称: showAlertDialog
         * 说    明: 报警对话框
         * 参    数:
         *      @title      对话框的标题
         *      @message    对话框的内容
         *      @confirm    对话框的确定按键的显示内容
         *      @action     对话框的确定按键后打印信息
         *      @cancel     对话框的取消按键后打印信息
         * 返 回 值: 无
         ***************************************************************/
        , this, "remote_port");
        this.updateData = () => {
            console.info("WisdomHouse: updateData => ");
            let select = UdpProcess.remote_device_select;
            if (select >= UdpProcess.remote_device_status.length) {
                console.error("WisdomHouseShow: updateData => WisdomHouse.checkWisdomHouseSelect() failled");
                return;
            }
            this.wisdomHouseStatus.deviceId = UdpProcess.remote_device_status[select].deviceId;
            this.wisdomHouseStatus.name = UdpProcess.remote_device_status[select].remote_info.address;
            this.wisdomHouseStatus.temperator = UdpProcess.remote_device_status[select].temperator;
            this.wisdomHouseStatus.humidity = UdpProcess.remote_device_status[select].humidity;
            this.wisdomHouseStatus.lumination = UdpProcess.remote_device_status[select].lumination;
            this.wisdomHouseStatus.is_rain = (UdpProcess.remote_device_status[select].is_rain == 0) ? (false) : (true);
            this.wisdomHouseStatus.is_smoke = (UdpProcess.remote_device_status[select].is_smoke == 0) ? (false) : (true);
            this.wisdomHouseStatus.is_fire = (UdpProcess.remote_device_status[select].is_fire == 0) ? (false) : (true);
            this.wisdomHouseStatus.door_status = false;
            this.wisdomHouseStatus.garage_status = false;
            this.wisdomHouseStatus.window_status = false;
            this.wisdomHouseStatus.light_status = false;
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
        if (params.font_size !== undefined) {
            this.font_size = params.font_size;
        }
        if (params.color_title !== undefined) {
            this.color_title = params.color_title;
        }
        if (params.color_device !== undefined) {
            this.color_device = params.color_device;
        }
        if (params.color_status !== undefined) {
            this.color_status = params.color_status;
        }
        if (params.color_contorl !== undefined) {
            this.color_contorl = params.color_contorl;
        }
        if (params.intervalId !== undefined) {
            this.intervalId = params.intervalId;
        }
        if (params.wisdomHouseStatus !== undefined) {
            this.wisdomHouseStatus = params.wisdomHouseStatus;
        }
        if (params.remote_address !== undefined) {
            this.remote_address = params.remote_address;
        }
        if (params.remote_port !== undefined) {
            this.remote_port = params.remote_port;
        }
        if (params.updateData !== undefined) {
            this.updateData = params.updateData;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__wisdomHouseStatus.purgeDependencyOnElmtId(rmElmtId);
        this.__remote_address.purgeDependencyOnElmtId(rmElmtId);
        this.__remote_port.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__wisdomHouseStatus.aboutToBeDeleted();
        this.__remote_address.aboutToBeDeleted();
        this.__remote_port.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get wisdomHouseStatus() {
        return this.__wisdomHouseStatus.get();
    }
    set wisdomHouseStatus(newValue) {
        this.__wisdomHouseStatus.set(newValue);
    }
    get remote_address() {
        return this.__remote_address.get();
    }
    set remote_address(newValue) {
        this.__remote_address.set(newValue);
    }
    get remote_port() {
        return this.__remote_port.get();
    }
    set remote_port(newValue) {
        this.__remote_port.set(newValue);
    }
    /***************************************************************
     * 函数名称: showAlertDialog
     * 说    明: 报警对话框
     * 参    数:
     *      @title      对话框的标题
     *      @message    对话框的内容
     *      @confirm    对话框的确定按键的显示内容
     *      @action     对话框的确定按键后打印信息
     *      @cancel     对话框的取消按键后打印信息
     * 返 回 值: 无
     ***************************************************************/
    showAlertDialog(title, message, confirm, action, cancel) {
        AlertDialog.show({
            title: title,
            message: message,
            autoCancel: true,
            alignment: DialogAlignment.Bottom,
            offset: { dx: 0, dy: -20 },
            gridCount: 3,
            confirm: {
                value: confirm,
                action: () => {
                    console.info('WisdomHouse: ' + action);
                }
            },
            cancel: () => {
                console.info('WisdomHouse: ' + cancel);
            }
        });
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
        this.title_height = height * 0.1;
        this.updateData();
        this.intervalId = setInterval(this.updateData, 1000); // 定时器，设置为1秒1次
        // 查看是否配置对
        if (UdpProcess.remote_device_select >= UdpProcess.remote_device_status.length) {
            this.showAlertDialog('报警', '未选中正确的设备号', '确定', '未选中正确的设备号', '未选中正确的设备号');
            // 直接返回
            return;
        }
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/WisdomHouse.ets(145:5)");
            Column.width(this.display_width);
            Column.height(this.display_height);
            Column.justifyContent(FlexAlign.Start);
            Column.padding({
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
            });
            Column.backgroundColor('#ffc6c6c6');
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('智慧小屋');
            Text.debugLine("pages/WisdomHouse.ets(146:7)");
            Text.height(this.title_height);
            Text.width(this.display_width);
            Text.fontSize(50);
            Text.fontColor(this.color_title);
            Text.textAlign(TextAlign.Center);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 设备信息
            Column.create({ space: 10 });
            Column.debugLine("pages/WisdomHouse.ets(154:7)");
            // 设备信息
            Column.alignItems(HorizontalAlign.Start);
            // 设备信息
            Column.justifyContent(FlexAlign.Start);
            // 设备信息
            Column.width('100%');
            // 设备信息
            Column.backgroundColor(this.color_device);
            // 设备信息
            Column.padding({
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
            });
            if (!isInitialRender) {
                // 设备信息
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('设备号：' + this.wisdomHouseStatus.deviceId);
            Text.debugLine("pages/WisdomHouse.ets(155:9)");
            Text.fontSize(this.font_size);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('设备名称：' + this.wisdomHouseStatus.name);
            Text.debugLine("pages/WisdomHouse.ets(157:9)");
            Text.fontSize(this.font_size);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        // 设备信息
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create({ space: 10 });
            Row.debugLine("pages/WisdomHouse.ets(172:7)");
            Row.height(100);
            Row.width('100%');
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.SpaceEvenly);
            Row.backgroundColor(this.color_status);
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
            Column.create({ space: 10 });
            Column.debugLine("pages/WisdomHouse.ets(173:9)");
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create({ "id": 16777235, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" });
            Image.debugLine("pages/WisdomHouse.ets(174:11)");
            Image.objectFit(ImageFit.Contain);
            Image.height(50);
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.wisdomHouseStatus.temperator + ' ' + '°C');
            Text.debugLine("pages/WisdomHouse.ets(177:11)");
            Text.fontSize(this.font_size);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create({ space: 10 });
            Column.debugLine("pages/WisdomHouse.ets(181:9)");
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create({ "id": 16777231, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" });
            Image.debugLine("pages/WisdomHouse.ets(182:11)");
            Image.objectFit(ImageFit.Contain);
            Image.height(50);
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.wisdomHouseStatus.humidity + ' ' + 'RH');
            Text.debugLine("pages/WisdomHouse.ets(185:11)");
            Text.fontSize(this.font_size);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create({ space: 10 });
            Column.debugLine("pages/WisdomHouse.ets(189:9)");
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create({ "id": 16777243, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" });
            Image.debugLine("pages/WisdomHouse.ets(190:11)");
            Image.objectFit(ImageFit.Contain);
            Image.height(50);
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.wisdomHouseStatus.lumination + ' ' + 'Lux');
            Text.debugLine("pages/WisdomHouse.ets(193:11)");
            Text.fontSize(this.font_size);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create({ space: 10 });
            Row.debugLine("pages/WisdomHouse.ets(210:7)");
            Row.height(100);
            Row.width('100%');
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.SpaceAround);
            Row.backgroundColor(this.color_status);
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
            Column.create({ space: 10 });
            Column.debugLine("pages/WisdomHouse.ets(211:9)");
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create((this.wisdomHouseStatus.is_rain == true) ? { "id": 16777227, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" } : { "id": 16777236, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" });
            Image.debugLine("pages/WisdomHouse.ets(212:11)");
            Image.objectFit(ImageFit.Contain);
            Image.height(50);
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create((this.wisdomHouseStatus.is_rain == true) ? "下雨" : "晴天");
            Text.debugLine("pages/WisdomHouse.ets(215:11)");
            Text.fontSize(this.font_size);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create({ space: 10 });
            Column.debugLine("pages/WisdomHouse.ets(219:9)");
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create((this.wisdomHouseStatus.is_smoke == true) ? { "id": 16777219, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" } : { "id": 16777224, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" });
            Image.debugLine("pages/WisdomHouse.ets(220:11)");
            Image.objectFit(ImageFit.Contain);
            Image.height(50);
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create((this.wisdomHouseStatus.is_smoke == true) ? "冒烟" : "安全");
            Text.debugLine("pages/WisdomHouse.ets(223:11)");
            Text.fontSize(this.font_size);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create({ space: 10 });
            Column.debugLine("pages/WisdomHouse.ets(227:9)");
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create((this.wisdomHouseStatus.is_fire == true) ? { "id": 16777220, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" } : { "id": 16777225, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" });
            Image.debugLine("pages/WisdomHouse.ets(228:11)");
            Image.objectFit(ImageFit.Contain);
            Image.height(50);
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create((this.wisdomHouseStatus.is_fire == true) ? "火灾" : "安全");
            Text.debugLine("pages/WisdomHouse.ets(231:11)");
            Text.fontSize(this.font_size);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 设备控制
            Row.create({ space: 10 });
            Row.debugLine("pages/WisdomHouse.ets(248:7)");
            // 设备控制
            Row.height(100);
            // 设备控制
            Row.width('100%');
            // 设备控制
            Row.alignItems(VerticalAlign.Center);
            // 设备控制
            Row.justifyContent(FlexAlign.SpaceAround);
            // 设备控制
            Row.backgroundColor(this.color_contorl);
            // 设备控制
            Row.padding({
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
            });
            if (!isInitialRender) {
                // 设备控制
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create({ space: 5 });
            Column.debugLine("pages/WisdomHouse.ets(249:9)");
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create((this.wisdomHouseStatus.door_status == true) ? { "id": 16777238, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" } : { "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" });
            Image.debugLine("pages/WisdomHouse.ets(250:11)");
            Image.objectFit(ImageFit.Contain);
            Image.backgroundColor(this.color_contorl);
            Image.height(50);
            Image.onClick(() => {
                if (this.wisdomHouseStatus.door_status == false) {
                    this.wisdomHouseStatus.door_status = true;
                    UdpProcess.setDoor(this.wisdomHouseStatus.deviceId, 1);
                }
                else {
                    this.wisdomHouseStatus.door_status = false;
                    UdpProcess.setDoor(this.wisdomHouseStatus.deviceId, 0);
                }
            });
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel((this.wisdomHouseStatus.door_status == true) ? "关门" : "开门");
            Button.debugLine("pages/WisdomHouse.ets(263:11)");
            Button.fontSize(this.font_size);
            Button.fontColor(Color.Black);
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                if (this.wisdomHouseStatus.door_status == false) {
                    this.wisdomHouseStatus.door_status = true;
                    UdpProcess.setDoor(this.wisdomHouseStatus.deviceId, 1);
                }
                else {
                    this.wisdomHouseStatus.door_status = false;
                    UdpProcess.setDoor(this.wisdomHouseStatus.deviceId, 0);
                }
            });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create({ space: 5 });
            Column.debugLine("pages/WisdomHouse.ets(278:9)");
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create((this.wisdomHouseStatus.garage_status == true) ? { "id": 16777232, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" } : { "id": 16777237, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" });
            Image.debugLine("pages/WisdomHouse.ets(279:11)");
            Image.objectFit(ImageFit.Contain);
            Image.backgroundColor(this.color_contorl);
            Image.height(50);
            Image.onClick(() => {
                if (this.wisdomHouseStatus.garage_status == false) {
                    this.wisdomHouseStatus.garage_status = true;
                    UdpProcess.setGarageDoor(this.wisdomHouseStatus.deviceId, 1);
                }
                else {
                    this.wisdomHouseStatus.garage_status = false;
                    UdpProcess.setGarageDoor(this.wisdomHouseStatus.deviceId, 0);
                }
            });
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel((this.wisdomHouseStatus.garage_status == true) ? "关车库门" : "开车库门");
            Button.debugLine("pages/WisdomHouse.ets(292:11)");
            Button.fontSize(this.font_size);
            Button.fontColor(Color.Black);
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                if (this.wisdomHouseStatus.garage_status == false) {
                    this.wisdomHouseStatus.garage_status = true;
                    UdpProcess.setGarageDoor(this.wisdomHouseStatus.deviceId, 1);
                }
                else {
                    this.wisdomHouseStatus.garage_status = false;
                    UdpProcess.setGarageDoor(this.wisdomHouseStatus.deviceId, 0);
                }
            });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        Column.pop();
        // 设备控制
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create({ space: 10 });
            Row.debugLine("pages/WisdomHouse.ets(321:7)");
            Row.height(100);
            Row.width('100%');
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.SpaceAround);
            Row.backgroundColor(this.color_contorl);
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
            Column.create({ space: 5 });
            Column.debugLine("pages/WisdomHouse.ets(322:9)");
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create((this.wisdomHouseStatus.window_status == true) ? { "id": 16777245, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" } : { "id": 16777242, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" });
            Image.debugLine("pages/WisdomHouse.ets(323:11)");
            Image.objectFit(ImageFit.Contain);
            Image.backgroundColor(this.color_contorl);
            Image.height(50);
            Image.onClick(() => {
                if (this.wisdomHouseStatus.window_status == false) {
                    this.wisdomHouseStatus.window_status = true;
                    UdpProcess.setWindow(this.wisdomHouseStatus.deviceId, 1);
                }
                else {
                    this.wisdomHouseStatus.window_status = false;
                    UdpProcess.setWindow(this.wisdomHouseStatus.deviceId, 0);
                }
            });
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel((this.wisdomHouseStatus.window_status == true) ? "关窗" : "开窗");
            Button.debugLine("pages/WisdomHouse.ets(336:11)");
            Button.fontSize(this.font_size);
            Button.fontColor(Color.Black);
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                if (this.wisdomHouseStatus.window_status == false) {
                    this.wisdomHouseStatus.window_status = true;
                    UdpProcess.setWindow(this.wisdomHouseStatus.deviceId, 1);
                }
                else {
                    this.wisdomHouseStatus.window_status = false;
                    UdpProcess.setWindow(this.wisdomHouseStatus.deviceId, 0);
                }
            });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create({ space: 5 });
            Column.debugLine("pages/WisdomHouse.ets(351:9)");
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create((this.wisdomHouseStatus.light_status == true) ? { "id": 16777226, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" } : { "id": 16777239, "type": 20000, params: [], "bundleName": "com.example.wisdomhouse_cloud", "moduleName": "entry" });
            Image.debugLine("pages/WisdomHouse.ets(352:11)");
            Image.objectFit(ImageFit.Contain);
            Image.backgroundColor(this.color_contorl);
            Image.height(50);
            Image.onClick(() => {
                if (this.wisdomHouseStatus.light_status == false) {
                    this.wisdomHouseStatus.light_status = true;
                    UdpProcess.setLight(this.wisdomHouseStatus.deviceId, 1);
                }
                else {
                    this.wisdomHouseStatus.light_status = false;
                    UdpProcess.setLight(this.wisdomHouseStatus.deviceId, 0);
                }
            });
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel((this.wisdomHouseStatus.light_status == true) ? "关灯" : "开灯");
            Button.debugLine("pages/WisdomHouse.ets(365:11)");
            Button.fontSize(this.font_size);
            Button.fontColor(Color.Black);
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                if (this.wisdomHouseStatus.light_status == false) {
                    this.wisdomHouseStatus.light_status = true;
                    UdpProcess.setLight(this.wisdomHouseStatus.deviceId, 1);
                }
                else {
                    this.wisdomHouseStatus.light_status = false;
                    UdpProcess.setLight(this.wisdomHouseStatus.deviceId, 0);
                }
            });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        Column.pop();
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadDocument(new WisdomHouse(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
