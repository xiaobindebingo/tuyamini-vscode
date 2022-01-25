/**
 * @name Picker
 * @desc 描述fdsfsd。第二行。第三行
 * @since 1.0.0
 * @pluginSupport true
 * @tips 如果需要使用滚动视图，请使用 [scroll-view]
 */
 Component({
  behaviors: ['ty-base', 'ty-data-Component'],
  properties: {
    /**
     * @desc xxx
     * @required true
     * @defaultValue []
     * @enum primary|warning|default
     * @since 1.0.0 如果没有取上面的
     */
    range: {
      type: Array,
      value: []
    },
    /**
     * @desc 我是value属性
     * @required false
     * @defaultValue ''
     * @enum 
     * @since 2.0.0 
     */
    value: {
      type: string,
      value: '',
      public: !0
    },
    mode: {
      type: String,
      value: 'selector',
      public: !0,
      option: {
        selector: true,
        multiSelector: true,
        time: true,
        data: true
      }
    },
    fields: {
      type: String,
      value: 'day',
      public: !0
    },
    start: {
      type: String,
      value: '',
      public: !0
    },
    end: {
      type: String,
      value: '',
      public: !0
    },
    disabled: {
      type: Boolean,
      value: !1,
      public: !0
    },
    rangeKey: {
      type: String,
      value: '',
      public: !0
    },
    bindchange: {
      type: Function,
      innerUse: !1
    },
    bindcancel: {
      type: Function,
      innerUse: !1
    }
  },
  listeners: {
    'this.tap': 'showPickerView'
  },
  // 当range 发生改变时修改this.range
  _handleSetRangeData: function _handleSetRangeData() {
    var _this = this;

    // 只有多选，需要更新选择框array
    if (this.mode === 'multiSelector') {
      var pickerData = [];

      if (this.rangeKey) {
        this.range.map(function (i) {
          pickerData.push(i.map(function (j) {
            return j[_this.rangeKey];
          }));
        });
      }

      this.picker && this.picker.updateArray(this.rangeKey ? pickerData : this.range);
    }
  },
  setcurrent: function setcurrent(detail) {
    // 多选的时候，选择完成后需要更新联动后面的内容
    if (this.mode === 'multiSelector') {
      console.log(this);
      this.value = this.value.map(function (item, index) {
        if (index === detail.column) {
          item = detail.value;
        }

        if (index > detail.column) {
          item = 0;
        }

        return item;
      });
      this.picker.updateCurr(this.value);
    }
  },
  resetFormData: function resetFormData() {
    if (this.mode == 'selector') {
      this.value = -1;
    } else if (this.mode == 'multiSelector') {
      this.value = new Array(this.range.length).fill(0).join(',');
    } else {
      this.value = '';
    }
  },
  getFormData: function getFormData(formCallback) {
    this.__pickerShow ? this.__formCallback = formCallback : typeof formCallback === 'function' && formCallback(this.value);
  },
  formGetDataCallback: function formGetDataCallback() {
    typeof this.__formCallback === 'function' && this.__formCallback(this.value);
    this.__formCallback = void 0;
  },
  showPickerView: function showPickerView() {
    if (this.mode == 'date' || this.mode == 'time') {
      this.showDatePickerView();
    } else if (this.mode === 'multiSelector') {
      this.showMultiSelector();
    } else if (this.mode === 'selector') {
      this.showSelector();
    }
  },
  getCustomerStyle: function getCustomerStyle() {
    var customerStyle = this.$$.getBoundingClientRect();
    return {
      width: customerStyle.width,
      height: customerStyle.height,
      left: customerStyle.left + window.scrollX,
      top: customerStyle.top + window.scrollY
    };
  },
  showSelector: function showSelector(e) {
    var that = this;

    if (!this.disabled) {
      var _value = parseInt(this.value);

      (isNaN(_value) || _value >= this.range.length) && (_value = 0);
      var pickerData = [];

      if (this.rangeKey) {
        for (var idx = 0; idx < this.range.length; idx++) {
          var r = this.range[idx];
          pickerData.push(r[this.rangeKey] + '');
        }
      } else {
        // pickerData ["0", "1", "2"]
        for (var o = 0; o < this.range.length; o++) {
          pickerData.push(this.range[o] + '');
        }
      }

      var picker = new Picker({
        array: pickerData,
        current: _value,
        style: this.getCustomerStyle(),
        pickerCom: this.$$,
        callback: function callback(res) {
          if (res.type === 'select') {
            that.value = res.index;
            that.resetPickerState();
            that.formGetDataCallback();
            that.triggerEvent('change', {
              value: res.index
            });
          } else {
            that.triggerEvent('cancel');
          }
        }
      });
      picker.show();
      this.__pickerShow = !0;
    }
  },
  showMultiSelector: function showMultiSelector(e) {
    var _this2 = this;

    var that = this;

    if (!this.disabled) {
      var pickerData = [];

      if (this.rangeKey) {
        this.range.map(function (i) {
          pickerData.push(i.map(function (j) {
            return j[_this2.rangeKey];
          }));
        });
      }

      var picker = new MutiPicker({
        array: this.rangeKey ? pickerData : this.range,
        rangeKey: this.rangeKey,
        current: this.value,
        style: this.getCustomerStyle(),
        pickerCom: this.$$,
        pickerDomain: this,
        callback: function callback(res) {
          if (res.type === 'select') {
            that.value = res.detail;
            that.resetPickerState();
            that.formGetDataCallback();
            that.triggerEvent('change', {
              value: res.detail
            });
          } else {
            that.triggerEvent('cancel');
          }
        }
      });
      this.picker = picker;
      picker.show();
      this.__pickerShow = !0;
    }
  },
  showDatePickerView: function showDatePickerView() {
    var that = this;

    if (!this.disabled) {
      if (this.mode === 'date') {
        var picker = new DatePicker({
          range: {
            start: this.start,
            end: this.end
          },
          mode: this.mode,
          current: this.value,
          fields: this.fields,
          style: this.getCustomerStyle(),
          pickerCom: this.$$,
          callback: function callback(res) {
            if (res.type === 'select') {
              that.value = res.index;
              that.resetPickerState();
              that.formGetDataCallback();
              that.triggerEvent('change', {
                value: res.detail
              });
            } else {
              that.triggerEvent('cancel');
            }
          }
        });
        picker.show();
      } else if (this.mode === 'time') {
        var _picker = new TimePicker({
          range: {
            start: this.start,
            end: this.end
          },
          mode: this.mode,
          current: this.value,
          fields: this.fields,
          style: this.getCustomerStyle(),
          pickerCom: this.$$,
          callback: function callback(res) {
            if (res.type === 'select') {
              that.value = res.index;
              that.resetPickerState();
              that.formGetDataCallback();
              that.triggerEvent('change', {
                value: res.detail
              });
            } else {
              that.triggerEvent('cancel');
            }
          }
        });

        _picker.show();
      }

      this.__pickerShow = !0;
    }
  },
  resetPickerState: function resetPickerState() {
    this.__pickerShow = !1;
  }
});
